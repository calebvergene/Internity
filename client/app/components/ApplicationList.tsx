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

// The applications prop will come in a list of dictionaries
// NOTE: if you want to filter, you could filter the applications prop here
const ApplicationList: React.FC<ApplicationListProps> = ({ applications, updateApplication, updateCallback }) => {

    const onDelete = async (id: any) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_application/${id}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }

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
                <button onClick={() => onDelete(application.id)}>Delete</button>
                <button onClick={() => updateApplication(application)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;
