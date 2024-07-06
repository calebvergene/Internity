import { useState } from "react";

interface Application {
    id?: number;
    name: string;
    open: string;
    close: string;
    link: string;
  }
  
  interface ApplicationFormProps {
    existingApplication?: Partial<Application>;
    updateCallback: () => void;
  }

  
const ApplicationForm: React.FC<ApplicationFormProps> = ({ existingApplication = {}, updateCallback }) => {
  const [name, setName] = useState(existingApplication.name || "");
  const [open, setOpen] = useState(existingApplication.open || "");
  const [close, setClose] = useState(existingApplication.close || "");
  const [link, setLink] = useState(existingApplication.link || "");

  const updating = Object.entries(existingApplication).length !== 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      open,
      close,
      link,
    };
    const url = `http://127.0.0.1:5000/${updating ? `update_application/${existingApplication.id}` : "create_application"}`;
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    if (response.status !== 201 && response.status !== 200) {
      const responseData = await response.json();
      alert(responseData.message);
    } else {
      updateCallback();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="text-black">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="open">Opens:</label>
          <input
            type="text"
            id="open"
            value={open}
            onChange={(e) => setOpen(e.target.value)}
            className="border border-gray-400 rounded-md ml-2 mt-2 px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="close">Due:</label>
          <input
            type="text"
            id="close"
            value={close}
            onChange={(e) => setClose(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="link">Link:</label>
          <input
            type="text"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      </div>
      <button type="submit">{updating ? "Update" : "Create"}</button>
    </form>
  );
};

export default ApplicationForm;
