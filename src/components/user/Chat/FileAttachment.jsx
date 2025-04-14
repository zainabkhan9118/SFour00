import React, { useState, useRef } from 'react';
import { FaFile, FaImage, FaTimes, FaPaperclip } from 'react-icons/fa';

const FileAttachment = ({ onFileSelect, isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const attachmentRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles([...selectedFiles, ...files]);

    // Create preview URLs for images
    const newPreviewURLs = files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null;
    });
    setPreviewURLs([...previewURLs, ...newPreviewURLs]);

    // Pass files to parent component
    onFileSelect(files);
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviewURLs = [...previewURLs];
    if (newPreviewURLs[index]) {
      URL.revokeObjectURL(newPreviewURLs[index]);
    }
    newPreviewURLs.splice(index, 1);
    setPreviewURLs(newPreviewURLs);

    // Inform parent component about removed file
    onFileSelect(newFiles);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <FaImage className="text-blue-500" />;
    }
    return <FaFile className="text-gray-500" />;
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={attachmentRef}
      className="absolute bottom-14 right-0 z-10 shadow-lg rounded-lg bg-white w-64 p-3"
      data-testid="file-attachment"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700">Attach Files</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
           onClick={triggerFileInput}>
        <FaPaperclip className="mx-auto text-gray-400 text-xl mb-2" />
        <p className="text-sm text-gray-500">Click to browse files</p>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Selected files:</p>
          <ul className="max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-xs py-1 border-b">
                <div className="flex items-center">
                  {previewURLs[index] ? (
                    <img src={previewURLs[index]} alt="preview" className="w-6 h-6 object-cover mr-2 rounded" />
                  ) : (
                    <span className="mr-2">{getFileIcon(file)}</span>
                  )}
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-600 ml-2"
                >
                  <FaTimes size={12} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileAttachment;