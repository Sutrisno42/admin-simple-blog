<script setup>
import { useField } from "vee-validate";
import { watch } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  rows: { type: Number, default: 4 },
  placeholder: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, handleBlur, meta, setValue } = useField(
  () => props.name
);

watch(
  () => props.modelValue,
  (val) => {
    setValue(val);
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
    <label v-if="label" class="form-label">{{ label }}</label>
    <textarea
      class="fs-13 w-100 border rounded p-2 outline-none bg-light"
      :rows="rows"
      :placeholder="placeholder"
      :class="{ 'is-invalid': meta.touched && errorMessage }"
      v-model="value"
      @input="updateValue($event.target.value)"
      @blur="handleBlur"
    ></textarea>

    <div v-if="meta.touched && errorMessage" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.is-invalid {
  border-color: #dc3545 !important;
}

.outline-none {
    outline: none;
}
</style>
