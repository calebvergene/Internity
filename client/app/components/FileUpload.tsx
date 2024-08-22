import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { Field, Label, Input, FileUpload, Message, FileList, File } from '@zendeskgarden/react-forms';

const StyledFileUpload = styled(FileUpload)`
  min-height: 200px;
`;

interface FileUploadComponentProps {
  closeModal: () => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ closeModal }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [skills, setSkills] = useState<string[]>([]); // Initialize skills as an empty array
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0 && files.length === 0) {
      setFiles(acceptedFiles);
      console.log("Files received:", acceptedFiles);

      // Set upload status to indicate the file is being processed
      setUploadStatus('Processing file...');

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
            setSkills(data.skills); // Ensure data.skills is an array before setting it
          } else {
            setSkills([]); // Fallback to an empty array if data.skills is not an array
          }
          setUploadStatus('File uploaded successfully');
        })
        .catch((error) => {
          console.error('Error:', error);
          setUploadStatus('Failed to process file');
        });

    } else {
      console.error("No files received or file already uploaded");
    }
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: handleDrop,
    disabled: files.length > 0, // Disable further uploads after one file is uploaded
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
            <span>{files.length === 0 ? 'Choose a file or drag and drop here' : uploadStatus }</span>
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
                {skills.map((skill, index) => (
                  <button key={index} className="p-2 m-1 bg-blue-500 text-white rounded">
                    <Message>{skill}</Message>
                  </button>
                ))}
              </div>
            )}
            <div className='flex justify-end w-full mt-2'>
              <button className='p-1.5 bg-black/80 text-white rounded-lg flex items-center' onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5">
                  <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z" clipRule="evenodd" />
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
