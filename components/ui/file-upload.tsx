import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function FileUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadResponse.ok) {
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
        console.error('Upload failed:', uploadData.message);
      }
    } catch (error) {
      console.error('Error during upload and process:', error);
    }
    setIsLoading(false);
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
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400">
            {isLoading ? 'Processing...' : 'Upload and Process'}
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