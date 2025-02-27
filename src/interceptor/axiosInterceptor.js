import axios from "axios";

const SetupInterceptors = (navigate) => {
  const base_url = process.env.REACT_APP_API_URL;
  // Request interceptor
  axios.interceptors.request.use(
    async (config) => {
      config.url = `${base_url}${config.url}`;
      if (!config?.url?.includes("admin/login")) {
        const token = localStorage.getItem("token");
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      // console.log("config", config);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      // console.log("response", response);
      return response;
    },
    (error) => {
      // console.log("error", error);
      if (error?.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
};

export default SetupInterceptors;
