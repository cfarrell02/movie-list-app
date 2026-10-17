import React, { createContext, useCallback, useEffect, useState } from 'react';

export const AlertContext = createContext();

const ALERT_LIFETIME_MS = 5000;
let nextAlertId = 0;

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Use functional updates so alerts fired in quick succession don't overwrite each other
  const addAlert = useCallback((severity, message) => {
    nextAlertId += 1;
    setAlerts((current) => [...current, { severity, message, uid: nextAlertId, createdAt: Date.now() }]);
  }, []);

  const removeAlert = useCallback((uid) => {
    setAlerts((current) => current.filter((alert) => alert.uid !== uid));
  }, []);

  useEffect(() => {
    if (alerts.length === 0) return undefined;
    const timer = setInterval(() => {
      const now = Date.now();
      setAlerts((current) => current.filter((alert) => now - alert.createdAt <= ALERT_LIFETIME_MS));
    }, 500);
    return () => clearInterval(timer);
  }, [alerts.length]);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
export default AlertProvider;
