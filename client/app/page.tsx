"use client";

import React from "react";
import {useState, useEffect} from "react"
import Typewriter from "./components/Typewriter";


export default function Landing() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

const handleLogin = async () => {
  window.location.href = "http://localhost:5001/login";
};

useEffect(() => {
  checkLoginStatus();
}, []);

const checkLoginStatus = async () => {
  try {
    const response = await fetch("http://localhost:5001/application", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      window.location.href = "http://localhost:3000/home";
    } else {
      setIsLoggedIn(false);
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    setIsLoggedIn(false);
  }
};


  return (
    <div className='bg-[url("./images/applyd-background.png")] bg-cover h-full w-full'>

      <nav className="fixed w-full bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold text-gray-900">Applyd</a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="bg-gray-900 border-transparent font-rubik rounded-md py-2 px-5 text-white flex justify-center place-content-center hover:px-4 hover:mr-1 duration-300"
              > Login </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-between h-screen bg-gray-100">
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100">
          <h1 className="text-5xl font-bold pr-8">
            Your personalized <span className="px-10"></span><Typewriter />
          </h1>
          
          
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <img src="/applyd-hero-image.png" alt="Hero" className="w-full h-auto" />
        </div>
      </div>

    </div>
  );
}