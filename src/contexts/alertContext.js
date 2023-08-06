import React, { createContext, useContext, useState } from 'react';

export const AlertContext = createContext();

// export const useAlertContext = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (severity, message) => {
    const uid = Date.now();
    setAlerts([...alerts, { severity, message, uid }]);
  };
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      setAlerts(alerts => alerts.filter(alert => currentTime - alert.uid <= 5000));
    }, 1000); // Check every second for removal

    return () => clearInterval(timer);
  }, []);

  const removeAlert = (index) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  const alertContextValue = {
    alerts,
    addAlert,
    removeAlert,
    };

  return (
    <AlertContext.Provider value={alertContextValue}>
      {children}
    </AlertContext.Provider>
  );
};
export default AlertProvider;