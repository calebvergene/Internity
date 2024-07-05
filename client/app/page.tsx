"use client";
import { useState, useEffect } from "react";
import ApplicationList from "./components/ApplicationList"
import ApplicationForm from "./components/ApplicationForm";

export default function Home() {
  const [applications, setApplications] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentApplication, setCurrentApplication] = useState({})


  useEffect(() => {
    fetchApplications()
  }, [])


  // this is an async function, so it has to wait to get 
  // the applications
  const fetchApplications = async () => {
    // fetch sends a request to the backend API. we are waiting to get
    // a response, then we get json data
    const response = await fetch("http://127.0.0.1:5000/application")
    const data = await response.json() 
    setApplications(data.applications)
    console.log(data.applications)
  }

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
  }

  return (
    <>
      <ApplicationList applications={applications} updateApplication={openEditModal} updateCallback={onUpdate}/>
      <button onClick={openCreateModal}>Create New Application</button>
      {isModalOpen && <div className="position: fixed z-1 left-0 top-0 w-full h-full overflow-auto bg-black/20">
        <div className="bg-white m-4 p-4 w-4/5">
          <span className="close" onClick={closeModal}>&times;</span>
          <ApplicationForm existingApplication={currentApplication} updateCallback={onUpdate}/>
        </div>
      </div>
      }
    </>
  );
}
