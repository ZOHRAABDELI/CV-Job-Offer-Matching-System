
export default function UploadCV({ selectedFiles, setSelectedFiles }) {
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      const pdfFiles = files.filter(file => file.type === 'application/pdf');
      
      if (files.length !== pdfFiles.length) {
        alert('Please select only PDF files');
        return;
      }
      
      setSelectedFiles(prevFiles => [...prevFiles, ...pdfFiles]);
      event.target.value = '';
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <label className="block text-md font-medium mb-1">Upload new CVs</label>
      <div 
        className="border-2 border-dashed text-style rounded-3xl p-6 bg-green-50 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => document.getElementById('cv-upload').click()}
      >
        <input
          id="cv-upload"
          type="file"
          multiple
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-style" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-style mt-2">
          {selectedFiles.length > 0 
            ? `${selectedFiles.length} file(s) selected` 
            : 'Click to select PDF files'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          You can select multiple PDF files
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white rounded-3xl border input-style">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm truncate">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {selectedFiles.length > 0 && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setSelectedFiles([])}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear all files
          </button>
        </div>
      )}
    </div>
  );
}