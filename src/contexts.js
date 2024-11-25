import { useState, createContext, useEffect } from 'react';

export const authContext = createContext();

export function AuthContextProvider({ children }) {
  // NOTE: It's not a good idea to store the token in local storage but it will work well
  //  enough for development!

  const [bearerToken, setBearerToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [contextLoaded, setContextLoaded] = useState(false);

  // Local Storage: setting & getting data
  useEffect(() => {
    const bearerTokenData = JSON.parse(localStorage.getItem('bearerToken'));
    if (bearerTokenData) {
      setBearerToken(bearerTokenData);
    }
  }, []);
  useEffect(() => {
    const authenticatedData = JSON.parse(localStorage.getItem('authenticated'));
    if (authenticatedData) {
      setAuthenticated(authenticatedData);
    }
  }, []);
  useEffect(() => {
    setContextLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('bearerToken', JSON.stringify(bearerToken))
  }, [bearerToken])
  useEffect(() => {
    localStorage.setItem('authenticated', JSON.stringify(authenticated))
  }, [authenticated])

  const state = {
    bearerToken, setBearerToken,
    authenticated, setAuthenticated,
    contextLoaded
  };

  return (
    <authContext.Provider value={state}>
      {children}
    </authContext.Provider>
  )
}