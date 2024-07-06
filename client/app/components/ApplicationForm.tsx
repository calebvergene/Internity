import { useState, useEffect, useRef } from "react";

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
  closeModal: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ existingApplication = {}, updateCallback, closeModal }) => {
  const [name, setName] = useState(existingApplication.name || "");
  const [open, setOpen] = useState(existingApplication.open || "");
  const [close, setClose] = useState(existingApplication.close || "");
  const [link, setLink] = useState(existingApplication.link || "");
  const formRef = useRef<HTMLDivElement>(null);

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
      closeModal();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-400 rounded-md px-2 py-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="open" className="mb-1">Opens:</label>
            <input
              type="text"
              id="open"
              value={open}
              onChange={(e) => setOpen(e.target.value)}
              className="border border-gray-400 rounded-md px-2 py-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="close" className="mb-1">Due:</label>
            <input
              type="text"
              id="close"
              value={close}
              onChange={(e) => setClose(e.target.value)}
              className="border border-gray-400 rounded-md px-2 py-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="link" className="mb-1">Link:</label>
            <input
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border border-gray-400 rounded-md px-2 py-1"
            />
          </div>
          <button onClick={onSubmit} className="bg-green-500/10 border-transparent rounded-md py-2 px-3 text-green-600 flex justify-center hover:bg-green-500/20 hover:text-green-600 duration-300">
            {updating ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
