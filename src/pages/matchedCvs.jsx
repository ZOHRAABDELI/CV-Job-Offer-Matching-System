import React, { useEffect, useState, useRef, Fragment } from "react";
import TableComponent from "../components/table_component.jsx";
import { Dialog, Transition } from "@headlessui/react";

const MatchedCVsPage = () => {
  const [jsonData, setJsonData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const rowsPerPage = 8;

  const [weights, setWeights] = useState({
    Education: 0.25,
    "Work Experience": 0.25,
    Skills: 0.25,
    Experience_Requirements: 0.25,
  });

  const [weightsValid, setWeightsValid] = useState(true); // To track if weights are valid

  useEffect(() => {
    fetch("/results.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ranking) {
          setJsonData(data.ranking);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const currentRows = jsonData
    ? jsonData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];

  const totalPages = jsonData ? Math.ceil(jsonData.length / rowsPerPage) : 1;

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) console.log("Uploaded file:", file.name);
  };

  const handleSaveWeights = () => {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    if (totalWeight === 1) {
      setWeightsValid(true);
      setIsModalOpen(false); // Close the modal if the weights are valid
    } else {
      setWeightsValid(false); // Show error message if the weights are invalid
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      {/* Logo */}
      <div className="flex justify-start items-center mb-6">
        <img src="/images/mobilis.svg" alt="Mobilis Logo" className="w-40 h-auto" />
      </div>

      {/* Title */}
      <h2 className="text-green-600 text-3xl font-bold mb-6">Matched CVs</h2>

      {/* Table */}
      {jsonData ? (
        <TableComponent data={currentRows} />
      ) : (
        <p className="text-gray-500">Loading or no data available...</p>
      )}

      {/* Pagination */}
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

      {/* Bottom Buttons */}
      <div className="fixed bottom-4 left-0 right-0 py-4 flex justify-center items-center gap-4 bg-white">
        {/* Match CVs */}
        <button
          onClick={handleFileUploadClick}
          className="px-6 py-2 text-red-500 border border-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition"
        >
          Match new CVs
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Adjust Weights */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 text-green-600 border border-green-600 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition"
        >
          Adjust Weights
        </button>
      </div>

      {/* Modal */}
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
            <div className="fixed inset-0  bg-opacity-30" />
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
                  {["Education", "Work Experience", "Skills", "Experience_Requirements"].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field}
                      </label>
                      <div className="flex items-center gap-2">
                      <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={weights[field] || 0}
                      onChange={(e) =>
                        setWeights((prev) => ({
                          ...prev,
                          [field]: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-red-500"
                    />

                        <span className="text-sm w-10 text-right">
                          {weights[field]?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Error message if weights are invalid */}
                  {!weightsValid && (
                    <p className="text-red-500 text-sm mt-2">
                      The sum of weights should be 1. Please adjust them.
                    </p>
                  )}

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleSaveWeights}
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
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
