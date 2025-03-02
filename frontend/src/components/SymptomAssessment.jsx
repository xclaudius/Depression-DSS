import { useState } from "react";
import axios from "axios";

export default function SymptomAssessment() {
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);

  // PHQ-9 Questions
  const questions = [
    {
      id: 1,
      text: "Little interest or pleasure in doing things",
      question: "Over the last two weeks, how often have you been bothered by having little interest or pleasure in doing things?",
    },
    {
      id: 2,
      text: "Feeling down, depressed, or hopeless",
      question: "Over the last two weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    },
    {
      id: 3,
      text: "Trouble falling/staying asleep or sleeping too much",
      question: "Over the last two weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
    },
    {
      id: 4,
      text: "Feeling tired or having little energy",
      question: "Over the last two weeks, how often have you been feeling tired or having little energy?",
    },
    {
      id: 5,
      text: "Poor appetite or overeating",
      question: "Over the last two weeks, how often have you had poor appetite or been overeating?",
    },
    {
      id: 6,
      text: "Feeling bad about yourself",
      question: "Over the last two weeks, how often have you been feeling bad about yourself—or that you are a failure or have let yourself or your family down?",
    },
    {
      id: 7,
      text: "Trouble concentrating",
      question: "Over the last two weeks, how often have you had trouble concentrating on things, such as reading the newspaper or watching television?",
    },
    {
      id: 8,
      text: "Moving/speaking slowly or being fidgety/restless",
      question: "Over the last two weeks, how often have you been moving or speaking so slowly that other people could have noticed? Or the opposite—so fidgety or restless that you were moving around a lot more than usual?",
    },
    {
      id: 9,
      text: "Thoughts of death or self-harm",
      question: "Over the last two weeks, how often have you had thoughts that you would be better off dead or thoughts of hurting yourself in some way?",
    },
  ];

  // Functional Impairment Question
  const functionalImpairmentQuestion = {
    id: 10,
    text: "Functional Impairment",
    question: "If you checked off any problems above, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
    options: [
      { value: 0, label: "Not difficult at all" },
      { value: 1, label: "Somewhat difficult" },
      { value: 2, label: "Very difficult" },
      { value: 3, label: "Extremely difficult" },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Calculate the total score for questions 1–9
      const totalScore = Object.values(responses)
        .slice(0, 9) // Only consider the first 9 questions
        .reduce((sum, value) => sum + (value || 0), 0);

      // Determine the depression severity based on the total score
      let severity = "";
      if (totalScore <= 4) severity = "Minimal depression";
      else if (totalScore <= 9) severity = "Mild depression";
      else if (totalScore <= 14) severity = "Moderate depression";
      else if (totalScore <= 19) severity = "Moderately severe depression";
      else severity = "Severe depression";

      // Include the functional impairment response in the result
      const functionalImpairment = responses[10] || 0;

      // Send the responses to the backend
      const res = await axios.post("http://localhost:5000/api/assess", {
        responses,
        totalScore,
        severity,
        functionalImpairment,
      } ,{ withCredentials: true });

      // Display the result
      setResult({
        severity,
        functionalImpairment: functionalImpairmentQuestion.options.find(
          (option) => option.value === functionalImpairment
        ).label,
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setResult({ severity: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Symptom Assessment</h2>
      <form onSubmit={handleSubmit}>
        {/* PHQ-9 Questions */}
        {questions.map((q) => (
          <div key={q.id} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {q.text}
            </label>
            <p className="text-gray-600 text-sm mb-2">{q.question}</p>
            <select
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setResponses({ ...responses, [q.id]: parseInt(e.target.value) })
              }
              required
            >
              <option value="">Select an option</option>
              <option value="0">Not at all</option>
              <option value="1">Several days</option>
              <option value="2">More than half the days</option>
              <option value="3">Nearly every day</option>
            </select>
          </div>
        ))}

        {/* Functional Impairment Question */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {functionalImpairmentQuestion.text}
          </label>
          <p className="text-gray-600 text-sm mb-2">
            {functionalImpairmentQuestion.question}
          </p>
          <select
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setResponses({ ...responses, [10]: parseInt(e.target.value) })
            }
            required
          >
            <option value="">Select an option</option>
            {functionalImpairmentQuestion.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>

      {/* Display Result */}
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Assessment Result</h3>
          <p className="text-gray-700">
            <span className="font-bold">Depression Severity:</span> {result.severity}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Functional Impairment:</span> {result.functionalImpairment}
          </p>
        </div>
      )}
    </div>
  );
}