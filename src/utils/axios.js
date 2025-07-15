import axios from "axios";
import { storeToRefs } from "pinia";
import { createPinia } from 'pinia';
import { useAuthStore } from "../stores/auth";

const pinia = createPinia();
const instance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(pinia);
    const { token } = storeToRefs(authStore);

    // const token = localStorage.getItem('token')
    if(token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
