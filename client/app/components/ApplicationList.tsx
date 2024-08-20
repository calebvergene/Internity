import React, { useState, useEffect } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import CustomDropdown from './CustomDropdown';


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

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  updateApplication,
  updateCallback
}) => {
  const [listWidth, setListWidth] = useState<number>(0); // Initialize with 0 or some default value

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Safe to use `window` object here
      setListWidth(window.innerWidth * 0.98); // Set initial width

      const handleResize = () => {
        setListWidth(window.innerWidth * 0.98); // Adjust width on resize
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const clickStatus = async (stat: string, application: Application) => {
    try {
      const updatedApplication = { ...application, status: stat };
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

  const getLink = (link: string | null | undefined): string => {
    if (link && link.includes(' ')) {
      return link.split(' ')[0];
    } else if (link) {
      return link;
    } else {
      return '';
    }
  };

  const getSimilarity = (link: string): string => {
    if (link && link.includes(' ')) {
      return link.split(' ')[1];
    } else if (link) {
      return 'x';
    } else {
      return '';
    }
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const application = applications[index];
    return (
      <div style={style} key={application.id} className={`flex items-center justify-center ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
        <div className="w-1/5 flex items-center justify-center font-rubik font-medium">
          {application.name}
        </div>
        <div className="w-1/5 text-center">
          <CustomDropdown
            label={
              <>
                <span className={getStatusClassName(application.status)}> ● </span>
                <span>{application.status}</span>
              </>
            }
            items={[
              { label: "Not Applied", onClick: () => clickStatus("Not Applied", application) },
              { label: "Applied", onClick: () => clickStatus("Applied", application) },
              { label: "Interviewing", onClick: () => clickStatus("Interviewing", application) },
              { label: "Offered", onClick: () => clickStatus("Offered", application) },
              { label: "Rejected", onClick: () => clickStatus("Rejected", application) }
            ]}
          />
        </div>
        <div className="w-1/5 py-2 text-center text-m">{application.open}</div>
        <div className="w-1/5 py-2 text-center text-sm">{application.close}</div>
        <div className="w-1/5 py-2 text-center flex justify-center text-sm">
          <a href={getLink(application.link)} target="_blank" rel="noopener noreferrer">
            <button className="justify-start bg-green-500 duration-300 font-rubik rounded-md mt-2 py-1 mb-1 mr-2 px-3 text-white flex place-content-center" onClick={() => clickStatus("Applied", application)}>
              Apply
            </button>
          </a>
          <button
            onClick={() => updateApplication(application)}
            className="text-gray-500 flex justify-center place-content-center hover:bg-gray-500/20 hover:text-gray-600 duration-300 py-1 pt-1.5 px-1 rounded-xl mt-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(application.id)}
            className="text-gray-500 flex justify-center place-content-center hover:bg-gray-500/20 hover:text-gray-600 duration-300 py-1 pt-1.5 px-1 rounded-xl mt-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9L14.394 18M9.26 18L9.606 9M18.628 5.79C18.97 5.842 19.31 5.897 19.65 5.956M18.628 5.79L18.16 19.673A2.25 2.25 0 0115.916 21H8.084A2.25 2.25 0 015.84 19.673L5.372 5.79M18.628 5.79C17.48 5.618 16.313 5.492 15.13 5.414M4.372 5.79C4.034 5.731 3.694 5.676 3.354 5.617M4.372 5.79A48.108 48.108 0 007.85 5.393M14.5 4.5V3.75C14.5 2.57 13.59 1.586 12.41 1.55A51.964 51.964 0 009.09 1.55C7.91 1.586 7 2.57 7 3.75V4.5M14.5 4.5H9.5M14.5 4.5H9.5M14.5 4.5V5.393M9.5 4.5V5.393"
              />
            </svg>
          </button>
          <p>{getSimilarity(application.link)}</p>
        </div>
      </div>
    );
  };

  return (
    <FixedSizeList
      height={700}
      width={listWidth}
      itemSize={60} // Approximate height of each row
      itemCount={applications.length} // Total number of items
      overscanCount={5} // Number of items to load outside of the visible area
    >
      {Row}
    </FixedSizeList>
  );
};

export default ApplicationList;
