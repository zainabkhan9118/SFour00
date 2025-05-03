// UserAvatar.jsx - Custom user avatar component
import React, { useContext } from 'react';
import { ThemeContext } from "../../../../context/ThemeContext";

const UserAvatar = () => {
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  return (
    <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      ME
    </div>
  );
};

export default UserAvatar;