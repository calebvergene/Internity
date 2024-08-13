"use client";

import React, { useState, useEffect } from "react";
import Typewriter from "./components/Typewriter";

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    window.location.href = "http://localhost:5001/login";
  };

  useEffect(() => {
    checkLoginStatus();
    // Disable scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Re-enable scrolling on component unmount (optional cleanup)
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <a
                href="/"
                className="font-rubik text-xl font-bold text-gray-800 flex flex-row"
              >
                <img
                  src="/Applyd-logo.png"
                  alt="Hero"
                  className="w-[40px] h-auto"
                />
                <span className="mt-1.5 font-rubik font-medium">Applyd</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="bg-gray-900 border-transparent font-rubik rounded-md py-2 px-5 text-white flex justify-center place-content-center hover:px-4 hover:mr-1 duration-300"
              >
                {" "}
                Login{" "}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-between h-screen bg-gray-100">
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 ml-10 mb-10">
          <div className="border border-gray-500 rounded-lg px-2 py-1 left-0 text-xs mb-3 font-semibold mr-[418px]">
            OPEN BETA
          </div>
          <h1 className="text-5xl font-bold">
            Your personalized <span className="mx-10"></span>
            <Typewriter />
          </h1>
          <h3 className="text-black/50 mt-3 mr-[203px]">
            All of your applications, all in one place.
          </h3>
          <div className="flex flex-row mt-11 text-lg font-rubik">
            <div className="relative inline-flex group">
              <div className="mr-[317px] absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-green-700 via-green-400 to-[#6e9af4] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <button
                onClick={handleLogin}
                className="mr-[317px] relative inline-flex items-center justify-center px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button"
              >
                <img
                  src="/Applyd-logo.png"
                  alt="Hero"
                  className="w-[30px] h-auto mr-1"
                />
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className="w-2/3 flex items-center justify-center">
          <img
            src="/applyd-hero-image.png"
            alt="Hero"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
