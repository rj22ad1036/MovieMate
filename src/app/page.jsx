"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [movieName, setMovieName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/recommend?movie_name=${encodeURIComponent(
          movieName
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations.");
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setRecommendations(data);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const elements = document.querySelectorAll(".animate-pulse");
      elements.forEach((el) => {
        el.classList.remove("animate-pulse");
        setTimeout(() => el.classList.add("animate-pulse"), 100);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 overflow-y-auto">
      {/* Header */}
      <motion.h1
        className="text-6xl font-bold text-center mb-12 p-2 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
          Movie
        </span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-blue-500 to-purple-500">
          Recommender 🎞️
        </span>
      </motion.h1>

      {/* Search Bar */}
      <div className="flex justify-center items-center mb-12">
        <div className="relative w-2/3">
          <input
            type="text"
            placeholder="Enter a movie name..."
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className="w-full p-4 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg border-2 border-green-300"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 p-2 rounded-full transition-all duration-200 shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-lg animate-pulse">
          Loading recommendations...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500 bg-red-100 bg-opacity-20 backdrop-filter backdrop-blur-lg border border-red-400 rounded-lg p-4 mb-8">
          {error}
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((movie, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-green-500"
          >
            {/* Movie Name */}
            <h2 className="text-2xl font-semibold mb-3 text-green-300">
              {movie["Movie Name"]}
            </h2>
            {/* Rating */}
            <p className="text-yellow-400 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-1 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              Rating: {movie["Rating"] || "N/A"}
            </p>
            {/* Time */}
            <p className="text-blue-400 flex items-center">
              <svg className="w-5 h-5 mr-1 fill-current" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              Time: {movie["Time"] || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
