import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ input, setInput }) => {
  
  // Ensure the description is not undefined or null
  useEffect(() => {
    if (!input.description) {
      setInput({ ...input, description: "" });
    }
  }, []);

  const handleChange = (content) => {
    setInput({ ...input, description: content });
  };

  return (
    <ReactQuill 
      theme="snow" 
      value={input.description || ""}  // Ensure value is never undefined
      onChange={handleChange} 
    />
  );
};

export default RichTextEditor;
