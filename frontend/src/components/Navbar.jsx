import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Depression DSS
        </Link>
        <div className="space-x-4">
          <Link to="/login" className="hover:text-gray-200">
            Login
          </Link>
          <Link to="/register" className="hover:text-gray-200">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;