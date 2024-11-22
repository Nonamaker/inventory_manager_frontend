import { useState, createContext, useEffect } from 'react';

export const authContext = createContext();

export function AuthContextProvider({ children }) {
  // NOTE: It's not a good idea to store the token in local storage but it will work well
  //  enough for development!

  const [bearerToken, setBearerToken] = useState("");

  // Local Storage: setting & getting data
  useEffect(() => {
    const bearerTokenData = JSON.parse(localStorage.getItem('bearerToken'));
    if (bearerTokenData) {
      setBearerToken(bearerTokenData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bearerToken', JSON.stringify(bearerToken));
  }, [bearerToken]);

  return (
    <authContext.Provider value={{ bearerToken, setBearerToken }}>
      {children}
    </authContext.Provider>
  )
}