import { createApp } from "vue";
import { createPinia } from "pinia";

import "bootstrap/dist/js/bootstrap.bundle";
import "remixicon/fonts/remixicon.css";
import "@vueform/slider/themes/default.css";
import "@vueform/toggle/themes/default.css";
import "@vueform/multiselect/themes/default.css";
import "@/assets/scss/mermaid.min.css";
import AOS from "aos";
import VueFeather from "vue-feather";
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import "aos/dist/aos.css";
import i18n from "./i18n";
import App from "./App.vue";
import router from "./router";
import VueApexCharts from 'vue3-apexcharts'

AOS.init({
  easing: "ease-out-back",
  duration: 1000,
});

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueApexCharts)
  .use(i18n)
  .use(Particles, {
    init: async (engine) => {
      await loadSlim(engine);
    },
  })
  .component(VueFeather.type, VueFeather)
  .mount("#app");
