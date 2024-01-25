import React, { createContext, useState, useContext } from "react";
// Create the context
export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// Create the provider component
export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [warning, setWarning] = useState("");

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        token,
        setToken,
        userId,
        setUserId,
        deviceId,
        setDeviceId,
        refreshToken,
        setRefreshToken,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        warning,
        setWarning,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
