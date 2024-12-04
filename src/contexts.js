import { useState, createContext, useEffect } from 'react';

import { getCookieByName } from './utils';
import { fetchRetry } from './Authentication';

export const authContext = createContext();

export function AuthContextProvider({ children }) {
  // NOTE: It's not a good idea to store the token in local storage but it will work well
  //  enough for development!

  console.log("Rendering AuthContext.");

  const [bearerToken, setBearerToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [isLocalUser, setIsLocalUser] = useState(true);

  useEffect(() => {
    console.log("Mounting AuthContext");
    // If a bearerToken cookie is present, check to see if it still works. If not,
    // check if the refreshToken is present and works. If either work, authenticate
    // user and redirect away from login page.
    const originalFetch = (onError) => {
      fetch(
        process.env.REACT_APP_API + 'inventories',
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieByName("bearerToken")
          },
        }
      ).then(async (response) => {
        if (response.status === 200) {
          setAuthenticated(true);
          console.log("Using previous bearer token.");
        }
      }).catch(onError);
    }
    if (getCookieByName("bearerToken")) {
      fetchRetry(originalFetch);
    }
  }, []);

  const state = {
    bearerToken, setBearerToken,
    authenticated, setAuthenticated,
    user, setUser,
    isLocalUser, setIsLocalUser
  }

  return (
    <authContext.Provider value={state}>
      {children}
    </authContext.Provider>
  )
}
