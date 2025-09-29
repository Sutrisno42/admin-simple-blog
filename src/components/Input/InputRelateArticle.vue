<script setup>
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
});

const textareaRef = ref(null);
const isCopied = ref(false);

const copyToClipboard = () => {
  if (textareaRef.value) {
    navigator.clipboard.writeText(textareaRef.value.value).then(() => {
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000); // Reset setelah 2 detik
    });
  }
};
</script>

<template>
  <div class="fs-13">{{ title }}</div>
  <div class="mb-2 mt-2">
    <textarea
      ref="textareaRef"
      disabled
      class="form-control fs-11 bg-light"
      :value="content"
      :style="{ height: '120px' }"
    ></textarea>
  </div>
  <div class="d-flex align-items-center gap-2">
    <button class="btn btn-sm btn-info d-flex align-items-center gap-2" @click="copyToClipboard">
      <i class="las la-copy" style="font-size: 14px"></i>
      Copy
    </button>
    <span v-if="isCopied" class="text-success">
      <i class="ri-check-line align-middle me-1"></i>
      Copied
    </span>
  </div>
</template>

<style scoped></style>
