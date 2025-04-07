'use client';

import Link from 'next/link';
import FileUploader from '../components/FileUploader';

export default function FileManagement() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-red-600 p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold">F1 File Management</h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
        
        {/* File uploader component */}
        <FileUploader />
        
        {/* Guidelines */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <h2 className="text-xl font-bold mb-3">Guidelines for File Uploads</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Maximum file size: <span className="font-medium">100MB</span></li>
            <li>Supported file types: Video, images, documents and data files</li>
            <li>Files are stored securely in our cloud storage</li>
            <li>Uploaded files can be accessed from the list above</li>
            <li>For larger files, please contact the system administrator</li>
          </ul>
          
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
            <p className="text-sm">
              <strong>Note:</strong> All uploaded files are subject to review by the Formula One 
              data team. Files containing inappropriate content will be removed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 