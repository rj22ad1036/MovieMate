"use client";

import { useState } from "react";

export default function Recommendations() {
  const [movieName, setMovieName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setError(null);
      const response = await fetch(
        `http://127.0.0.1:5000/recommend?movie_name=${encodeURIComponent(
          movieName
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations.");
      }
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 w-full max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Movie Recommendations</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Enter a movie name"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mr-2 flex-grow"
        />
        <button
          onClick={fetchRecommendations}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Get Recommendations
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((movie, index) => (
          <div key={index} className="border rounded-md p-4 shadow-md">
            <h3 className="wd111111111111111xgtext-lg font-bold mb-2">
              {movie["Movie Name"]}
            </h3>
            <p className="mb-2">Rating: {movie.Rating.toFixed(2)}</p>
            {movie.trailer_url ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${
                    movie.trailer_url.split("v=")[1]
                  }`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-md"
                ></iframe>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No trailer available.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
