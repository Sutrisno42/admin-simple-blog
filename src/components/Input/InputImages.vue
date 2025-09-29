<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useField } from "vee-validate";
import { watch } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  image: {
    type: FormData,
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

const { value: imageValue, errorMessage } = useField(props.name);

const previewImage = ref("");
const emit = defineEmits(["image-upload"]);

const handleImageUpload = (event) => {
  const file = event.target.files[0];

  if (!file) {
    imageValue.value = null;
    previewImage.value = "";
    return;
  }

  imageValue.value = file;

  const objectURL = URL.createObjectURL(file);
  previewImage.value = objectURL;

  emit("image-upload", event);
};

watch(
  () => props.imageUrl,
  (newUrl) => {
    if (newUrl && !imageValue.value) {
      imageValue.value = newUrl;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="mb-3">
    <label for="formFile" class="form-label">Image</label>
    <div>
      <img
        :src="previewImage || imageUrl"
        alt="NO IMAGE"
        width="100%"
        class="text-muted"
        :class="styleImage"
      />
    </div>
  </div>
  <div class="mb-3">
    <label for="formFile" class="form-label">
      Change Image ({{ imageSize }} {{ imageFormat }})
    </label>
    <input
      class="form-control"
      :class="{ 'is-invalid': errorMessage }"
      type="file"
      id="formFile"
      accept="image/*"
      @change="handleImageUpload"
    />
    <div v-if="errorMessage" class="invalid-feedback">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.image-500 {
  width: 100%;
  height: 300px;
}
.w-300 {
  width: 300px;
}
.image-42 {
  width: 42px;
  height: 42px;
}
</style>
