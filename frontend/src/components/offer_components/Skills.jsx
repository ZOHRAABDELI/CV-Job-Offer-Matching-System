import { useState, useEffect } from 'react';

const Skills = ({ register, setValue }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const allSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "C++", "SQL",
    "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "UI/UX Design",
    "Agile/Scrum", "Project Management", "Data Analysis",
    "Machine Learning", "DevOps", "Communication", "Leadership"
  ];

  // Update the hidden input whenever selectedSkills changes
  useEffect(() => {
    const value = selectedSkills.length > 0 ? selectedSkills.join(',') : '';
    setValue('skills', value);
  }, [selectedSkills, setValue]);

  // Handle key press to add custom skill
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && skillSearchTerm.trim() !== '') {
      e.preventDefault();
      addCustomSkill();
    }
  };

  // Add custom skill function
  const addCustomSkill = () => {
    const trimmedSkill = skillSearchTerm.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      setSelectedSkills([...selectedSkills, trimmedSkill]);
      setSkillSearchTerm('');
      setShowAddCustom(false);
    }
  };

  // Filter skills based on search term
  const filteredSkills = allSkills.filter(
    skill => !selectedSkills.includes(skill) && 
    skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
  );

  return (
    <div className="mb-4">
      <label className="block text-md font-medium mb-1">Skills</label>
      <div className="relative">
        <div className="relative mb-2">
          <input
            type="text"
            className="w-full p-3 border rounded-3xl input-style pr-10"
            placeholder="Search skills or type to add custom skill..."
            value={skillSearchTerm}
            onChange={(e) => {
              setSkillSearchTerm(e.target.value);
              setShowAddCustom(e.target.value.trim() !== '');
            }}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {skillSearchTerm && (
          <div className="max-h-40 overflow-y-auto border input-style rounded-2xl bg-white shadow-md absolute w-full z-10">
            {/* Show "Add custom skill" option if search term doesn't match exactly any existing skill */}
            {showAddCustom && !allSkills.some(skill => 
              skill.toLowerCase() === skillSearchTerm.toLowerCase() && 
              !selectedSkills.includes(skill)
            ) && (
              <div 
                className="p-2 hover:bg-green-100 cursor-pointer bg-green-50 border-b"
                onClick={addCustomSkill}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-input" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Add custom skill: <strong>{skillSearchTerm}</strong></span>
                </div>
              </div>
            )}
            
            {/* Show matching skills from predefined list */}
            {filteredSkills.map(skill => (
              <div 
                key={skill} 
                className="p-2 hover:bg-green-50 cursor-pointer"
                onClick={() => {
                  setSelectedSkills([...selectedSkills, skill]);
                  setSkillSearchTerm('');
                  setShowAddCustom(false);
                }}
              >
                {skill}
              </div>
            ))}
            
            {/* Show message when no skills match */}
            {filteredSkills.length === 0 && !showAddCustom && (
              <div className="p-2 text-gray-500 italic">
                No matching skills found. Type to add a custom skill.
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedSkills.map(skill => (
          <div key={skill} className="bg-blue-100 border input-style rounded-full px-3 py-1 text-xs flex items-center gap-1">
            {skill}
            <button 
              type="button" 
              onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
              className="text-style hover:text-style"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <input 
        type="hidden" 
        {...register("skills")} 
      />
    </div>
  );
};

export default Skills;
