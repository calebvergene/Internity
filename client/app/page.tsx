"use client";
import { useState, useEffect } from "react";
import ApplicationList from "./components/ApplicationList"
import ApplicationForm from "./components/ApplicationForm";

export default function Home() {
  const [userName, setUserName] = useState('');
  const [applications, setApplications] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentApplication, setCurrentApplication] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [waterDroplets, setWaterDroplets] = useState(0);


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
        setUserName(data.userName);
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
  const fetchApplications = async (e: React.FormEvent) => {
    e.preventDefault();
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
    fetchApplications
    location.reload()
  }


  return (
    <>
      <div className="flex flex-col items-center mt-3 justify-center">
        {!isLoggedIn ? ( // if not logged in
          <button
            onClick={handleLogin}
            className="bg-blue-500/10 border-transparent font-rubik rounded-md mt-2 py-2 px-3 text-blue-600 flex justify-center place-content-center hover:bg-blue-500/20 hover:text-blue-600 duration-300"
          >
            Login with Google
          </button>
        ) : ( // displays create app button if logged in
          <>
            <div className="flex justify-between items-center w-full px-8">
              <button className="p-3 rounded-lg px-[15px] hover:border-white hover:bg-gray-300/50 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </button>
              <div className="flex items-center">
                <button className="border-r border-gray-400/50 px-6 py-0">
                  💧{waterDroplets}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-black border-transparent font-rubik rounded-md my-2 py-2 px-3 ml-6 text-white flex justify-center place-content-center hover:bg-gray-100 hover:text-black duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
            <div className='flex flex-grow justify-center'>
                <h3 className='text-center font-bold'>Glad to have you, {userName}!</h3>
              </div>
            <div className="mt-4">
              <button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-green-400 to-blue-300 hover:from-blue-500 hover:to-green-400 hover:border-gray hover:bg-gradient-to-r duration-300 font-rubik rounded-md mt-2 py-2 px-3 text-white flex justify-center place-content-center">
                  Create New Application <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 pl-1 pb-[2px] "><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </button>
            </div>
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
  