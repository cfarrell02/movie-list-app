import React, { createContext } from "react";
import flags from "../data/featureFlags.json";

export const FeatureFlagContext = createContext();

export const FeatureFlagProvider = ({ children }) => {

  const getFeatureFlag = (flag) => {
    return flags.find((f) => f.name === flag);
  }

  const flagsValues = {
    getFeatureFlag,
  }

  return (
    <FeatureFlagContext.Provider value={flagsValues}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
export default FeatureFlagProvider;
