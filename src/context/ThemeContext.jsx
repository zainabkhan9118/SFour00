import React, { createContext, useState, useEffect } from 'react';

// Create a context for theme management
export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Initialize theme from local storage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Apply theme to document whenever it changes or on page visibility change
  useEffect(() => {
    // Apply theme whenever it changes
    applyTheme(theme);
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Handle page visibility changes (for back navigation)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reapply saved theme when page becomes visible again
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
        if (savedTheme !== theme) {
          setTheme(savedTheme);
        }
      }
    };

    // Handle page show events (triggered when navigating back)
    const handlePageShow = (event) => {
      // If the page is loaded from cache (like when using back button)
      if (event.persisted) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
        if (savedTheme !== theme) {
          setTheme(savedTheme);
        }
      }
    };
    
    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add event listener for page show (another way to detect back navigation)
    window.addEventListener('pageshow', handlePageShow);
    
    // This runs when the component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [theme]);

  // Initial theme application (runs only once on page load)
  useEffect(() => {
    // Apply the theme from localStorage immediately on page load
    // This ensures theme is applied before react hydration
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
  }, []);

  // Helper function to apply theme to document
  const applyTheme = (themeValue) => {
    if (themeValue === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};