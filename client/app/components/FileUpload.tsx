import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { Field, Label, Input, FileUpload, Message, FileList, File } from '@zendeskgarden/react-forms';
import HashLoader from 'react-spinners/HashLoader';
import { motion } from "framer-motion";


const StyledFileUpload = styled(FileUpload)`
  min-height: 200px;
`;

interface FileUploadComponentProps {
  closeModal: () => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ closeModal }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0 && files.length === 0) {
      setFiles(acceptedFiles);
      console.log("Files received:", acceptedFiles);

      // Set upload status to indicate the file is being processed
      setUploadStatus('processing');

      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      fetch('http://localhost:5001/upload-resume', {
          method: 'POST',
          body: formData,
          credentials: 'include',  // Include credentials if necessary (e.g., for sessions)
        })
        .then(response => response.json())
        .then(data => {
          if (data.skills && Array.isArray(data.skills)) {
            setSkills(data.skills);
          } else {
            setSkills([]);
          }
          setUploadStatus('success');
        })
        .catch((error) => {
          console.error('Error:', error);
          setUploadStatus('error');
        });

    } else {
      console.error("No files received or file already uploaded");
    }
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: handleDrop,
    disabled: files.length > 0,
  });

  return (
    <div>
      <Field>
        <Label>Upload Resume</Label>
        <Message>Acceptable format is PDF.</Message>
        <StyledFileUpload {...getRootProps()} isDragging={isDragActive} disabled={files.length > 0}>
          {isDragActive ? (
            <span>Drop files here...</span>
          ) : (
            <span>
              {files.length === 0 
                ? 'Choose a file or drag and drop here' 
                : uploadStatus === 'processing' 
                ? <HashLoader color="#36d7b7" /> 
                : uploadStatus === 'success' 
                ? 'File uploaded successfully' 
                : 'Failed to process file'}
            </span>
          )}
          <Input {...getInputProps()} disabled={files.length > 0} />
        </StyledFileUpload>
        {files.length === 0 ? (
          <Message>Your resume will be analyzed to match applications with your skills.</Message>
        ) : (
          <div>
            <FileList>
              {files.map((file, index) => (
                <FileList.Item key={index}>
                  <File>{file.name}</File>
                </FileList.Item>
              ))}
            </FileList>
            
            {skills.length > 0 && (
              <div>
                <div className='mt-5'></div>
                <Label>Skills Found: </Label>
                <div className='mt-2'></div>

                  {skills.map((skill, index) => (
                    <motion.button 
                      key={index} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: index * 0.2, duration: 0.2 }}
                      className="p-2 m-1 border border-gray-200 hover:bg-gray-200 text-white rounded duration-300"
                    >
                      <Message>{skill}</Message>
                    </motion.button>
                  ))}

              </div>
            )}
            <div className='flex justify-end w-full mt-2'>
              <button className='p-2 bg-emerald-500 text-white rounded-lg flex items-center' onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              </button>
            </div>
          </div>
        )}
      </Field>
    </div>
  );
};

export default FileUploadComponent;
