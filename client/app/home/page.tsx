"use client";
import { useState, useEffect } from "react";
import ApplicationList from "../components/ApplicationList"
import ApplicationForm from "../components/ApplicationForm";
import CustomDropdown from "../components/CustomDropdown";
import SquareButton from "../components/SquareButton";


export default function Home() {
  const [userName, setUserName] = useState('');
  const [applications, setApplications] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentApplication, setCurrentApplication] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dataApplications, setDataApplications] = useState([]);
  
  

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
        setDataApplications(data.applications)
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


  const clickSort = async (sort: string) => {
    
    // adds parameters to the request it sends to the backend BECAUSE IT IS A GET REQ.
    const url = new URL('http://localhost:5001/application');
    url.searchParams.append('custom_sort', sort);

    // sends request to the backend relaying information
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    // updates live table
    const data = await response.json() 
    setApplications(data.applications)

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const matchedApplications = dataApplications.filter(app => app.name.toLowerCase().includes(value.toLowerCase()));
    setApplications(matchedApplications);
    
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedApplications = dataApplications.filter(app => app.name.toLowerCase() === inputValue.toLowerCase());
    if (matchedApplications.length > 0) {
      setApplications(matchedApplications);
    } 
    setInputValue('');
  };

  const refreshList = (e: React.FormEvent) => {
    e.preventDefault();
    location.reload()

  };
  
  

  


  return (
    <div className="bg-gray-100">
      <div className="flex flex-col items-center  justify-center">
      <div className="flex justify-between items-start w-full px-8 py-1">
      <div className="flex flex-col">
        <div
          className="font-rubik text-4xl text-gray-800 px-2 mt-6 dark:bg-white/10 dark:border-white/20 dark:text-white"
          role="alert"
        >
          🌱 Glad to have you, <span className="font-semibold">{userName.split(' ')[0]}</span>!
        </div>
        <div
          className="border-b border-gray-300 pb-7 font-rubik text-xs text-gray-600 px-4 mt-2 pl-14 pr-5 dark:bg-white/10 dark:border-white/20 dark:text-white"
          role="alert"
        >
          {applications.length} TOTAL APPLICATIONS
        </div>
      </div>

      <div className="flex row place-content-center">
        <a href="/explore" className="mb-2">
          <button className="p-3 rounded-lg px-[13px] mt-3 bg-gray-300/15 hover:border-white hover:bg-gray-300/50 duration-300 flex items-center">
            Explore Applications
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
          </button>
        </a>

        <a href="/" className="">
          <button
            onClick={handleLogout}
            className="bg-black/85 border-transparent font-rubik rounded-md mt-4 py-2 px-3 ml-4 text-white flex justify-center items-center hover:bg-black/80 duration-300"
          >
            Logout
          </button>
        </a>
      </div>
    </div>
      <div className="mt-10 mb-4 flex flex-row justify-between items-center w-[91%] sticky top-0 z-10">
              <div className="">
              <button
                onClick={openCreateModal}
                className="justify-start bg-green-500 hover:from-blue-500 hover:to-green-400 duration-300 font-rubik rounded-md mt-2 py-2 px-3 text-white flex  place-content-center">
                  Create New Application <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23" stroke-width="2.5" stroke="currentColor" className="size-6 pl-1 pb-[2px] "><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </button>
              </div>
              <div className="justify-end flex">
              <CustomDropdown
                  label="Sort By"
                  items={[
                  { label: "Not Applied", onClick: () => clickSort("Not Applied") },
                  { label: "Offered", onClick: () => clickSort("Offered") },
                  ]}
              />
              <form className="flex items-center max-w-sm mx-auto justify-end ml-4" onSubmit={handleSubmitSearch}>
                  <label className="sr-only">Search</label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                      placeholder="Search applications..."
                    />
                  </div>
                </form>
                <button className="rounded-lg px-[11px] ml-1 hover:border-white hover:rotate-45 duration-300" onClick={refreshList}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  </button>
              </div>
            </div>
      </div>
      <ApplicationList applications={applications} updateApplication={openEditModal} updateCallback={onUpdate}/>
      {isModalOpen && <div className="position: fixed z-10 left-0 top-0 w-full h-full overflow-auto">
        <div className=" m-4 p-4 w-4/5">
          <ApplicationForm existingApplication={currentApplication} updateCallback={onUpdate} closeModal={closeModal}/>
        </div>
      </div>
      }
    </div>
  );
  }
  