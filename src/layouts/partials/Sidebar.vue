<script setup>
import { useLayoutStore } from "@/stores/layout";
import Menu from "./Menu.vue";
import simplebar from "simplebar-vue";

const layoutStore = useLayoutStore();

function initActiveMenu() {
  if (layoutStore.layoutValue.sidebarSize === "sm-hover") {
    localStorage.setItem("hoverd", true);
    layoutStore.changeSidebarSize("sm-hover-active");
  } else if (layoutStore.layoutValue.sidebarSize === "sm-hover-active") {
    localStorage.setItem("hoverd", false);
    layoutStore.changeSidebarSize("sm-hover");
  } else {
    layoutStore.changeSidebarSize("sm-hover");
  }
}
</script>
<template>
  <div class="app-menu navbar-menu">
    <div class="navbar-brand-box">
      <router-link :to="{ name: 'dashboard' }" class="logo logo-dark">
        <span class="logo-sm">
          <img src="@/assets/images/logo-naisly.webp" alt="" height="25" />
        </span>
        <span class="logo-lg">
          <img src="@/assets/images/logo-naisly.webp" alt="" height="50" />
        </span>
      </router-link>
      <router-link :to="{ name: 'dashboard' }" class="logo logo-light">
        <span class="logo-sm">
          <img src="@/assets/images/logo-naisly.webp" alt="" height="25" />
        </span>
        <span class="logo-lg text-white text-uppercase fw-semibold">
          <img src="@/assets/images/logo-naisly.webp" alt="" height="50" />
        </span>
        <!-- <span class="text-white text-uppercase fw-semibold">
                        <img src="@/assets/images/bagonk_1.png" alt="" height="17" />
                         Bagonk
                    </span> -->
      </router-link>
      <button
        type="button"
        class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
        id="vertical-hover"
        @click="initActiveMenu"
      >
        <i class="ri-record-circle-line"></i>
      </button>
    </div>

    <simplebar id="scrollbar" class="h-100" ref="scrollbar">
      <Menu />
    </simplebar>

    <div class="sidebar-background"></div>
  </div>
  <div class="vertical-overlay" id="overlay"></div>
</template>
