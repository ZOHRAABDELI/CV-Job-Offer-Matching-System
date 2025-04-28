import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Experience from '../components/offer_components/Experience';
import Skills from '../components/offer_components/Skills';
import Language from '../components/offer_components/Language';
import Weights from '../components/offer_components/Weights';
import Requirements from '../components/offer_components/Requirements';
import UploadCV from '../components/UploadCV';

export default function JobPostingForm() {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Modify the onSubmit function in Create_offer.jsx
// Modify the onSubmit function in Create_offer.jsx
const onSubmit = async (data) => {
  try {
    setIsSubmitting(true);
    setSubmitError('');

    // Convert files to base64
    const filePromises = selectedFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result.split(',')[1];
          resolve({
            filename: file.name,
            content: base64Data,
            type: file.type
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const cvFiles = await Promise.all(filePromises);

    // Process requirements, experience, and skills arrays
    const processArray = (str, separator) => {
      if (!str || str.trim() === '') return [];
      return str.split(separator)
        .map(item => item.trim())
        .filter(item => item !== '' && item !== '•');
    };

    // Get form data from formState
    const formData = {
      jobTitle: data.jobTitle,
      location: data.location,
      positions: parseInt(data.positions),
      yearsOfExperience: parseInt(data.yearsOfExperience),
      education: data.education,
      requirements: processArray(data.requirements, '\\n'),
      experienceDetails: processArray(data.experienceDetails, '\\n'),
      skills: processArray(data.skills, ','),
      languages: processArray(data.languages, ','),
      weights: {
        experience: parseInt(data.experienceWeight) || 0,
        jobDescription: parseInt(data.jobDescriptionWeight) || 0,
        education: parseInt(data.educationWeight) || 0,
        skills: parseInt(data.skillsWeight) || 0
      },
      cvFiles: cvFiles
    };

    console.log("Final form data:", formData);

    // Make the API call
    const response = await axios.post('http://localhost:5000/api/job-offers', formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000,
      validateStatus: status => status >= 200 && status < 300
    });

    if (response.data.success) {
      alert('Job offer created successfully!');
      setSelectedFiles([]);
    } else {
      setSubmitError('Failed to create job offer. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    setSubmitError('Failed to submit the form. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
          {/* Job Title */}
          <div className="mb-4">
            <label className="block text-md font-medium mb-1">Job Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-3xl input-style"
              {...register("jobTitle", { required: "Job title is required" })}
              placeholder="Enter job title" 
            />
            {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
          </div>

          {/* Location and Number of Positions Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-md font-medium mb-1">Location</label>
              <select 
                className="w-full p-3 border rounded-3xl input-style"
                {...register("location", { required: "Location is required" })}
              >
                <option value="Algiers">Algiers</option>
                <option value="Oran">Oran</option>
                <option value="Constantine">Constantine</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-md font-medium mb-1">Number of positions</label>
              <input
                type="number"
                min="1"
                step="1"
                className="w-full p-2 border rounded-3xl input-style"
                {...register("positions", { 
                  valueAsNumber: true,
                  validate: value => Number.isInteger(value) && value >= 1 || "Please enter a valid number of positions"
                })}
                placeholder="Enter number of positions"
              />
              {errors.positions && <p className="text-red-500 text-xs mt-1">{errors.positions.message}</p>}
            </div>
          </div>

          {/* Requirements Component */}
          <Requirements register={register}  setValue={setValue}/>

          {/* Experience Component */}
          <Experience register={register} errors={errors} setValue={setValue} />

          {/* Education */}
          <div className="mb-4">
            <label className="block text-md font-medium mb-1">Education</label>
            <input
              type="text"
              className="w-full p-2 border rounded-3xl input-style"
              {...register("education", { required: "Education is required" })}
              placeholder="Enter education level" 
            />
            {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education.message}</p>}
          </div>

          {/* Skills Component */}
          <Skills register={register} setValue={setValue} />


          {/* Language Component */}
          <Language register={register} setValue={setValue} />

          {/* Weights Component */}
          <Weights 
            register={register} 
            setValue={setValue}
            watch={watch}
          />

          {/* Upload CV Component */}
          <UploadCV selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
          {submitError && <p className="text-red-500 text-xs mt-1 text-center">{submitError}</p>}
        </form>
      </div>
    </div>
  );
}