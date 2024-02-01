import React, {createContext, useState, useContext} from "react";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const volumeThreshold = 5
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [warning, setWarning] = useState("");
    const [volume, setVolume] = useState(volumeThreshold);


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
                volume,
                setVolume,
                volumeThreshold
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
