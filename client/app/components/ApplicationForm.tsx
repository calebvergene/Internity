import { useState, useEffect, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs, { Dayjs } from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

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

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  existingApplication = {},
  updateCallback,
  closeModal
}) => {
  const [name, setName] = useState(existingApplication.name || "");
  const [open, setOpen] = useState<Dayjs | null>(existingApplication.open ? dayjs(existingApplication.open) : null);
  const [close, setClose] = useState<Dayjs | null>(existingApplication.close ? dayjs(existingApplication.close) : null);
  const [link, setLink] = useState(existingApplication.link || "");
  const formRef = useRef<HTMLDivElement>(null);

  const updating = Object.entries(existingApplication).length !== 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      open: open ? open.format("MMMM DD, YYYY") : "",
      close: close ? close.format("MMMM DD, YYYY") : "",
      link
    };
    const url = `http://localhost:5001/${updating ? `update_application/${existingApplication.id}` : "create_application"}`;
    const options: RequestInit = {
      method: updating ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data)
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
      >
        <motion.div
          initial={{ scale: 0, rotate: "12.5deg" }}
          animate={{ scale: 1, rotate: "0deg" }}
          exit={{ scale: 0, rotate: "0deg" }}
          onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
          className="bg-gradient-to-br from-green-400 to-blue-600 text-white py-8 pl-8 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
        >
          <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
          <div className="relative z-10">
            <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <form onSubmit={onSubmit} className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="sr-only">Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="border border-neutral-400/65 rounded-[4px] px-2 py-3 placeholder-neutral-600/90"
                  />
                </div>
                <div className="flex flex-col">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField
                      value={open}
                      onChange={(newValue) => setOpen(newValue)}
                      label="Application Opens"
                    />
                  </LocalizationProvider>
                </div>
                <div className="flex flex-col">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField
                      value={close}
                      onChange={(newValue) => setClose(newValue)}
                      label="Application Due"
                    />
                  </LocalizationProvider>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="link" className="sr-only">Link:</label>
                  <input
                    type="text"
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Link"
                    className="border border-neutral-400/65 rounded-[4px] px-2 py-3 placeholder-neutral-600/90"
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-pink-400 to-yellow-300 rounded-md py-2 px-3 text-white flex justify-center hover:from-yellow-300 hover:to-pink-400 hover:text-white hover:shadow-lg duration-300">
                  {updating ? "Update" : "Create"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplicationForm;
