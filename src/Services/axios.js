import axios from "axios";
import { getCookie, setCookie } from "./cookie";

const BASE_URL = "https://data.qkira.com/api/"; //TODO


export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");
    config.headers = {
      ...config.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      setCookie("accessToken", "", 0);
    }
    return Promise.reject(error);
  }
);
