import { useState, useEffect } from 'react';

const Requirements = ({ register, setValue }) => {
  const [bulletPoints, setBulletPoints] = useState(['']);

  const handleBulletPointChange = (index, value) => {
    const newBulletPoints = [...bulletPoints];
    newBulletPoints[index] = value;
    setBulletPoints(newBulletPoints);
  };
  
  const addBulletPoint = () => {
    setBulletPoints([...bulletPoints, '']);
  };
  
  const removeBulletPoint = (index) => {
    if (bulletPoints.length > 1) {
      const newBulletPoints = [...bulletPoints];
      newBulletPoints.splice(index, 1);
      setBulletPoints(newBulletPoints);
    }
  };

  // Update the hidden input whenever bulletPoints changes
  useEffect(() => {
    const filteredPoints = bulletPoints.filter(point => point.trim() !== '');
    if (filteredPoints.length > 0) {
      const value = '• ' + filteredPoints.join('\\n• ');
      setValue('requirements', value);
    }
  }, [bulletPoints, setValue]);

  return (
    <div className="mb-4">
      <label className="block text-md font-medium mb-1">Job Description & Requirements</label>
      <div className="border rounded-3xl p-4 input-style">
        {bulletPoints.map((point, index) => (
          <div key={index} className="flex items-center mb-2">
            <div className="mr-2 text-lg text-style">•</div>
            <input
              type="text"
              className="flex-grow p-2 border rounded-2xl input-style border-dashed"
              value={point}
              onChange={(e) => handleBulletPointChange(index, e.target.value)}
              placeholder={`Requirement ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeBulletPoint(index)}
              className="ml-2 text-red-500 hover:text-red-700"
              disabled={bulletPoints.length === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addBulletPoint}
          className="mt-2 text-style hover:text-style flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Requirement
        </button>
      </div>
      
      <input 
        type="hidden" 
        {...register("requirements")} 
      />
    </div>
  );
};

export default Requirements;