import { useState, useEffect } from 'react';

const Language = ({ register , setValue}) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const allLanguages = [
    // Official UN Languages
    "Arabic", "Chinese", "English", "French", "Russian", "Spanish",
    
    // European Languages
    "Albanian", "Armenian", "Basque", "Belarusian", "Bosnian", "Bulgarian", 
    "Catalan", "Croatian", "Czech", "Danish", "Dutch", "Estonian", "Finnish", 
    "Galician", "Georgian", "German", "Greek", "Hungarian", "Icelandic", "Irish",
    "Italian", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian", "Maltese",
    "Moldovan", "Norwegian", "Polish", "Portuguese", "Romanian", "Serbian", 
    "Slovak", "Slovenian", "Swedish", "Ukrainian",
    
    // Asian Languages
    "Bengali", "Burmese", "Filipino", "Hindi", "Indonesian", "Japanese", 
    "Javanese", "Kazakh", "Khmer", "Korean", "Lao", "Malay", "Mongolian", 
    "Nepali", "Pashto", "Persian", "Punjabi", "Sinhalese", "Tajik", "Tamil", 
    "Telugu", "Thai", "Turkish", "Urdu", "Uzbek", "Vietnamese",
    
    // African Languages
    "Afrikaans", "Amharic", "Hausa", "Igbo", "Malagasy", "Oromo", "Somali", 
    "Swahili", "Tigrinya", "Xhosa", "Yoruba", "Zulu",
    
    // Middle Eastern Languages
    "Hebrew", "Kurdish",
    
    // Other Major Languages
    "Esperanto", "Latin", "Sanskrit"
  ].sort();

  // Update the hidden input whenever selectedLanguages changes
  useEffect(() => {
    const value = selectedLanguages.length > 0 ? selectedLanguages.join(',') : '';
    setValue('languages', value);
  }, [selectedLanguages, setValue]);

  return (
    <div className="mb-4">
      <label className="block text-md font-medium mb-1">Languages</label>
      <div className="relative">
        <div className="relative mb-2">
          <input
            type="text"
            className="w-full p-3 border rounded-3xl input-style pr-10"
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {searchTerm && (
          <div className="max-h-40 overflow-y-auto border input-style rounded-2xl bg-white shadow-md absolute w-full z-10">
            {allLanguages
              .filter(lang => !selectedLanguages.includes(lang) && lang.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(lang => (
                <div 
                  key={lang} 
                  className="p-2 hover:bg-green-50 cursor-pointer"
                  onClick={() => {
                    setSelectedLanguages([...selectedLanguages, lang]);
                    setSearchTerm('');
                  }}
                >
                  {lang}
                </div>
              ))
            }
          </div>
        )}
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedLanguages.map(lang => (
          <div key={lang} className="bg-green-100 border text-style rounded-full px-3 py-1 text-xs flex items-center gap-1">
            {lang}
            <button 
              type="button" 
              onClick={() => setSelectedLanguages(selectedLanguages.filter(l => l !== lang))}
              className="text-style hover:text-green-900"
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
        {...register("languages")} 
      />
    </div>
  );
};

export default Language;