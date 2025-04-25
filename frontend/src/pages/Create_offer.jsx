import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Experience from '../components/offer_components/Experience';
import Skills from '../components/offer_components/Skills';
import Language from '../components/offer_components/Language';
import Weights from '../components/offer_components/Weights';
import Requirements from '../components/offer_components/Requirements';
import UploadCV from '../components/UploadCV';

export default function JobPostingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onSubmit = (data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key !== 'cvFiles') {
        formData.append(key, data[key]);
      }
    });
    
    selectedFiles.forEach((file, index) => {
      formData.append(`cv${index}`, file);
    });
    
    console.log('Selected files:', selectedFiles);
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
          <Requirements register={register} />

          {/* Experience Component */}
          <Experience register={register} errors={errors} />

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
          <Skills register={register} />

          {/* Language Component */}
          <Language register={register} />

          {/* Weights Component */}
          <Weights />

          {/* Upload CV Component */}
          <UploadCV selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
