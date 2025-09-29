<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import apiHealthygrain from "@/service/ApiHealthygrainService";

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const client_id = urlParams.get("client_id");

  if (code) {
    try {
      const payload = {
        code: code,
        client_id: client_id,
      };

      const data = await apiHealthygrain.post("/oauth-client/token", payload);
      const user = data.result;
      const filtered = user?.privileges?.filter(
        (p) => p.privilege.type === "healthygrain"
      );

      authStore.permission = filtered;
      authStore.access_token = user.access_token;
      authStore.refresh_token = user.refreshToken;
      authStore.user = user.user;

      router.push("/dashboard");
    } catch (error) {
      const message = error.response.data.message;
      Swal.fire({
        title: "Warning",
        text: message,
        icon: "warning",
        allowEscapeKey: false,
        allowOutsideClick: false,
      }).then((event) => {
        if (event.isConfirmed) {
          Cookies.remove("access_token");
          router.push({ name: "auth.login" });
        }
      });
      return;
    }
  } else {
    router.push("/auth/login");
  }
});
</script>

<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p class="loading-text">Logging you in...</p>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
  color: #000000;
  font-family: "Inter", sans-serif;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.08);
  border-top-color: #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
}

.loading-text {
  margin-top: 20px;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); /* lebih halus */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
