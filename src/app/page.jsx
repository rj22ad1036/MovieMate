"use client";

import { useState } from "react";

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

      // Ensure the response is in the expected format
      if (Array.isArray(data)) {
        setRecommendations(data); // Assuming data is an array of movies
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-8">
        Movie Recommendation System 🎥
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center items-center mb-6">
        <input
          type="text"
          placeholder="Enter a movie name..."
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          className="w-2/3 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="ml-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-lg">Loading recommendations...</div>
      )}

      {/* Error State */}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Recommendations */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((movie, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-4 shadow-lg hover:scale-105 transition-transform"
          >
            {/* Movie Name */}
            <h2 className="text-2xl font-semibold mb-2">
              {movie["Movie Name"]}
            </h2>
            {/* Rating */}
            <p className="text-yellow-400 mb-4">
              Rating: {movie["Rating"] || "N/A"}
            </p>
            {/* Trailer */}
            {movie.trailer_url ? (
              <a
                href={movie.trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Watch Trailer
              </a>
            ) : (
              <p className="text-gray-400">Trailer not available.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
