import React from 'react';

const EditModalComponent = ({ isOpen, onClose, rowData }) => {
  if (!isOpen || !rowData) return null;

  return (
    <div className="fixed top-1/4 right-1/2 transform -translate-x-1/2 bg-gray-500 bg-opacity-50 flex items-center justify-center" style={{ zIndex: 10 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Decision</h2>
        <p>Editing: {rowData.resume.replace('.json', '')}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose} // Close the modal
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModalComponent;
