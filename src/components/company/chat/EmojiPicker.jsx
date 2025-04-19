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

  const emojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘'];

  return (
    <div 
      ref={pickerRef} 
      className="absolute bottom-14 right-0 z-10 shadow-lg rounded-lg bg-white max-w-[90vw] sm:max-w-[350px] transform scale-90 sm:scale-100 origin-bottom-right"
      data-testid="emoji-picker"
    >
      <div className="grid grid-cols-5 gap-1">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className="w-8 h-8 text-xl hover:bg-gray-100 rounded"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;