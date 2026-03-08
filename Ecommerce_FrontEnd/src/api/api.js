import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 400;
  },
});

export default api;
