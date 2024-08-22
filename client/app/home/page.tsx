"use client";
import { useState, useEffect } from "react";
import ApplicationList from "../components/ApplicationList";
import ApplicationForm from "../components/ApplicationForm";
import CustomDropdown from "../components/CustomDropdown";
import AnimatedCounter from "../components/AnimatedCounter";
import FileUploadModal from "../components/FileUploadModal";
import TypewriterEffectSmoothDemo from "../components/Typewriter2"

interface Application {
  id: number;
  status: string;
  name: string;
  open: string;
  close: string;
  link: string;
}

export default function Home() {
  const [userName, setUserName] = useState<string>('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);
  const [currentApplication, setCurrentApplication] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [dataApplications, setDataApplications] = useState<Application[]>([]);

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
        setDataApplications(data.applications);
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

  const fetchApplications = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5001/application");
    const data = await response.json();
    setApplications(data.applications);
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
    setIsModalOpen(false);
    setIsFileModalOpen(false);
    setCurrentApplication({});
  };

  const openFileModal = () => {
    if (!isFileModalOpen) setIsFileModalOpen(true);
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (application: Application) => {
    if (isModalOpen) return;
    setCurrentApplication(application);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchApplications;
    location.reload();
  };

  const clickSort = async (sort: string) => {
    const url = new URL('http://localhost:5001/application');
    url.searchParams.append('custom_sort', sort);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    const data = await response.json();
    setApplications(data.applications);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);

    const matchedApplications = dataApplications.filter(app => 
        app.name.toLowerCase().includes(value) || 
        app.open.toLowerCase().includes(value) || 
        app.close.toLowerCase().includes(value)
    );

    setApplications(matchedApplications);
};


  const refreshList = (e: React.FormEvent) => {
    e.preventDefault();
    location.reload();
  };

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col items-center justify-center ">
        <div className="flex justify-between items-start  px-8 py-1 mb-3 mt-2 bg-gray-200 mx-2 rounded-full">
          <div className="flex flex-col">
            <div
              className="font-rubik text-3xl py-1.5 text-gray-800  font-semibold dark:bg-white/10 dark:border-white/20 dark:text-white flex row"
              role="alert"
            >
              <a href="" className="flex row ml-44">
              <img
                  src="/Applyd-logo.png"
                  alt="Hero"
                  className="w-[40px] h-auto"
                />
                <span className="mt-0.5">Internity</span>
                </a>
            </div>
            
          </div>
          

          <div className="flex row place-content-center ml-28">

            <a href="/" className="">
              <button
                onClick={handleLogout}
                className="bg-black/85 border-transparent font-rubik rounded-xl mt-2 py-1.5 px-3 ml-4 text-white flex justify-center items-center hover:bg-black/80 duration-300"
              >
                Logout
              </button>
            </a>
          </div>
        </div>
        <div
              className=" border rounded-full  py-1 font-rubik text-xs text-gray-600 px-4  mr-5 dark:bg-white/10 dark:border-white/20 dark:text-white"
              role="alert"
            >
              TOTAL APPLICATIONS: <AnimatedCounter from={0} to={applications.length} /> 
          </div>

        <div className=" mb-4 flex flex-row justify-between items-center w-[91%] sticky top-0 z-10">
          <div className="flex row">
            <button className="p-1 mr-2 font-medium rounded-lg px-[13px] text-white bg-black/80 hover:bg-black/90 duration-300 flex items-center" onClick={openFileModal}>
              AI Resume Similarity
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-1.5 text-green-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </button>
            <button
              onClick={openCreateModal}
              className=" border-black/80 border-1.5 font-rubik rounded-md hover:bg-black/5 hover:border-black/90 hover:text-black py-1.5 px-3 duration-200 text-black/90 flex  place-content-center">
              Add Application <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23" stroke-width="2.5" stroke="currentColor" className="size-6 pl-1 pb-[2px]"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
            
          </div>
          
          <div className="justify-end flex">
            <CustomDropdown
              label="Sort By"
              items={[
                { label: "Not Applied", onClick: () => clickSort("Not Applied") },
                { label: "Applied", onClick: () => clickSort("Applied") },
                { label: "Offered", onClick: () => clickSort("Offered") },
                { label: "Similarity", onClick: () => clickSort("Similarity") },
              ]}
            />
            <form className="flex items-center max-w-sm mx-auto justify-end ml-4" >
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

        <div className="flex flex-row justify-between items-center border border-gray-300 p-1.5 mt-4 bg-gray-200 w-full">
          <p className="flex-grow text-center text-gray-600 ml-2.5">Name</p>
          <p className="flex-grow text-center ml-5 text-gray-600">Status</p>
          <p className="flex-grow text-center ml-5 text-gray-600">Title</p>
          <p className="flex-grow text-center ml-4 text-gray-600">Location</p>
          <p className="flex-grow text-center text-gray-600">Actions</p>
        </div>

        <div className="flex place-content-center justify-center">
          <ApplicationList applications={applications} updateApplication={openEditModal} updateCallback={onUpdate} />
        </div>
        {isModalOpen && <div className="fixed z-10 left-0 top-0 w-full h-full overflow-auto">
          <div className="m-4 p-4 w-4/5">
            <ApplicationForm existingApplication={currentApplication!} updateCallback={onUpdate} closeModal={closeModal} />
          </div>
        </div>
        }
        {isFileModalOpen && <div className="fixed z-10 left-0 top-0 w-full h-full overflow-auto">
          <div className="m-4 p-4 w-4/5">
            <FileUploadModal closeModal={closeModal} />
          </div>
        </div>
        }
      </div>
    </div>
  );
}
