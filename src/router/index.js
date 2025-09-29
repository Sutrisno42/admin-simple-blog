import routes from "./routes";
import { useAuthStore } from "@/stores/auth";
import Swal from "sweetalert2";
import { createWebHistory, createRouter } from "vue-router";
// import { checkPermission, checkToken } from '@/service/AuthService'

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  // console.log("Route meta:", to.meta);
  const authStore = useAuthStore();

  // Jika halaman membutuhkan autentikasi dan tidak ada token
  if (to.meta.auth && !authStore.token) {
    Swal.fire({
      title: "Unauthorized!",
      text: "You need to log in to access this page.",
      icon: "warning",
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push({ name: "auth.login" });
      }
    });
    return;
  }

  // Jika mencoba mengakses halaman login ketika sudah terautentikasi
  if (to.name === "auth.login" && authStore.token) {
    next({ name: "dashboard" });
    return;
  }

  // Jika sudah logout, redirect ke login
  if (!authStore.token && to.meta.auth) {
    next({ name: "auth.login" });
    return;
  }

  // Cek validitas token jika berasal dari halaman utama
  // if (to.meta.auth && from.path == "/") {
  //   const tokenIsValid = await checkToken();
  //   if (!tokenIsValid) {
  //     Swal.fire({
  //       title: "Session Ended!",
  //       text: "Seems like your token has exceeded its expiry time, please login again!",
  //       icon: "warning",
  //       allowEscapeKey: false,
  //       allowOutsideClick: false
  //     }).then((event) => {
  //       if (event.isConfirmed) {
  //         authStore.reset();
  //         router.push({ name: 'login' })
  //       }
  //     });
  //     return;
  //   }
  // }

  // Cek apakah user memiliki izin untuk mengakses halaman tertentu
  // if (to.meta.permission) {
  //   const match = checkPermission(to.meta.permission)
  //   if (!match) {
  //     Swal.fire({
  //       title: "Forbidden!",
  //       text: "Seems like you don't have permission to access this module!",
  //       icon: "error",
  //       allowEscapeKey: false,
  //       allowOutsideClick: false
  //     }).then((event) => {
  //       if (event.isConfirmed) {
  //         router.push({ name: 'dashboard' })
  //       }
  //     });
  //     return;
  //   }
  // }

  next();
});

export default router;
