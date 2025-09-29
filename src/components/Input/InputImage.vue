<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  imageUrl: {
    type: String,
    default: "",
  },
  previewImage: {
    type: String,
    default: "",
  },
  errorMessage: {
    type: String,
    default: "",
  },
  imageSize: {
    type: String,
    default: "500x500px",
  },
  imageFormat: {
    type: String,
    default: ".webp",
  },
  styleImage: {
    type: String,
    default: "image-500",
  },
});

const emit = defineEmits(["image-upload"]);

const handleImageUpload = (event) => {
  emit("image-upload", event);
};
</script>

<template>
  <div class="mb-3 text-info">
    <label for="formFile" class="form-label">Image</label>
    <div>
      <img
        :src="previewImage || imageUrl"
        alt="NO IMAGE"
        width="100%"
        class=""
        :class="styleImage"
      />
    </div>
  </div>
  <div class="mb-3">
    <label for="formFile" class="form-label text-info"
      >Change Image ({{ imageSize }} {{ imageFormat }})</label
    >
    <input
      class="form-control"
      type="file"
      id="formFile"
      @change="handleImageUpload"
    />
    <p v-if="errorMessage" class="text-danger">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.image-500 {
  width: 100%;
  height: 300px;
}

.image-42 {
  width: 42px;
  height: 42px;
}
</style>
