import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import DepressionChart from "./DepressionChart";

export default function Dashboard() {
  const [user, setUser] = useState({id: "", name: "", password: "", creaetd_at: "", email: ""}); // null means not logged in
  const [assessments, setAssessments] = useState([]);

  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null); // Reset user state on logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        console.log(userRes.data)
        setUser(userRes.data);

        const assessmentsRes = await axios.get("http://localhost:5000/api/assess/history", {
          withCredentials: true,
        });
        setAssessments(assessmentsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setUser(null);
        navigate('/login')
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navbar Section */}
        <div className="flex justify-end items-center bg-white p-4 rounded-lg shadow-md mb-6">
          {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}
          <div>
                <span className="mr-4 text-gray-700">Hello, {user.name}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Logout
                </button>
          </div>
        </div>

        {/* Welcome Section */}
        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
            <p className="text-gray-600">Here's an overview of your mental health journey.</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Link
            to="/assess"
            className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center hover:bg-blue-600 transition duration-300"
          >
            <h2 className="text-xl font-bold">New Assessment</h2>
            <p className="text-sm">Start a new symptom assessment.</p>
          </Link>
          <Link
            to="/resources"
            className="bg-green-500 text-white p-6 rounded-lg shadow-md text-center hover:bg-green-600 transition duration-300"
          >
            <h2 className="text-xl font-bold">Resources</h2>
            <p className="text-sm">Explore helpful resources.</p>
          </Link>
          <Link
            to="/profile"
            className="bg-purple-500 text-white p-6 rounded-lg shadow-md text-center hover:bg-purple-600 transition duration-300"
          >
            <h2 className="text-xl font-bold">Update Profile</h2>
            <p className="text-sm">Edit your profile information.</p>
          </Link>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Recent Assessments</h2>
          {assessments.length > 0 ? (
            <ul className="space-y-4">
              {assessments.map((assessment, index) => (
                <li key={index} className="border-b pb-4">
                  <p className="text-gray-700">
                    <span className="font-bold">Date:</span> {new Date(assessment.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold">Result:</span> {assessment.result}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No assessments found.</p>
          )}
        </div>

        {/* Depression Severity Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Depression Severity Overview</h2>
          <DepressionChart data={assessments} />
        </div>
      </div>
    </div>
  );
}
