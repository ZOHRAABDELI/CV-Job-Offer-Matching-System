import { useState } from 'react';

const Skills = ({ register }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState('');

  const allSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "C++", "SQL",
    "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "UI/UX Design",
    "Agile/Scrum", "Project Management", "Data Analysis",
    "Machine Learning", "DevOps", "Communication", "Leadership"
  ];

  return (
    <div className="mb-4">
      <label className="block text-md font-medium mb-1">Skills</label>
      <div className="relative">
        <div className="relative mb-2">
          <input
            type="text"
            className="w-full p-3 border rounded-3xl input-style pr-10"
            placeholder="Search skills..."
            value={skillSearchTerm}
            onChange={(e) => setSkillSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {skillSearchTerm && (
          <div className="max-h-40 overflow-y-auto border input-style rounded-2xl bg-white shadow-md absolute w-full z-10">
            {allSkills
              .filter(skill => !selectedSkills.includes(skill) && skill.toLowerCase().includes(skillSearchTerm.toLowerCase()))
              .map(skill => (
                <div 
                  key={skill} 
                  className="p-2 hover:bg-green-50 cursor-pointer"
                  onClick={() => {
                    setSelectedSkills([...selectedSkills, skill]);
                    setSkillSearchTerm('');
                  }}
                >
                  {skill}
                </div>
              ))
            }
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
        value={selectedSkills.join(',')} 
      />
    </div>
  );
};

export default Skills;