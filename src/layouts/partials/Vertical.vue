<script setup>
import router from "@/router";
import { useLayoutStore } from "../../stores/layout";

import Navbar from "./Navbar.vue";
import Rightbar from "./Rightbar.vue";
import Footer from "./Footer.vue";
import { onUnmounted, provide, ref } from "vue";
import { onMounted } from "vue";
import Sidebar from "./Sidebar.vue";

localStorage.setItem("hoverd", false);
const layoutStore = useLayoutStore();
const isMenuCondensed = ref(false);

document.body.removeAttribute("data-layout", "horizontal");
document.body.removeAttribute("data-topbar", "dark");
document.body.removeAttribute("data-layout-size", "boxed");

function updateSidebarSize() {
  // Check window.screen.width and update the data-sidebar-size attribute
  if (window.screen.width < 1025) {
    layoutStore.changeSidebarSize("sm");
  } else {
    layoutStore.changeSidebarSize("lg"); // Reset sidebarSize if screen width is >= 1025
  }
}

function toggleMenu() {
  document.body.classList.toggle("sidebar-enable");
  if (window.screen.width >= 992) {
    // eslint-disable-next-line no-unused-vars
    router.afterEach((routeTo, routeFrom) => {
      document.body.classList.remove("sidebar-enable");
      document.body.classList.remove("vertical-collpsed");
    });
    document.body.classList.toggle("vertical-collpsed");
  } else {
    // eslint-disable-next-line no-unused-vars
    router.afterEach((routeTo, routeFrom) => {
      document.body.classList.remove("sidebar-enable");
    });
    document.body.classList.remove("vertical-collpsed");
  }
  isMenuCondensed.value = !isMenuCondensed.value;
}
function toggleRightSidebar() {
  document.body.classList.toggle("right-bar-enabled");
}
function hideRightSidebar() {
  document.body.classList.remove("right-bar-enabled");
}
provide("toggleMenu", toggleMenu);
provide("toggleRightSidebar", toggleRightSidebar);
provide("hideRightSidebar", hideRightSidebar);
onMounted(() => {
  if (localStorage.getItem("hoverd") == "true") {
    layoutStore.changeSidebarSize("sm-hover-active");
  }
  document.getElementById("overlay").addEventListener("click", () => {
    document.body.classList.remove("vertical-sidebar-enable");
  });
  if (window.screen.width < 1025 && window.screen.width > 767) {
    layoutStore.changeSidebarSize("sm");
  }

  window.addEventListener("resize", () => {
    document.body.classList.remove("vertical-sidebar-enable");
    if (window.screen.width < 767) {
      document.querySelector(".hamburger-icon").classList.add("open");
    }
    if (window.screen.width < 1025 && window.screen.width > 767) {
      document.querySelector(".hamburger-icon").classList.remove("open");
    }
    // updateSidebarSize()
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", updateSidebarSize);
});
</script>

<template>
  <div id="layout-wrapper">
    <Navbar />
    <Sidebar />
    <div id="mainContent">
      <div class="main-content">
        <div class="page-content">
          <div class="container-fluid">
            <slot />
          </div>
        </div>
        <Footer />
      </div>
    </div>
    <Rightbar />
  </div>
</template>
