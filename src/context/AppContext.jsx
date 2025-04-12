import { createContext, useContext, useState, useEffect } from "react";


export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);

    const BASEURL = import.meta.env.VITE_BASE_URL;
    const value = {
        BASEURL,
        setUser,
    }


  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
