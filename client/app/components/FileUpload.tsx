import React, { useCallback, useState, memo } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { KEYS } from '@zendeskgarden/container-utilities';
import {
  Field,
  Label,
  Input,
  FileUpload,
  Message,
  FileList,
  File
} from '@zendeskgarden/react-forms';
import { Progress } from '@zendeskgarden/react-loaders';
import { Row, Col } from '@zendeskgarden/react-grid';
import { Tooltip } from '@zendeskgarden/react-tooltips';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const StyledFileUpload = styled(FileUpload)`
  min-height: 200px;
`;

interface FileItemProps {
  name: string;
  onRemove: () => void;
}

const FileItem: React.FC<FileItemProps> = memo(({ name, onRemove }) => {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          clearInterval(interval);
          return 100;
        }
        return value + 20;
      });
    }, Math.random() * 300 + 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleFileKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === KEYS.DELETE || e.key === KEYS.BACKSPACE) {
      e.preventDefault();
      onRemove();
    }
  };

  const handleCloseKeyDown = (e: React.KeyboardEvent<any>) => {
    const keys = [KEYS.SPACE, KEYS.ENTER, KEYS.DELETE, KEYS.BACKSPACE];

    if (keys.includes(e.key)) {
      e.preventDefault();
      alert('File dismissed via keyboard');
    }
  };

  const labelAction = progress === 100 ? 'remove' : 'cancel upload';

  return (
    <FileList.Item>
      <File
        type="pdf"
        title={name}
        aria-label={`PDF file, press delete to ${labelAction}`}
        tabIndex={0}
        onKeyDown={handleFileKeyDown}
      >
        {name}
        <Tooltip content={progress === 100 ? 'Remove file' : 'Stop upload'}>
          {progress === 100 ? (
            <File.Delete
              aria-label="Remove file"
              onClick={onRemove}
              onKeyDown={handleCloseKeyDown}
            />
          ) : (
            <File.Close
              aria-label="Stop upload"
              onClick={onRemove}
              onKeyDown={handleCloseKeyDown}
            />
          )}
        </Tooltip>
        <Progress
          value={progress}
          aria-label={`Uploading ${name}`}
          aria-hidden={progress === 100}
        />
      </File>
    </FileList.Item>
  );
});

const FileUploadComponent: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [pdfText, setPdfText] = useState<string | null>(null);

  const removeFile = useCallback(
    (fileIndex: number) => {
      setFiles((files) => files.filter((_, index) => index !== fileIndex));
      setPdfText(null); // Clear extracted text when a file is removed
    },
    []
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        for (const acceptedFile of acceptedFiles) {
          const fileReader = new FileReader();
          fileReader.onload = async () => {
            try {
              const pdfData = new Uint8Array(fileReader.result as ArrayBuffer);
              const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
              const textItems = [];

              for (let i = 0; i < pdf.numPages; i++) {
                const page = await pdf.getPage(i + 1);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                textItems.push(pageText);
              }

              const fullText = textItems.join('\n');

              setPdfText(fullText);
              setFiles((files) => [...files, acceptedFile.name]);
            } catch (error) {
              console.error(error);
              alert('Failed to extract text from the PDF.');
            }
          };
          fileReader.readAsArrayBuffer(acceptedFile);
        }
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop
  });

  return (
    <Row justifyContent="center">
      <Col sm={12}>
        <Field>
          <Label>Upload Resume</Label>
          <Message>Acceptable format is PDF.</Message>
          <StyledFileUpload {...getRootProps()} isDragging={isDragActive}>
            {isDragActive ? (
              <span>Drop files here</span>
            ) : (
              <span>Choose a file or drag and drop here</span>
            )}
            <Input {...getInputProps()} />
          </StyledFileUpload>
          {files.length === 0 ? (
            <Message>Your resume will be analyzed to match you up to companies that are looking for people with your skills.</Message>
          ) : (
            <FileList>
              {files.map((file, index) => (
                <FileItem key={file} name={file} onRemove={() => removeFile(index)} />
              ))}
            </FileList>
          )}
        </Field>
        {pdfText && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Extracted Text:</h3>
            <pre className="whitespace-pre-wrap">{pdfText}</pre>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default FileUploadComponent;
