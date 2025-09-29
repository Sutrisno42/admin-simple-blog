<script setup>
import i18n from "@/i18n";
import { useLayoutStore } from "@/stores/layout";
import { onMounted, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { attemtLogout } from "@/service/AuthService";

const layoutStore = useLayoutStore();
const authStore = useAuthStore();
const { changeMode } = layoutStore;
const data = reactive({
  lan: i18n.locale,
  text: null,
  flag: null,
  myVar: 1,
  fullname: authStore.user?.fullname ?? null,
  username: authStore.user?.username ?? null,
  image: authStore.user?.image_url ?? null,
  role: authStore.user?.role ?? null,
  options: [],
});
onMounted(() => {
  let mode = document.documentElement.getAttribute("data-sidebar");
  const existingStyle = document.head.querySelector("style[data-custom-style]");
  if (existingStyle) {
    existingStyle.remove();
  }
  if (mode === "dark") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    const styleDark = document.createElement("style");
    styleDark.setAttribute("data-custom-style", "");
    styleDark.textContent = `
          .style-chooserup .vs__selected {
            color: #ced4da;
          }
          .style-chooserup .vs__dropdown-menu {
            background-color: #282b2e;
            color: #ced4da;
          }
          .style-chooser .vs__selected {
            color: #ced4da;
          }
          .style-chooser .vs__dropdown-menu {
            background-color: #282b2e;
            color: #ced4da;
            font-size: 11px;
          }
        `;
    document.head.appendChild(styleDark);
  } else {
    const styleLight = document.createElement("style");
    styleLight.setAttribute("data-custom-style", "");
    styleLight.textContent = `
          .style-chooserup .vs__selected {
            color: #000;
          }
          .style-chooserup .vs__dropdown-menu {
            color: #000;
          }
          .style-chooser .vs__selected {
            color: #000;
          }
          .style-chooser .vs__dropdown-menu {
            background-color: #f3f6f9;
            color: #3d3d3d;
            font-size: 11px;
          }
        `;
    document.head.appendChild(styleLight);
  }
  document.addEventListener("scroll", function () {
    var pageTopbar = document.getElementById("page-topbar");
    if (pageTopbar) {
      document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50
        ? pageTopbar.classList.add("topbar-shadow")
        : pageTopbar.classList.remove("topbar-shadow");
    }
  });
});
function toggleHamburgerMenu() {
  var windowSize = document.documentElement.clientWidth;
  let layoutType = layoutStore.layoutValue.layoutType;

  layoutStore.changeVisibility({ visibility: "show" });
  let visiblilityType = layoutStore.layoutValue.visibility;

  if (windowSize > 767) {
    document.querySelector(".hamburger-icon").classList.toggle("open");
  }

  //For collapse horizontal menu (unused)
  if (layoutType === "horizontal") {
    document.body.classList.contains("menu")
      ? document.body.classList.remove("menu")
      : document.body.classList.add("menu");
  }

  //For collapse vertical menu
  if (
    visiblilityType === "show" &&
    (layoutType === "vertical" || layoutType === "semibox")
  ) {
    if (windowSize < 1025 && windowSize > 767) {
      document.body.classList.remove("vertical-sidebar-enable");
      layoutStore.layoutValue.sidebarSize == "sm"
        ? layoutStore.changeSidebarSize({ sidebarSize: "lg" })
        : layoutStore.changeSidebarSize({ sidebarSize: "sm" });
    } else if (windowSize > 1025) {
      document.body.classList.remove("vertical-sidebar-enable");
      layoutStore.layoutValue.sidebarSize == "lg"
        ? layoutStore.changeSidebarSize({ sidebarSize: "sm" })
        : layoutStore.changeSidebarSize({ sidebarSize: "lg" });
    } else if (windowSize <= 767) {
      document.body.classList.add("vertical-sidebar-enable");
      layoutStore.changeSidebarSize({ sidebarSize: "lg" });
    }
  }
  //Two column menu
  if (layoutType == "twocolumn") {
    document.body.classList.contains("twocolumn-panel")
      ? document.body.classList.remove("twocolumn-panel")
      : document.body.classList.add("twocolumn-panel");
  }
}
function initFullScreen() {
  document.body.classList.toggle("fullscreen-enable");
  if (
    !document.fullscreenElement &&
    /* alternative standard method */
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement
  ) {
    // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
</script>

<template>
  <header id="page-topbar">
    <div class="layout-width">
      <div class="navbar-header">
        <div class="d-flex align-items-center gap-3">
          <!-- LOGO -->
          <div class="navbar-brand-box horizontal-logo">
            <router-link :to="{ name: 'dashboard' }" class="logo logo-dark">
              <span class="logo-sm">
                <img src="@/assets/images/logo-light.webp" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-dark.webp" alt="" height="17" />
              </span>
            </router-link>

            <router-link :to="{ name: 'dashboard' }" class="logo logo-light">
              <span class="logo-sm">
                <img src="@/assets/images/logo-dark.webp" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-light.webp" alt="" height="17" />
              </span>
            </router-link>
          </div>

          <button
            type="button"
            class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
            id="topnav-hamburger-icon"
            @click="toggleHamburgerMenu"
          >
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          
        </div>
        <div class="d-flex align-items-center">
          <div class="ms-1 header-item d-none d-sm-flex">
            <button
              type="button"
              class="btn btn-ghost-secondary btn-icon btn-topbar rounded-circle shadow-none"
              data-toggle="fullscreen"
              @click="initFullScreen"
            >
              <i class="bx bx-fullscreen fs-22"></i>
            </button>
          </div>

          <div class="ms-1 header-item">
            <button
              type="button"
              class="btn btn-ghost-secondary btn-icon btn-topbar rounded-circle light-dark-mode shadow-none"
              @click="changeMode"
            >
              <!-- @click="toggleDarkMode" -->
              <i class="bx bx-moon fs-22"></i>
            </button>
          </div>
          <div class="btn-group ms-sm-3 header-item">
            <!-- <button class="dropdown-item" @click="attemtLogout">
              <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle" data-key="t-logout">Logout</span>
            </button> -->
            <button
              id="profileButton"
              class="btn btn-md btn-link rounded-circle arrow-none shadow-none dropdown-toggle"
              aria-expanded="true"
              type="button"
              data-bs-offset="0,17"
              data-bs-toggle="dropdown"
              aria-haspopup="menu"
            >
              <span class="d-flex align-items-center">
                <img
                  v-if="data.role == 'SUPERADMIN' && data.image !== null"
                  class="rounded-circle header-profile-user"
                  :src="data.image"
                  alt="Avatar"
                />
                <img
                  v-else
                  class="rounded-circle header-profile-user"
                  src="@/assets/images/avatar-superadmin.png"
                  alt="Avatar"
                />
                <span class="text-start ms-xl-2">
                  <span
                    class="d-none d-xl-inline-block ms-1 fw-medium user-name-text"
                    >{{ data.username }}</span
                  >
                  <span class="d-none d-xl-block ms-1 fs-12 user-name-sub-text">
                    {{ data.role.name }}
                  </span>
                </span>
              </span>
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end"
              role="menu"
              aria-labelledby="profileButton"
            >
              <h6 class="dropdown-header">Hi {{ data.username }} !!!</h6>
              <button class="dropdown-item" @click="attemtLogout">
                <i
                  class="mdi mdi-logout text-muted fs-16 align-middle me-1"
                ></i>
                <span class="align-middle" data-key="t-logout">Logout</span>
              </button>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
