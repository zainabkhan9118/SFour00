import React, { useState, useRef, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const EmojiPicker = ({ onEmojiSelect, isOpen, onClose }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    // Close picker when clicking outside
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // If not open, don't render
  if (!isOpen) return null;

  return (
    <div 
      ref={pickerRef} 
      className="absolute bottom-14 right-0 z-10 shadow-lg rounded-lg bg-white max-w-[90vw] sm:max-w-[350px] transform scale-90 sm:scale-100 origin-bottom-right"
      data-testid="emoji-picker"
    >
      <Picker 
        data={data} 
        onEmojiSelect={(emoji) => {
          onEmojiSelect(emoji.native);
          onClose();
        }}
        theme="light"
        set="native"
        previewPosition="none"
        skinTonePosition="none"
      />
    </div>
  );
};

export default EmojiPicker;