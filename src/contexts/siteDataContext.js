import React, { createContext, useContext, useEffect, useState } from "react";

export const SiteDataContext = createContext();

export const SiteDataProvider = ({ children }) => {
  const [adultContent, setAdultContent] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const adult = localStorage.getItem("adultContent");
    const darkMode = localStorage.getItem("isDarkMode");

    if (adult) {
        setAdultContent(adult === "true");
    }
    if (darkMode) {
        setDarkMode(darkMode === "true");
    }
  }, []);

  const siteDataProviderValue = {
    adultContent,
    setAdultContent,
    darkMode,
    setDarkMode,
  };

  return (
    <SiteDataContext.Provider value={siteDataProviderValue}>
      {children}
    </SiteDataContext.Provider>
  );
};
export default SiteDataProvider;
