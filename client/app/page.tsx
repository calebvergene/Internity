"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    fetchApplications()
  }, [])


  // this is an async function, so it has to wait to get 
  // the applications
  const fetchApplications = async () => {
    // fetch sends a request to the backend API. we are waiting to get
    // a response, then we get json data
    const response = await fetch("http://127.0.0.1:5000/applications")
    const data = await response.json() 
    setApplications(data.applications)
    console.log(data.applications)
  }


  return (
    <>

    </>
  );
}
