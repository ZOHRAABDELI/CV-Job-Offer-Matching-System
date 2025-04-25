import { useState } from 'react';

const Weights = () => {
  const [weights, setWeights] = useState({
    experience: 0,
    jobDescription: 0,
    education: 0,
    skills: 0
  });
  const [weightError, setWeightError] = useState('');

  const handleWeightChange = (field, value) => {
    const newValue = parseInt(value) || 0;
    const newWeights = { ...weights, [field]: newValue };
    
    // Calculate total
    const total = Object.values(newWeights).reduce((sum, weight) => sum + weight, 0);
    
    // Update weights
    setWeights(newWeights);
    
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
              value={weights.experience}
              onChange={(e) => handleWeightChange('experience', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Job Description Weight (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full p-2 border rounded-3xl input-style"
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