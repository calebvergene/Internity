import React from "react";

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
  }
  
  // the applications prop will come in a list of dictionaries
  // NOTE: if i wanted to filter, I could filter the applications prop here
  const ApplicationList: React.FC<ApplicationListProps> = ({ applications }) => {
    return (
        <div>
            <h2>Applications</h2>
            <table>
                <thead>
                   <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Open</th>
                    <th>Due</th>
                    <th>Actions</th>
                    </tr> 
                </thead>
                <tbody>
                {applications.map((application) => (
                    <tr key={application.id}>
                        <td>{application.name}</td>
                        <td>{application.status}</td>
                        <td>{application.open}</td>
                        <td>{application.close}</td>
                        <td>
                            <button>Update</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    )
}

export default ApplicationList