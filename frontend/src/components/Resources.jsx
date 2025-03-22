import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Resources() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const resourceCategories = [
    {
      title: "Understanding Depression",
      resources: [
        {
          title: "What is Depression?",
          description: "Learn about the symptoms, causes, and treatments for depression.",
          link: "https://www.psychiatry.org/patients-families/depression/what-is-depression",
          icon: "📚"
        },
        {
          title: "Types of Depression",
          description: "Understand the different forms of depression and their unique characteristics.",
          link: "https://www.dbsalliance.org/education/depression/types-of-depression/",
          icon: "🔍"
        },
        {
          title: "Depression Myths and Facts",
          description: "Separate fact from fiction about depression and mental health.",
          link: "https://share.upmc.com/2020/05/myths-and-facts-about-depression/",
          icon: "✓"
        }
      ]
    },
    {
      title: "Self-Help Strategies",
      resources: [
        {
          title: "Mindfulness Practices",
          description: "Simple mindfulness exercises to help manage depression symptoms.",
          link: "https://psychcentral.com/depression/how-does-mindfulness-reduce-depression",
          icon: "🧘"
        },
        {
          title: "Physical Activity and Depression",
          description: "How exercise can help alleviate depression symptoms.",
          link: "https://www.sciencedirect.com/science/article/abs/pii/S0149763419305640",
          icon: "🏃"
        },
        {
          title: "Healthy Sleep Habits",
          description: "Improve your sleep to help manage depression.",
          link: "https://www.sleepfoundation.org/sleep-habits",
          icon: "😴"
        }
      ]
    },
    {
      title: "Crisis Resources",
      resources: [
        {
          title: "MANI Nigeria Mental Health Helpline",
          description: "Free and confidential support for mental health crises in Nigeria.",
          link: "https://mentallyaware.org/mani-helpline/",
          phone: "0800 6472 4373",
          icon: "☎️"
        },
        {
          title: "SURPIN Helpline",
          description: "Suicide Research & Prevention Initiative helpline for crisis intervention.",
          link: "https://surpinng.com/",
          phone: "09080217555",
          icon: "💬"
        }
      ]
    },
    {
      title: "Professional Help",
      resources: [
        {
          title: "Finding a Therapist",
          description: "Guide to finding the right mental health professional for you in Nigeria.",
          link: "https://tranqbay.ng/blog/mental-health/how-to-find-the-right-therapist-in-nigeria-a-complete-guide-2024",
          icon: "👩‍⚕️"
        },
        {
          title: "Types of Therapy for Depression",
          description: "Understanding different therapeutic approaches for depression.",
          link: "https://www.healthline.com/health/depression/types-of-depression-therapy",
          icon: "🗣️"
        },
        {
          title: "Medication Information",
          description: "Learn about antidepressant medications and their effects.",
          link: "https://my.clevelandclinic.org/health/treatments/9301-antidepressants-depression-medication",
          icon: "💊"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Depression DSS</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Mental Health Resources</h2>
          <p className="mt-2 text-lg">Find helpful information, tools, and support for managing depression and mental health.</p>
        </div>
      </div>

      {/* Resources content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {resourceCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {category.resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="p-6 hover:bg-gray-50">
                    <div className="flex">
                      <div className="mr-4 text-2xl">{resource.icon}</div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          <a href={resource.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                            {resource.title}
                          </a>
                        </h4>
                        <p className="mt-1 text-gray-600">{resource.description}</p>
                        {resource.phone && (
                          <p className="mt-2 text-blue-600 font-medium">{resource.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Disclaimer:</strong> This information is not intended to replace professional advice. If you're experiencing a mental health crisis, please contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}