<script setup>
import { useField } from "vee-validate";
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { watch } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  modelValue: { type: [String, Date], default: "" },
  label: { type: String, default: "" },
  config: { type: Object, default: () => ({}) },
  placeholder: { type: String, default: "Pilih tanggal & waktu" },
  isOptional: { type: Boolean, default: false },
});

const { value, errorMessage, meta, setValue } = useField(props.name);

watch(
  () => props.modelValue,
  (val) => {
    setValue(val);
  },
  { immediate: true }
);
</script>

<template>
  <div class="mb-3">
    <label v-if="label" class="form-label"
      >{{ label }} <code v-if="isOptional">optional</code></label
    >
    <FlatPickr
      v-model="value"
      :config="config"
      :placeholder="placeholder"
      @on-change="(selectedDates) => (date = selectedDates[0])"
      class="form-control bg-light"
      :class="{ 'is-invalid': meta.touched && errorMessage }"
    />
    <div v-if="meta.touched && errorMessage" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}
</style>
