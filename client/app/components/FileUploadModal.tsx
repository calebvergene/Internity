import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import FileUploadComponent from "../components/FileUpload"

interface FileUploadProps {
  closeModal: () => void;
}

const FileUploadModal: React.FC<FileUploadProps> = ({ closeModal }) => {
  const formRef = useRef<HTMLDivElement>(null);

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
              <FileUploadComponent/>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FileUploadModal;
