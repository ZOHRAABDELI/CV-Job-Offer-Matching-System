import React, { useEffect, useState, useRef, Fragment } from "react";
import TableComponent from "../components/matching/table_component.jsx";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

const MatchedCVsPage = () => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const rowsPerPage = 8;
  const [weightsValid, setWeightsValid] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    show: false,
    success: false,
    message: "",
  });

  const [weights, setWeights] = useState({
    Education: 25,
    "Work Experience": 25,
    Skills: 25,
    Mission: 25,
  });

  
  const handleClosePopup = () => {
    setShowSuccessPopup(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/matched-cvs");
        setJsonData(response.data.ranking ?? []);
      } catch (error) {
        console.error("Failed to fetch matched CVs:", error);
      } finally {
      setLoading(false);

      }
    };
  
    fetchData();
  }, []); // <-- VERY IMPORTANT: Empty dependency array!
   // Re-run only when processing changes
  

  const currentRows = jsonData
    ? jsonData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];

  const totalPages = jsonData ? Math.ceil(jsonData.length / rowsPerPage) : 1;

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadStatus({
        show: true,
        success: null,
        message: `Uploading ${files.length} CV${files.length > 1 ? "s" : ""}...`,
      });
      setLoading(true);
  
      const filePromises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Data = reader.result.split(",")[1];
            resolve({
              filename: file.name,
              content: base64Data,
              type: file.type,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
  
      try {
        const cvFiles = await Promise.all(filePromises);
  
        const response = await axios.post(
          "http://localhost:5000/api/upload-cvs",
          cvFiles,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
  
        if (response.data && response.data.success) {
          setUploadStatus({
            show: true,
            success: true,
            message: `${files.length} CV${files.length > 1 ? "s" : ""} uploaded and processed successfully!`,
          });
  
          // Now fetch matched CVs and THEN stop loading
          const matchedResponse = await axios.get("http://localhost:5000/api/matched-cvs");
          if (matchedResponse.data && matchedResponse.data.ranking) {
            setJsonData(matchedResponse.data.ranking);
          }
        }
      } catch (error) {
        console.error("Error uploading CV files:", error);
        setUploadStatus({
          show: true,
          success: false,
          message: `Error: ${error.response?.data?.message || "Failed to upload CVs. Please try again."}`,
        });
      } finally {
        setLoading(false); // <-- always stop loading, success or fail
  
        setTimeout(() => {
          setUploadStatus((prev) => ({ ...prev, show: false }));
        }, 5000);
      }
    }
  };
  
  
  const recalculateTotalScore = (sectionScores) => {
    const weightedScore = Object.keys(sectionScores).reduce((total, section) => {
      return total + sectionScores[section] * (weights[section] || 0);
    }, 0);
    return weightedScore / 100;
  };

  const handleWeightChange = (field, value) => {
    const newValue = parseFloat(value);

    const updatedWeights = { ...weights, [field]: newValue };

    const totalWeight = Object.values(updatedWeights).reduce((sum, weight) => sum + weight, 0);

    if (totalWeight > 100) {
      const diff = totalWeight - 100;
      let remainingWeight = 100 - newValue;
      for (const key in updatedWeights) {
        if (key !== field) {
          updatedWeights[key] = (updatedWeights[key] / (totalWeight - newValue)) * remainingWeight;
        }
      }
    }

    setWeights(updatedWeights);

    const totalWeightAfterChange = Object.values(updatedWeights).reduce((sum, weight) => sum + weight, 0);
    setWeightsValid(Math.abs(totalWeightAfterChange - 100) <= 0.01);
  };

  const handleSaveWeights = async () => {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    if (Math.abs(totalWeight - 100) <= 0.01) {
      const updatedJsonData = jsonData.map((item) => ({
        ...item,
        total_score: recalculateTotalScore(item.section_scores),
      }));
      setJsonData(updatedJsonData);
      setWeightsValid(true);
      setIsModalOpen(false);
      setShowSuccessPopup(true);
    } else {
      setWeightsValid(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="flex justify-start items-center mb-6">
        <img src="/images/mobilis.svg" alt="Mobilis Logo" className="w-40 h-auto" />
      </div>
      <h2 className="text-green-600 text-3xl font-bold mb-6">Matched CVs</h2>

      {uploadStatus.show && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            uploadStatus.success === null
              ? "bg-blue-100 text-blue-700"
              : uploadStatus.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          } flex items-center justify-between`}
        >
          <div className="flex items-center">
            {uploadStatus.success === null && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {uploadStatus.success === true && (
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
            {uploadStatus.success === false && (
              <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
            <p>{uploadStatus.message}</p>
          </div>
          <button onClick={() => setUploadStatus((prev) => ({ ...prev, show: false }))} className="text-gray-500 hover:text-gray-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

  {loading ? (
      <div className="flex justify-center items-center">
        <svg
          className="animate-spin h-10 w-10 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    ) : jsonData && jsonData.length > 0 ? (
      <TableComponent data={currentRows} />
    ) : (
      <p className="text-gray-500">No data available...</p>
    )}


<div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-lg border text-sm font-semibold ${
              currentPage === index + 1
                ? "bg-green-200 border-green-500 text-green-800"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="fixed bottom-4 left-0 right-0 py-4 flex justify-center items-center gap-4 bg-white">
        
     
        <button
          onClick={handleFileUploadClick}
          className="px-6 py-2 text-red-500 border border-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition"
        >
          Match new CVs
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 text-green-600 border border-green-600 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition"
        >
          Adjust Weights
        </button>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg border-2 border-green-500 shadow-lg max-w-sm w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Success!</h3>
              <p className="text-gray-600 mb-4">Weights updated successfully!</p>
              <button
                onClick={handleClosePopup}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Adjust Weights
                </Dialog.Title>

                <form className="space-y-4">
                  {["Education", "Work Experience", "Skills", "Mission"].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={weights[field] || 0}
                          onChange={(e) => handleWeightChange(field, e.target.value)}
                          className="w-full accent-red-500"
                        />
                        <span className="text-sm font-semibold">{Math.round(weights[field])}%</span>
                      </div>
                    </div>
                  ))}

                  {!weightsValid && (
                    <p className="text-red-500 text-sm mt-2">The total weight must be exactly 100.</p>
                  )}

                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      className="bg-gray-300 px-6 py-2 rounded-md"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-green-500 text-white px-6 py-2 rounded-md"
                      onClick={handleSaveWeights}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default MatchedCVsPage;