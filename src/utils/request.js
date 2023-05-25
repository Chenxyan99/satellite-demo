import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.put["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.get["Content-Type"] =
  "application/x-www-form-urlencoded;charset=utf-8";

// create an axios instance
const service = axios.create({
  baseURL: window.location.href, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 200000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {

    return config;
  },
  error => {

    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(

  response => {
    const res = response.data;

    return res;
  },
);

export default service;
