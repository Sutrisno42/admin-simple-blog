import responseHandler from '@/handler/responseHandler';
import router from '@/router';
import axios from 'axios'
import { useAuthStore } from '@/stores/auth';
import { useStorage } from '@vueuse/core';
import permissions from '@/config/Permission.json';

const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;
const apiKey = import.meta.env.VITE_APP_KEY

const Axios = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  timeout: 120000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

Axios.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  // if (authStore.apiKey) {
  //   config.headers['X-API-Key'] = authStore.apiKey;
  // }
  return config;
}, (error) => {
  return Promise.reject(error);
});


Axios.interceptors.response.use(
  (response) => {
    return response
  })

async function attemtLogin(form) {
  try {
    const authStore = useAuthStore();
    const response = await Axios.post(`${baseUrl}/auth/login`, form);
    console.log('Response dari server:', response);

    const { data } = response;
    console.log('Data dari server:', data);

    if (!data || !data.data || !data.data.token) {
      console.error('🚨 Login gagal: Token tidak diterima dari server');
      console.log('Data structure received:', data);
      return;
    }

    // Set token and user data to store
    authStore.token = data.data.token;
    authStore.user = data.data.user;

    // Store permissions
    useStorage('permissions', permissions);

    console.log('✅ Login berhasil!', { user: data.data.user, token: data.data.token });
    router.push({ name: 'dashboard' });
  } catch (e) {
    console.error("🚨 Error saat login:", e);
    return responseHandler(e);
  }
}

async function attemtLogout() {
  const authStore = useAuthStore();
  authStore.reset();
  router.push({ name: 'auth.login' })
}

function checkAuth() {
  const authStore = useAuthStore();
  if (authStore.token) {
    return true;
  }
  return false
}
export { attemtLogin, attemtLogout, checkAuth }
