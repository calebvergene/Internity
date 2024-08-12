"use client";

import React from "react";
import { useState } from "react";
import CustomDropdown from "./CustomDropdown";

interface Application {
  id: number;
  status: string;
  name: string;
  open: string;
  close: string;
  link: string;
}

interface ApplicationListProps {
  applications: Application[];
  updateApplication: (application: Application) => void;
  updateCallback: () => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ applications, updateApplication, updateCallback }) => {


    const clickStatus = async (stat: string, application: Application) => {
        try {

            const updatedApplication = { ...application, status: stat };
            console.log (updatedApplication)
            const response = await fetch(`http://localhost:5001/update_application/${application.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updatedApplication)
            });
            if (response.status === 200) {
                updateCallback();
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            alert(error);
        }
    };

    
    const onDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5001/delete_application/${id}`, {
                method: "DELETE",
                credentials: 'include',
            });
            if (response.status === 200) {
                updateCallback();
            } else {
                console.error("Failed to delete");
            }
        } catch (error) {
            alert(error);
        }
    };

    const getStatusClassName = (status: string) => {
        switch (status) {
          case "Not Applied":
            return "text-neutral-400 mr-2";
          case "Applied":
            return "text-blue-500 mr-2";
          case "Interviewing":
            return "text-yellow-300 mr-2";
          case "Offered":
            return "text-green-400 mr-2";
          case "Rejected":
            return "text-red-500 mr-2";
          default:
            return "";
        }
      };

    return (
        <div className="flex items-start justify-center h-[800px] overflow-auto">
            <div className="w-4/5 my-8">
                <div className="overflow-y-visible max-h-[900px]">
                    <table className="w-full border-collapse table-fixed">
                        <thead>
                            <tr className="">
                                <th className="font-rubik border-b border-black py-1 text-center font-normal text-gray-600">Name</th>
                                <th className="font-rubik  border-b border-black py-1 text-center font-normal text-gray-600">Status</th>
                                <th className="font-rubik border-b border-black py-1 text-center font-normal text-gray-600">Role</th>
                                <th className="font-rubik  border-b border-black py-1 text-center font-normal text-gray-600">Location</th>
                                <th className="font-rubik border-b border-black py-1 text-center font-normal text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application, index) => (
                                <React.Fragment key={application.id}>
                                    {index > 0 && (
                                        <tr>
                                            <td colSpan={5}>
                                                <hr className="border-t border-gray-300" />
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="h-full">
                                        <a
                                            href={application.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            >
                                            <td className="flex items-center justify-center font-rubik font-medium">
                                            
                                                <button className="">
                                                    {application.name}
                                                </button>
                                            
                                            </td>
                                        </a>
                                        <td className="py-2 text-center">
                                        <CustomDropdown
                                            label={<><span className={getStatusClassName(application.status)}> ● </span><span>{application.status}</span></>}
                                            items={[
                                            { label: "Not Applied", onClick: () => clickStatus("Not Applied", application) },
                                            { label: "Applied", onClick: () => clickStatus("Applied", application) },
                                            { label: "Interviewing", onClick: () => clickStatus("Interviewing", application) },
                                            { label: "Offered", onClick: () => clickStatus("Offered", application) },
                                            { label: "Rejected", onClick: () => clickStatus("Rejected", application) }
                                            ]}
                                        />
                                        </td>
                                        <td className="py-2 text-center text-m">{application.open}</td>
                                        <td className="py-2 text-center text-sm">{application.close}</td>
                                        <td className="py-2 text-center flex justify-center text-sm">
                                            <button onClick={() => onDelete(application.id)} className="text-gray-500 flex justify-center place-content-center hover:bg-gray-500/20 hover:text-gray-600 duration-300 p-1 rounded-xl mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9L14.394 18M9.26 18L9.606 9M18.628 5.79C18.97 5.842 19.31 5.897 19.65 5.956M18.628 5.79L18.16 19.673A2.25 2.25 0 0115.916 21H8.084A2.25 2.25 0 015.84 19.673L5.372 5.79M18.628 5.79C17.48 5.618 16.313 5.492 15.13 5.414M4.372 5.79C4.034 5.731 3.694 5.676 3.354 5.617M4.372 5.79A48.108 48.108 0 007.85 5.393M14.5 4.5V3.75C14.5 2.57 13.59 1.586 12.41 1.55A51.964 51.964 0 009.09 1.55C7.91 1.586 7 2.57 7 3.75V4.5M14.5 4.5H9.5M14.5 4.5H9.5M14.5 4.5V5.393M9.5 4.5V5.393" />
                                                </svg>
                                            </button>
                                            <button onClick={() => updateApplication(application)} className="text-gray-500 flex justify-center place-content-center hover:bg-gray-500/20 hover:text-gray-600 duration-300 p-1 rounded-xl mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApplicationList;
