import axios from "axios";
import Vue from "vue";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    if (window.localStorage.getItem("it-token")) {
      config.headers["Authorization"] =
        "Bearer " + window.localStorage.getItem("it-token");
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    if (response.headers.hasOwnProperty("jwt-new-token")) {
      window.localStorage.setItem(
        "it-token",
        response.headers["jwt-new-token"]
      );
    }

    return response;
  },
  function(error) {
    // Do something with response error
    const code = error.response.status; // some trick
    if (code === 401) {
      // todo logout
      // store.commit("setLogout");
    } else if (code === 304) {
      return Promise.reject(error);
    }
    //Vue.prototype.$message.error("通信失败，请检查网络");
    // return Promise.reject(error);
  }
);

export default _axios;
