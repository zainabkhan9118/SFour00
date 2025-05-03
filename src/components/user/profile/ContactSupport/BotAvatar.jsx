// BotAvatar.jsx - Custom bot avatar component
import React, { useContext } from 'react';
import { ThemeContext } from "../../../../context/ThemeContext";


const BotAvatar = () => {
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  return (
    <div className="w-8 h-8 rounded-full bg-orange-500 dark:bg-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      S4
    </div>
  );
};

export default BotAvatar;