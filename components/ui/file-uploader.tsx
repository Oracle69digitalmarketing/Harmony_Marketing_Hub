"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [text, setText] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles([acceptedFiles[0]]);
    setUploadSuccess(false);
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
      "application/pdf": [".pdf"],
      "video/*": [".mp4", ".mov"],
    },
    multiple: false,
  })

  const removeFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file))
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
    setUploadSuccess(false);
  }

  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadSuccess(false);
    const formData = new FormData();

    if (files.length > 0) {
      formData.append("file", files[0]);
    } else if (text) {
      formData.append("text", text);
    } else {
      setIsUploading(false);
      return; // Nothing to upload
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { fileId } = await response.json();
        console.log("File uploaded successfully. File ID:", fileId);
        setUploadSuccess(true);
        // The redirect logic will be added in a later phase.
        // For now, we'll just confirm the upload was successful.
        setFiles([]);
        setText("");
      } else {
        console.error("File upload failed");
      }
    } catch (error) {
      console.error("An error occurred during file upload:", error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-gray-500" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? "Drop the file here ..." : "Drag & drop a file here, or click to select"}
        </p>
        <p className="text-xs text-gray-500">Supports a single image, video, or PDF file.</p>
      </div>

      <Textarea
        placeholder="Or paste your text here..."
        value={text}
        onChange={handleTextChange}
        className="min-h-[100px]"
        disabled={files.length > 0}
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded File:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          File uploaded successfully! The AI is now processing your data.
        </div>
      )}

      {(files.length > 0 || text) && (
        <Button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Inputs"
          )}
        </Button>
      )}
    </div>
  )
}