<script setup>
import { useField } from "vee-validate";
import { watch } from "vue";
import Ckeditor from "../Ckeditor.vue";

const props = defineProps({
  name: { type: String, required: true },
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "Tulis konten di sini..." },
  isOptional: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, handleBlur, meta, setValue } = useField(
  () => props.name
);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== value.value) {
      setValue(val);
    }
  },
  { immediate: true }
);

const updateValue = (val) => {
  emit("update:modelValue", val);
  setValue(val);
};
</script>

<template>
  <div class="mb-3">
    <label v-if="label" class="form-label"
      >{{ label }} <code v-if="isOptional">optional</code></label
    >
    <Ckeditor
      :editor="ClassicEditor"
      v-model="value"
      :config="{ placeholder }"
      class="text-black"
      :class="{ 'is-invalid': meta.touched && errorMessage }"
      @blur="handleBlur"
      @input="updateValue($event)"
    />
    <div v-if="meta.touched && errorMessage" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.is-invalid {
  border: 1px solid #dc3545 !important;
  border-radius: 4px;
}
</style>
