<script setup>
import { onClickOutside } from "@vueuse/core";
import { ref, Transition } from "vue";
const emit = defineEmits();
const element = ref(null);
const { isOpen, title } = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Off Canvas",
  },
});
onClickOutside(element, () => emit("close"));
</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen" class="overlay">
      <div
        :class="{ show: isOpen }"
        class="offcanvas offcanvas-end border-0"
        data-bs-backdrop="true"
        tabindex="-1"
        ref="element"
      >
        <div class="offcanvas-header bg-primary">
          <h5 class="text-white">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            @click="() => emit('close')"
          ></button>
        </div>
        <div class="offcanvas-body">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Animasi masuk dan keluar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Overlay efek */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1050;
}
</style>
