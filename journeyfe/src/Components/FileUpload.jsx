import { useState } from 'react';

const FileUploader = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">File Uploader</h2>

      <label
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500"
      >
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 16l4-4m0 0l4-4m-4 4h12m4 4v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m16 0l-4-4m0 0l-4-4m4 4H7"
            />
          </svg>
          <span className="text-gray-600">Click to upload or drag files here</span>
        </div>
        <input
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700">Uploaded Files</h3>
          <ul className="mt-2 space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded-lg">
                <span className="text-gray-700">{file.name}</span>
                <span className="text-gray-500 text-sm">{file.type || 'Unknown type'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
