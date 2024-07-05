"use client";
import { useState, useEffect } from "react";
import ApplicationList from "./components/ApplicationList"
import ApplicationForm from "./components/ApplicationForm";

export default function Home() {
  const [applications, setApplications] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)


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
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  return (
    <>
      <ApplicationList applications={applications} />
      <button onClick={openCreateModal}>Create New Application</button>
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <ApplicationForm />
        </div>
      </div>
      }
    </>
  );
}
