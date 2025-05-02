import { useState, useEffect } from 'react';

const Weights = ({ register, setValue, watch }) => {
  const [weights, setWeights] = useState({
    experience: 0,
    jobDescription: 0,
    education: 0,
    skills: 0
  });
  const [weightError, setWeightError] = useState('');

  // Get the current values from form if using react-hook-form's watch
  const experienceWeight = watch?.('experienceWeight') || weights.experience;
  const jobDescriptionWeight = watch?.('jobDescriptionWeight') || weights.jobDescription;
  const educationWeight = watch?.('educationWeight') || weights.education;
  const skillsWeight = watch?.('skillsWeight') || weights.skills;

  // Update local state when form values change
  useEffect(() => {
    if (watch) {
      setWeights({
        experience: parseInt(experienceWeight) || 0,
        jobDescription: parseInt(jobDescriptionWeight) || 0,
        education: parseInt(educationWeight) || 0,
        skills: parseInt(skillsWeight) || 0
      });
    }
  }, [experienceWeight, jobDescriptionWeight, educationWeight, skillsWeight, watch]);

  const handleWeightChange = (field, value) => {
    const newValue = parseInt(value) || 0;
    const newWeights = { ...weights, [field]: newValue };
    
    // Calculate total
    const total = Object.values(newWeights).reduce((sum, weight) => sum + weight, 0);
    
    // Update weights
    setWeights(newWeights);
    
    // Update react-hook-form values
    if (setValue) {
      setValue(`${field}Weight`, newValue);
    }
    
    // Validate total
    if (total > 100) {
      setWeightError('Total weights cannot exceed 100%');
    } else if (total < 100) {
      setWeightError('Total weights must sum to 100%');
    } else {
      setWeightError('');
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-md font-medium mb-1">Weights (Must total 100%)</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Experience Weight (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full p-2 border rounded-3xl input-style"
              {...(register ? register("experienceWeight") : {})}
              value={weights.experience}
              onChange={(e) => handleWeightChange('experience', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Requirements Weight (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full p-2 border rounded-3xl input-style"
              {...(register ? register("jobDescriptionWeight") : {})}
              value={weights.jobDescription}
              onChange={(e) => handleWeightChange('jobDescription', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Education Weight (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full p-2 border rounded-3xl input-style"
              {...(register ? register("educationWeight") : {})}
              value={weights.education}
              onChange={(e) => handleWeightChange('education', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Skills Weight (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full p-2 border rounded-3xl input-style"
              {...(register ? register("skillsWeight") : {})}
              value={weights.skills}
              onChange={(e) => handleWeightChange('skills', e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Total and Error Display */}
      <div className="mt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Total: {Object.values(weights).reduce((sum, weight) => sum + weight, 0)}%
          </span>
          {weightError && (
            <span className="text-red-500 text-sm">
              {weightError}
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className={`h-2.5 rounded-full ${
              weightError ? 'bg-red-500 animate-pulse' : 'bgInput'
            }`}
            style={{ width: `${Math.min(100, Object.values(weights).reduce((sum, weight) => sum + weight, 0))}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Weights;