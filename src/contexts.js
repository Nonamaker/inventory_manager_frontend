import { useState, createContext, useEffect } from 'react';

import { GetInventories, IsOnline } from './InventoryAPI';

export const authContext = createContext();

export function AuthContextProvider({ children }) {
  // NOTE: It's not a good idea to store the token in local storage but it will work well
  //  enough for development!

  const [bearerToken, setBearerToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [contextLoaded, setContextLoaded] = useState(false);
  const [online, setOnline] = useState(false);

  const [inventories, setInventories] = useState([]);

  // TODO Build in a sync system that verifies the local data against the server data and handles conflicts.

  // Local Storage: load data
  useEffect(() => {
    const bearerTokenData = JSON.parse(localStorage.getItem('bearerToken'));
    if (bearerTokenData) {
      setBearerToken(bearerTokenData);
    }
    const authenticatedData = JSON.parse(localStorage.getItem('authenticated'));
    if (authenticatedData) {
      setAuthenticated(authenticatedData);
    }
    try {
      const inventoryData = JSON.parse(localStorage.getItem('inventories'));
      if (inventoryData) {
        setInventories(inventoryData);
      }
    } catch (e) {
      console.error(e);
    }
    setContextLoaded(true);
  }, []);

  // Local Storage: store changes
  // TODO Don't store undefined values
  useEffect(() => {
    localStorage.setItem('bearerToken', JSON.stringify(bearerToken));
  }, [bearerToken]);
  useEffect(() => {
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
  }, [authenticated]);
  useEffect(() => {
    localStorage.setItem('inventories', JSON.stringify(inventories));
  }, [inventories]);

  // Fetch server data
  useEffect(() => {
    if (bearerToken) {
      IsOnline(bearerToken, setOnline);
    }
    if (online) {
      GetInventories(bearerToken, setInventories);
    }
  }, [bearerToken]);

  const state = {
    bearerToken, setBearerToken,
    authenticated, setAuthenticated,
    inventories, setInventories,
    contextLoaded
  };

  return (
    <authContext.Provider value={state}>
      {children}
    </authContext.Provider>
  )
}