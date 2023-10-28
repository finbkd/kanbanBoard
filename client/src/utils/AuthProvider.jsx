import React from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState("");

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
