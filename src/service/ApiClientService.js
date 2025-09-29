import axios from 'axios'
import router from '../router'
import { format } from '@redtea/format-axios-error'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const token = localStorage.getItem("token")?.replace(/"/g, "");

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  timeout: 120000,
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // 'X-API-Key': import.meta.env.VITE_APP_KEY,
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    // if (!config.headers['X-API-Key']) {
    //   config.headers['X-API-Key'] = apiKey;
    // }
    // console.log("Request Headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const currentRoute = router.currentRoute.value?.path;
      if (currentRoute !== '/auth/login') {
        localStorage.clear();
        Swal.fire(
          'Session Invalid',
          'Sesi Anda telah berakhir atau login di perangkat lain!',
          'error'
        ).then((result) => {
          if (result.isConfirmed) {
            router.push('/auth/login');
          }
        });
      }
      return Promise.reject(error);
    }

    if (status === 403) {
      Swal.fire(
        'Back off!!!',
        "Sepertinya Anda tidak memiliki izin untuk mengakses modul ini!",
        'error'
      ).then((result) => {
        if (result.isConfirmed) {
          router.push({ name: 'internal.internals' });
        }
      });
      return Promise.reject(error);
    }

    if (status === 404) {
      router.push({ name: 'NotFound' });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
