import React from "react";
import NavBar from "../components/NavBar";
import createOfferIcon from "../assets/createOffer.svg";
import enterResumesIcon from "../assets/enterResumesIcon.svg";
import getRankingIcon from "../assets/getRankingIcon.svg";
import hiringIllustration from "../assets/resume_chooser.svg";
import CheckIcon from "../assets/check-icon.svg";
import greenBackground from "../assets/GreenBackground.svg";
import questionMarkIcon from "../assets/question.svg";
import arrowIcon from "../assets/arrow.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import arabicMobilis from "../assets/arabicMobilisLogo.svg";


function Footer() {
  return (
    <footer className="bg-[#F2FFF2] py-20">
      <div>
        <div className="container mx-auto text-center text-6xl font-extrabold text-[#54B848] mb-10">
          معاً، نصنع المستقبل
        </div>

        <div className="flex justify-center mt-8">
          <img
            src={arabicMobilis}
            alt="Mobilis Logo"
            className="h-11 sm:h-9 md:h-14"
          />
        </div>
      </div>
    </footer>
  );
}

function SupportFAQ() {
  // FAQ data
  const faqItems = [
    {
      id: 1,
      question: "How do I create an offer?",
      answer:
        "You need to fill the offer creation form that appears after clicking on create offer button",
    },
    {
      id: 2,
      question: "How do I create an offer?",
      answer:
        "You need to fill the offer creation form that appears after clicking on create offer button",
    },
    {
      id: 3,
      question: "How do I create an offer?",
      answer:
        "You need to fill the offer creation form that appears after clicking on create offer button",
    },
  ];

  // State to track which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState(
    faqItems.reduce((acc, item) => {
      acc[item.id] = true; // All items start expanded as shown in the image
      return acc;
    }, {})
  );

  // Toggle expanded state for an item
  const toggleItem = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 mt-40 ">
      <h1
        id="support"
        className="text-6xl font-extrabold text-center text-gray-800 mb-20"
      >
        Support
      </h1>

      <div className="space-y-8">
        {faqItems.map((item) => (
          <div
            key={item.id}
            className="border-3 border-gray-400 rounded-2xl overflow-hidden"
          >
            {/* Question header */}
            <button
              className="w-full flex items-center justify-between p-10 bg-white text-left"
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex items-center">
                <img
                  src={questionMarkIcon}
                  alt="Question mark"
                  className="w-14 h-14 mr-4 text-gray-500"
                />
                <span className="text-2xl font-semibold text-gray-600">
                  {item.question}
                </span>
              </div>
              <div className="text-gray-500">
                <img
                  src={arrowIcon}
                  alt="Arrow icon"
                  className={`w-8 h-8 transition-transform duration-300 ${
                    expandedItems[item.id] ? "" : "transform rotate-180"
                  }`}
                />
              </div>
            </button>

            {/* Answer content */}
            {expandedItems[item.id] && (
              <div className="bg-gray-100 p-10 border-2 border-gray-200">
                <p className="text-2xl font-semibold text-gray-600 mb-2">
                  Answer
                </p>
                <p className="text-xl text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatSetsUsApart() {
  const features = [
    {
      title: "Deep Resume Analysis",
      description:
        "Our app carefully reads and extracts resume content from any format, so you don't have to.",
    },
    {
      title: "Smarter Matching with Real Understanding",
      description:
        "Using advanced AI models, we match candidates to job descriptions based on true meaning, not just keyword overlap.",
    },
    {
      title: "Reliable, Accurate, and Scalable",
      description:
        "Even if it takes a moment, you'll get quality matches you can trust!",
    },
  ];

  return (
    <div className="relative w-screen  h-screen overflow-hidden">
      {/* Heading */}

      {/* Background Image */}
      <div className="absolute w-full h-full">
        <img
          src={greenBackground}
          alt="Green Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Centered Features - modified to remove side padding/margins */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-2xl">
        <div className="space-y-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <img src={CheckIcon} alt="Check" className="w-16 h-16" />
              </div>
              <div className="ml-4">
                <h3 className="text-3xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-xl mt-4 text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, alt }) {
  return (
    <div className="bg-gray-100 rounded-4xl border border-gray-200 shadow py-10 px-2 flex flex-col items-center text-center transition-all hover:shadow-md">
      <div className="mb-4">
        <img src={icon} alt={alt} className="w-28 h-28" />
      </div>
      <h3 className="text-2xl text-gray-500 font-bold mb-2">{title}</h3>
      <p className="text-gray-500 text-base">{description}</p>
    </div>
  );
}

function PrimaryButton({ children, onClick, className, ...props }) {
  return (
    <button
      onClick={onClick}
      className={`bg-red-600 hover:bg-white hover:text-red-600 hover:border hover:border-red-600 text-white font-medium py-3 px-6 rounded-md transition-colors ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, className, ...props }) {
  return (
    <button
      onClick={onClick}
      className={`border border-red-500 text-red-500 bg-red-50 hover:bg-red-500 py-3 px-6 rounded-md hover:text-white transition-colors ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: createOfferIcon,
      title: "Create Offer",
      description: "Create a new job offer by filling the form",
      alt: "Job offer form icon",
    },
    {
      icon: enterResumesIcon,
      title: "Enter Resumes",
      description: "Select resumes to match to an offer",
      alt: "Resumes icon",
    },
    {
      icon: getRankingIcon,
      title: "Get Ranking",
      description: "Get resume matching result and ranking",
      alt: "Ranking results icon",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Updated with taller left section */}
        <div className=" flex flex-col lg:flex-row gap-10  mb-24 mt-20 lg:mt-40">
          <div className="lg:w-1/2 flex flex-col justify-center min-h-[550px] pb-40">
            <h2
              id="home"
              className="text-3xl md:text-5xl font-extrabold text-gray-800  flex flex-col gap-4"
            >
              <span>Hire Smarter</span>
              <span className="whitespace-nowrap">
                Match Resumes with Precision
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 mt-12">
              AI-powered resume matching to streamline your hiring process and
              find the right talent right away.
            </p>
            <div className="flex flex-wrap gap-4">
              <PrimaryButton onClick={() => navigate("/create-job")}>
                Create a new offer
              </PrimaryButton>

              <SecondaryButton
                onClick={() => {
                  const supportSection = document.getElementById("support");
                  if (supportSection) {
                    supportSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  How it works
                </span>
              </SecondaryButton>
            </div>
          </div>

          <div className="lg:w-1/2 relative self-stretch h-[500px] lg:h-auto">
            <img
              src={hiringIllustration}
              alt="AI-powered hiring process illustration"
              className="w-full h-full object-contain"
            />
            <div className="absolute left-0 top-5/7 transform -translate-y-1/2 bg-white rounded-lg shadow-md px-3 py-2">
              <div className="flex flex-col items-center">
                {" "}
                {/* Center aligned text */}
                <span className="text-gray-800 font-bold">+50</span>
                <span className="text-gray-600 text-sm">Resumes Tested</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI-powered matching system header */}
        <div className="text-center mb-16 mt-8">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-40 mt-40">
            <span id="starter-guide" className="text-green-500">
              AI-powered
            </span>{" "}
            matching
            <br /> system
          </h1>
        </div>

       {/* Feature Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-40">
  {features.map((feature, index) => {
    const handleClick = () => {
      if (feature.title === "Create Offer") {
        navigate("/create-job");
      } else {
        navigate("/matched-cv");
      }
    };

    return (
      <div key={index} onClick={handleClick} className="cursor-pointer">
        <FeatureCard
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          alt={feature.alt}
        />
      </div>
    );
  })}
</div>

        {/* What Sets Us Apart Section */}
        <h2 className=" text-6xl md:text-6xl mt-20 mb-20 font-extrabold text-center text-gray-800 z-10">
          What sets us apart?
        </h2>

        {/* Footer */}
      </main>
      <WhatSetsUsApart />

      <SupportFAQ />

      <div className="h-70"></div>
      <Footer />
    </div>
  );
}

export default LandingPage;