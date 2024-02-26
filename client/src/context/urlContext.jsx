import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/config.js";

// create context
const UrlContext = createContext();

// use context
export const useUrl = () => {
    return useContext(UrlContext);
}

// context provider
export const UrlProvider= ({children}) => {
    const [user, setUser] = useState({
        name: null,
        email: null,
        isadmin: null,
        isvoted: null,
    })

    const [isLogged, setIsLogged] = useState(true);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/`);
            setUser(response.data);
            setIsLogged(false);
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchUser();
      }, []);

    return (
        <UrlContext.Provider value={{ user, isLogged }} >
          {children}
        </UrlContext.Provider>
      );
}