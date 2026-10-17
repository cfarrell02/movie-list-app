import React, { createContext, useState } from "react";

export const SiteDataContext = createContext();

const readFlag = (key) => {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const writeFlag = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (e.g. private browsing); the setting just won't persist
  }
};

export const SiteDataProvider = ({ children }) => {
  // Read synchronously so the correct theme is applied on first paint
  const [adultContent, setAdultContentState] = useState(() => readFlag("adultContent"));
  const [darkMode, setDarkModeState] = useState(() => readFlag("isDarkMode"));

  const setAdultContent = (value) => {
    setAdultContentState(!!value);
    writeFlag("adultContent", !!value);
  };

  const setDarkMode = (value) => {
    setDarkModeState(!!value);
    writeFlag("isDarkMode", !!value);
  };

  return (
    <SiteDataContext.Provider value={{ adultContent, setAdultContent, darkMode, setDarkMode }}>
      {children}
    </SiteDataContext.Provider>
  );
};
export default SiteDataProvider;
