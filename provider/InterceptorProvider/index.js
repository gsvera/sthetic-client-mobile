import axiosInstance from "@/api";
// import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { KEY_STORE, setStoreSession } from "@/hooks/StoreDataSecure";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNotificationProvider } from "../NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";

const InterceptorAxiosProvider = createContext();

const axiosInstances = [axiosInstance];

const ApiRequestProvider = ({ children }) => {
  const { handleNotification } = useNotificationProvider();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token)
      setStoreSession({
        key: KEY_STORE.userToken,
        value: token,
      });
  }, [token]);

  const interceptRequestHandler = useCallback(
    (config) => {
      config.params = { ...(config?.params ?? {}) };
      config.headers = {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      };
      return config;
    },
    [token]
  );

  const clearToken = async () => {
    setToken(null);
    await setStoreSession({ key: KEY_STORE.userToken, value: "" });
  };

  const interceptResponseErrorHandler = useCallback((error) => {
    const {
      status: statusCode,
      data,
      headers,
      message,
    } = error?.response ?? {};

    // console.log(token);
    console.log(
      "🚀 ~ interceptResponseErrorHandler ~ error?.response:",
      statusCode,
      token
    );
    if (statusCode === 401) {
      handleNotification({
        type: TYPE_STATUS.ERROR,
        message: "Su Sessión expiro, inicie sessión nuevamente",
      });

      clearToken();
    }

    if (statusCode === 403 && !token) {
      clearToken();
    }
    // Reject promise if usual error
    if (statusCode !== 401) {
      return Promise.reject(error);
    }
    if (statusCode === 401) {
      setToken(null);
      setStoreSession({ key: KEY_STORE.userToken, value: null });
      return Promise.reject(error);
    }
  }, []);

  useEffect(() => {
    const requestInterceptors = axiosInstances?.map((axiosInstance) =>
      axiosInstance.interceptors.request.use(interceptRequestHandler)
    );
    const responseInterceptors = axiosInstances?.map((axiosInstance) =>
      axiosInstance.interceptors.response.use(
        (response) => response,
        interceptResponseErrorHandler
      )
    );

    return () => {
      for (let index = 0; index < axiosInstances.length; index++) {
        const axiosInstance = axiosInstances[index];

        axiosInstance.interceptors.request.eject(requestInterceptors[index]);
        axiosInstance.interceptors.request.eject(responseInterceptors[index]);
      }
    };
  }, [interceptRequestHandler, interceptResponseErrorHandler, token]);

  return (
    <InterceptorAxiosProvider.Provider
      value={{ axiosInstances, setToken, token }}
    >
      {children}
    </InterceptorAxiosProvider.Provider>
  );
};

const useApiProvider = () => {
  return useContext(InterceptorAxiosProvider);
};

export { ApiRequestProvider, useApiProvider };
