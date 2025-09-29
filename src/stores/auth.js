import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // ApiKey: useStorage('ApiKey', null, undefined, {
    //   serializer: {
    //     read: (v) => (v ? JSON.parse(v) : null),
    //     write: (v) => JSON.stringify(v),
    //   }
    // }),
    token: useStorage('token', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v),
      },
    }),
    refresh_token: useStorage('refresh_token', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v),
      },
    }),
    user: useStorage('user', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v),
      },
    }),
    // permission: useStorage('permission', null, undefined, {
    //   serializer: {
    //     read: (v) => (v ? JSON.parse(v) : null),
    //     write: (v) => JSON.stringify(v),
    //   },
    // }),
    loading: false,
    // error: null,
  }),
  actions: {
    reset() {
      localStorage.clear();
      sessionStorage.clear();
      // this.ApiKey = null,
      this.token = null;
      this.refresh_token = null;
      this.user = null;
      // this.permission = null;
      this.loading = false;
      this.error = null;
    },
  },
})
