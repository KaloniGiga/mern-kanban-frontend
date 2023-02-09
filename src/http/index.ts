import axios from "axios";
import { store } from "../redux/app/store";

import { useDispatch } from "react-redux";
import { logOutUser, setAccessToken } from "../redux/features/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    if (
      config.headers["Authorization"] &&
      config.headers["Authorization"].includes("Client-ID")
    ) {
      console.log(config.headers["Authorization"]);
      return config;
    }

    config.headers["Authorization"] =
      "Bearer " + store.getState().auth.accessToken;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

let isRefreshing = false;

let queryList: any[] = [];

const processQueryList = (error: any, token: null) => {
  queryList.forEach((query) => {
    if (error) {
      query.reject(error);
    } else {
      query.resolve(token);
    }
  });

  queryList = [];
};

axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },

  async (error) => {
    const originalRequest = error.config;

    //if refresh request fails.
    if (
      error.response.status === 401 &&
      originalRequest.url.includes("refresh")
    ) {
      store.dispatch(logOutUser());
    }

    //if retry request also falis
    if (error.response.status === 401 && originalRequest._retry) {
      return store.dispatch(logOutUser());
    }

    if (
      error.response.status === 401 &&
      !originalRequest.url.includes("login") &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          queryList.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        axiosInstance
          .post(`${import.meta.env.VITE_BASE_URL}/refresh`, {
            refreshToken: store.getState().auth.refreshToken,
          })
          .then((response) => {
            const { accessToken } = response.data.accessToken;

            store.dispatch(setAccessToken(accessToken));

            processQueryList(null, accessToken);
            resolve(axiosInstance(originalRequest));
          })
          .catch((error) => {
            processQueryList(error, null);
            reject(error);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
