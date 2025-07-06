import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5005" : "/"

export const axiosInstance = axios.create({
  baseURL : BASE_URL,
  withCredentials:true, // sends cookies with the request
})