import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function FileUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/s3-upload', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const uploadData = JSON.parse(xhr.responseText);
        const processResponse = await fetch('/api/process-input', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            fileId: uploadData.fileId, 
            fileType: uploadedFile.type 
          }),
        });

        const processData = await processResponse.json();
        setProcessedData(processData);
      } else {
        console.error('Upload failed:', xhr.statusText);
      }
      setIsLoading(false);
    };

    xhr.onerror = () => {
      console.error('Error during upload and process:');
      setIsLoading(false);
    };

    const formData = new FormData();
    formData.append('file', uploadedFile);
    xhr.send(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        {...getRootProps()}
        className={`w-full p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          isDragActive ? 'border-blue-500' : 'border-gray-300'
        }`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {uploadedFile && (
        <div className="mt-4">
          <p>Selected file: {uploadedFile.name}</p>
          {isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400">
            {isLoading ? `Processing... ${uploadProgress}%` : 'Upload and Process'}
          </button>
        </div>
      )}
      {processedData && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 w-full">
          <h3 className="text-lg font-bold">Processed Result:</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(processedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
