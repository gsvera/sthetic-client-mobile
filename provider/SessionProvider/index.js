import { useState, useContext, createContext, useEffect } from "react";
import {
  getStoreSession,
  KEY_STORE,
  setStoreSession,
} from "@/hooks/StoreDataSecure";
import { useApiProvider } from "../InterceptorProvider";

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const { token } = useApiProvider();

  const [storeSessionProvider, setStoreSessionProvider] = useState(null);

  useEffect(() => {
    if (token) {
      getStoreSession({ key: KEY_STORE.idUser }).then((value) => {
        if (value) {
          setStoreSessionProvider((prev) => ({ ...prev, idUser: value }));
        }
      });
      getStoreSession({ key: KEY_STORE.defaultState }).then((value) => {
        if (value)
          setStoreSessionProvider((prev) => ({ ...prev, defaultState: value }));
      });
      getStoreSession({ key: KEY_STORE.defaultMunicipality }).then((value) => {
        if (value)
          setStoreSessionProvider((prev) => ({
            ...prev,
            defaultMunicipality: value,
          }));
      });
    } else {
      setStoreSession({ key: KEY_STORE.idUser, value: null });
      setStoreSession({ key: KEY_STORE.defaultState, value: null });
      setStoreSession({ key: KEY_STORE.defaultMunicipality, value: null });
    }
  }, [token]);

  const deleteSessionStore = () => {
    setStoreSessionProvider(null);
  };

  const setDefaultLocationStore = (data) => {
    setStoreSession({ key: KEY_STORE.defaultState, value: data.defaultState });
    setStoreSession({
      key: KEY_STORE.defaultMunicipality,
      value: data.defaultMunicipality,
    });
    setStoreSessionProvider({
      defaultState: data.defaultState,
      defaultMunicipality: data.defaultMunicipality,
    });
  };

  return (
    <SessionContext.Provider
      value={{
        storeSessionProvider,
        deleteSessionStore,
        setDefaultLocationStore,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

const useSessionProvider = () => {
  return useContext(SessionContext);
};

export { SessionProvider, useSessionProvider };
