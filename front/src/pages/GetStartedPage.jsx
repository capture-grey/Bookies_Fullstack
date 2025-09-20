// src/pages/GetStartedPage.jsx
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-book.jpg";

const GetStartedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Bookies</h1>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-6xl flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="text-center lg:text-left flex-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Hey! Ever wondered what books your friends own?
            </h2>
            <p className="text-gray-700 mb-6">
              Or your classmates? your local reading club ?… now you can easily
              create a list of books, join forums to share your collections, and
              see everyone's books in one place. One personal list, different
              groups, different forums, unified in one view.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="py-3 px-6 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="py-3 px-6 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1">
            <img
              src={heroImage}
              alt="Books"
              className="w-full max-w-md rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetStartedPage;
