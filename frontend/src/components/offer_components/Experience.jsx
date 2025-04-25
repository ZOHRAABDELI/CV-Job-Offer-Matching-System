import { useState } from 'react';

const Experience = ({ register, errors }) => {
  const [experienceBulletPoints, setExperienceBulletPoints] = useState(['']);

  const handleExperienceBulletPointChange = (index, value) => {
    const newBulletPoints = [...experienceBulletPoints];
    newBulletPoints[index] = value;
    setExperienceBulletPoints(newBulletPoints);
  };

  const addExperienceBulletPoint = () => {
    setExperienceBulletPoints([...experienceBulletPoints, '']);
  };

  const removeExperienceBulletPoint = (index) => {
    if (experienceBulletPoints.length > 1) {
      const newBulletPoints = [...experienceBulletPoints];
      newBulletPoints.splice(index, 1);
      setExperienceBulletPoints(newBulletPoints);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-md font-medium mb-1">Experience</label>
      
      <div className="mb-3">
        <input
          type="number"
          min="0"
          step="1"
          className="w-full p-2 border rounded-3xl input-style"
          {...register("yearsOfExperience", { 
            valueAsNumber: true,
            validate: value => Number.isInteger(value) && value >= 0 || "Please enter a valid number of years"
          })}
          placeholder="Enter years of experience required" 
        />
        {errors.yearsOfExperience && <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience.message}</p>}
      </div>
      
      <div className="border rounded-3xl p-4 input-style">
        {experienceBulletPoints.map((point, index) => (
          <div key={index} className="flex items-center mb-2">
            <div className="mr-2 text-lg text-style">•</div>
            <input
              type="text"
              className="flex-grow p-2 border rounded-2xl input-style border-dashed"
              value={point}
              onChange={(e) => handleExperienceBulletPointChange(index, e.target.value)}
              placeholder={`Experience detail ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeExperienceBulletPoint(index)}
              className="ml-2 text-red-500 hover:text-red-700"
              disabled={experienceBulletPoints.length === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addExperienceBulletPoint}
          className="mt-2 text-style hover:text-style-dark flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Experience Detail
        </button>
      </div>
      
      <input 
        type="hidden" 
        {...register("experienceDetails")} 
        value={experienceBulletPoints.filter(point => point.trim() !== '').join('\n• ')} 
      />
    </div>
  );
};

export default Experience;