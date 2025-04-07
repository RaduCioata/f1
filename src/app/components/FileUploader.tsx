'use client';

import { useState, useRef, ChangeEvent } from 'react';

interface UploadedFile {
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
}

export default function FileUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    // Type guard to ensure file is defined
    if (file instanceof File) {
      await uploadFile(file);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);

    try {
      // Check if file is too large (client-side validation)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        setError(`File size exceeds the 100MB limit (${formatFileSize(file.size)})`);
        setIsUploading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('file', file);

      // Set up a custom XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });

      // Create a promise to handle the XMLHttpRequest
      const uploadPromise = new Promise<UploadedFile>((resolve, reject) => {
        xhr.open('POST', '/api/upload', true);
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response as UploadedFile);
            } else {
              reject(new Error(response.error || 'Upload failed'));
            }
          } else {
            reject(new Error(`HTTP error ${xhr.status}: ${xhr.statusText}`));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error('Network error occurred'));
        };
        
        xhr.send(formData);
      });

      // Wait for the upload to complete
      const uploadedFile = await uploadPromise;
      
      // Update the uploaded files list
      setUploadedFiles(prev => [...prev, uploadedFile]);
      
      // Reset state
      setIsUploading(false);
      setProgress(0);
      
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setIsUploading(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      // Type guard to ensure file is defined
      if (file instanceof File) {
        uploadFile(file);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">File Uploader</h2>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 ${
          isUploading ? 'bg-gray-100 border-gray-300' : 'border-blue-300 hover:border-blue-500'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="w-full">
            <p className="mb-2">Uploading file... {progress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              Click to select or drag and drop files here
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: 100MB
            </p>
          </div>
        )}
      </div>
      
      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
          <ul className="divide-y divide-gray-200">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <svg 
                    className="h-6 w-6 text-gray-500 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <div>
                    <p className="font-medium">{file.fileName.split('-').slice(1).join('-')}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.fileSize)}</p>
                  </div>
                </div>
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 