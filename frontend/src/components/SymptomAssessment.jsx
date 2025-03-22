import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SymptomAssessment() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]); // Stores dynamic PHQ-9 questions
  const [responses, setResponses] = useState({}); // Stores user answers
  const [result, setResult] = useState(null); // Stores the ML model's prediction
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state

  // ✅ Fetch 10 random PHQ-9 questions from the backend when component loads
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/assess/questions",
          { withCredentials: true }
        );
        setQuestions(res.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  // Function to navigate back to dashboard
  const handleReturnToDashboard = () => {
    navigate("/");
  };

  // ✅ Handle form submission (send responses to the backend for ML prediction)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calculate PHQ-9 total score
      const totalScore = Object.values(responses).reduce(
        (sum, value) => sum + (value || 0),
        0
      );

      // Send assessment responses to backend
      const res = await axios.post(
        "http://localhost:5000/api/assess",
        {
          responses,
          totalScore,
        },
        { withCredentials: true }
      );

      // ✅ Store the ML model's response (severity + confidence)
      setResult(res.data);
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Depression Screening</h2>
      <button
        onClick={handleReturnToDashboard}
        className="text-blue-500 hover:text-blue-700 flex items-center transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Return to Dashboard
      </button>
    </div>

      <form onSubmit={handleSubmit}>
        {/* ✅ Dynamically Render PHQ-9 Questions */}
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              {q.text}
            </label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={responses[q.id]}
              onChange={(e) =>
                setResponses({ ...responses, [q.id]: parseInt(e.target.value) })
              }
              required
            >
              <option value="">Select an option</option>
              {q.response_type === "phq9" ? (
                <>
                  <option value="0">0 - Not at all</option>
                  <option value="1">1 - Several days</option>
                  <option value="2">2 - More than half the days</option>
                  <option value="3">3 - Nearly every day</option>
                </>
              ) : (
                <>
                  <option value="0">0 - No</option>
                  <option value="1">1 - Yes</option>
                </>
              )}
            </select>
          </div>
        ))}

        {/* ✅ Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          {isLoading ? "Processing..." : "Submit Assessment"}
        </button>
      </form>

      {/* ✅ Display ML Model's Result After Submission */}
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Assessment Result</h3>
          <p>
            <strong>Depression Severity:</strong> {result.severity}
          </p>
          <p>
            <strong>Confidence:</strong> {Math.round(result.confidence * 100)}%
          </p>
          {/* <p>
            <strong>PHQ-9 Total Score:</strong> {result.score}
          </p> */}
        </div>
      )}
    </div>
  );
}
