"use client";
import { useState, useEffect } from "react";
import ApplicationList from "./components/ApplicationList"
import ApplicationForm from "./components/ApplicationForm";

export default function Home() {
  const [applications, setApplications] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentApplication, setCurrentApplication] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false);


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
        setApplications(data.applications);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
    }
  };


  // this is an async function, so it has to wait to get the applications
  const fetchApplications = async () => {
    // fetch sends a request to the backend API. we are waiting to get
    // a response, then we get json data
    const response = await fetch("http://localhost:5001/application")
    const data = await response.json() 
    setApplications(data.applications)
  }

  const handleLogin = async () => {
    window.location.href = "http://localhost:5001/login";
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setApplications([]);
      } else {
        console.error("Error logging out:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentApplication({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (application: any) => {
    if (isModalOpen) return
    setCurrentApplication(application)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchApplications()
    location.reload()
  }


  return (
    <>
       <div className="flex items-center mt-6 justify-center">
        {!isLoggedIn ? ( // if not logged in
          <button
            onClick={handleLogin}
            className="bg-blue-500/10 border-transparent rounded-md mt-2 py-2 px-3 text-blue-600 flex justify-center place-content-center hover:bg-blue-500/20 hover:text-blue-600 duration-300"
          >
            Login with Google
          </button>
        ) : ( // displays create app button if logged in
          <>
          <button
            onClick={openCreateModal}
            className="bg-green-500/10 border-transparent rounded-md mt-2 py-2 px-3 text-green-600 flex justify-center place-content-center hover:bg-green-500/20 hover:text-green-600 duration-300"
          >
            Create New Application
          </button>
          <button
              onClick={handleLogout}
              className="bg-red-500/10 border-transparent rounded-md mt-2 py-2 px-3 text-red-600 flex justify-center place-content-center hover:bg-red-500/20 hover:text-red-600 duration-300 ml-4"
            >
              Logout
            </button>
          </>
        )}
      </div>
      <ApplicationList applications={applications} updateApplication={openEditModal} updateCallback={onUpdate}/>
      {isModalOpen && <div className="position: fixed z-1 left-0 top-0 w-full h-full overflow-auto bg-black/20">
        <div className="bg-white m-4 p-4 w-4/5">
          <span className="close" onClick={closeModal}>&times;</span>
          <ApplicationForm existingApplication={currentApplication} updateCallback={onUpdate} closeModal={closeModal}/>
        </div>
      </div>
      }
    </>
  );
}
