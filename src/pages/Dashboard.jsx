import React from "react";

const Dashboard = () => {
  const handleNavigate = () => {
    window.location.href = "/matchedCvs";
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col">
      {/* Logo top-left */}
      <div className="mb-6">
        <img src="/images/mobilis.png" alt="Mobilis Logo" className="w-40 h-auto" />
      </div>

      {/* Centered content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        {/* Tagline */}
     

        {/* Images */}
        <div className="flex justify-center gap-10 mb-8">
          <img src="/images/job-offer.png" alt="Job Offer" className="w-54 h-auto" />
          <img src="/images/cv.png" alt="CV" className="w-54 h-auto" />
        </div>
        <h2 className="text-[#64748B] text-3xl font-semibold mb-7">
          Match a job offer with curriculum vitaes!
        </h2>
        {/* Button */}
        <button
        onClick={handleNavigate}
        className="px-8 py-3 text-red-600 border border-red-600 bg-[#FFF3F3] text-lg font-semibold rounded-lg transition hover:bg-red-600 hover:text-white hover:cursor-pointer
"
        >
        Create a new offer
        </button>

      </div>
    </div>
  );
};

export default Dashboard;
