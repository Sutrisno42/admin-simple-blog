<script setup>
import { defineProps, ref, watch, defineEmits, computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  titleClass: { type: String, default: "" },
  size: { type: String, required: false },
  noFooter: { type: Boolean, default: false },
  noHeader: { type: Boolean, default: false },
  noClose: { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
  bodyClass: { type: String, default: "" },
  positionClass: { type: String, default: "" },
});

const emit = defineEmits(["toggle"]);
const isVisible = ref(false);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      isVisible.value = true;
    } else {
      setTimeout(() => {
        isVisible.value = false;
      }, 300);
    }
  },
  { immediate: true }
);

const modalSizeClass = computed(() => {
  const sizes = {
    sm: "modal-sm",
    md: "",
    lg: "modal-lg",
    xl: "modal-xl",
  };
  return sizes[props.size] || "";
});

const closeModal = () => {
  emit("toggle", false);
};
</script>

<template>
  <div
    v-if="isVisible"
    class="modal fade fadeInDown"
    :class="{ show: modelValue }"
    tabindex="-1"
    @click="closeModal"
  >
    <div
      class="modal-backdrop fade backdrop"
      :class="{ show: modelValue }"
    ></div>
    <div
      :class="['modal-dialog', modalSizeClass, props.positionClass]"
      @click.stop
    >
      <div class="modal-content">
        <div
          v-if="!noHeader"
          class="modal-header border-bottom border-bottom-dashed"
        >
          <h5 :class="['modal-title', titleClass]">{{ title }}</h5>
          <button
            v-if="!noClose"
            type="button"
            class="btn-close"
            @click="closeModal"
          ></button>
        </div>

        <div class="modal-body" :class="bodyClass">
          <slot name="modalBody" />
        </div>

        <slot name="customFooter" />

        <div
          v-if="!noFooter"
          class="modal-footer border-top border-top-dashed pt-3"
        >
          <slot name="modalFooter" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: block;
  z-index: 1055;
}
.backdrop {
  z-index: -100;
}
</style>
