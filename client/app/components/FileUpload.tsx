import React, { useCallback, useState, memo } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { KEYS } from '@zendeskgarden/container-utilities';
import {
  Field,
  Label,
  Hint,
  Input,
  FileUpload,
  Message,
  FileList,
  File
} from '@zendeskgarden/react-forms';
import { Progress } from '@zendeskgarden/react-loaders';
import { Row, Col } from '@zendeskgarden/react-grid';
import { Tooltip } from '@zendeskgarden/react-tooltips';
import { PDFDocument } from 'pdf-lib';

const StyledFileUpload = styled(FileUpload)`
  min-height: ${(p) => p.theme.space.base * 20}px;
`;

interface FileItemProps {
  name: string;
  onRemove: () => void;
}

const FileItem: React.FC<FileItemProps> = memo(({ name, onRemove }) => {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    /* simulate file upload progress */
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

const Example: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);

  const removeFile = useCallback(
    (fileIndex: number) => {
      setFiles((files) => files.filter((_, index) => index !== fileIndex));
    },
    []
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        for (const acceptedFile of acceptedFiles) {
          const fileReader = new FileReader();
          fileReader.onload = async () => {
            const pdfData = new Uint8Array(fileReader.result as ArrayBuffer);
            const pdfDoc = await PDFDocument.load(pdfData);
            const numPages = pdfDoc.getPageCount();

            if (numPages <= 2) {
              setFiles((files) => [...files, acceptedFile.name]);
            } else {
              alert(`The file "${acceptedFile.name}" has more than 2 pages.`);
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
      <Col sm={5}>
        <Field>
          <Label>Upload a PDF</Label>
          <Hint>Only PDFs with a maximum of 2 pages are allowed</Hint>
          <StyledFileUpload {...getRootProps()} isDragging={isDragActive}>
            {isDragActive ? (
              <span>Drop files here</span>
            ) : (
              <span>Choose a file or drag and drop here</span>
            )}
            <Input {...getInputProps()} />
          </StyledFileUpload>
          {files.length === 0 ? (
            <Message>Acceptable format is PDF with up to 2 pages</Message>
          ) : (
            <FileList>
              {files.map((file, index) => (
                <FileItem key={file} name={file} onRemove={() => removeFile(index)} />
              ))}
            </FileList>
          )}
        </Field>
      </Col>
    </Row>
  );
};

export default Example;
