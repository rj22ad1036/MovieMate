"use client";
import React, { useState } from "react";

const Page = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`You recommended: ${inputValue}`);
    setInputValue("");
  };

  return (
    <div className="h-screen p-5 font-sans flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to the Recommendation Website
      </h1>
      <p className="mb-4">Discover the best movies, books, and more!</p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter your recommendation"
            className="p-2 w-full mb-2 border border-gray-300 rounded text-black"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded w-full"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
