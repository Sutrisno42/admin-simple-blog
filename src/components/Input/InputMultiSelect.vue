<script setup>
import { useField } from "vee-validate";
import Multiselect from "@vueform/multiselect";
import { watch } from "vue";

const props = defineProps({
  modelValue: [String, Number, Array, Object, null],
  name: { type: String, required: true },
  options: { type: Array, required: true },
  fieldLabel: { type: String, default: "" },
  label: { type: String, default: "label" },
  valueProp: { type: String, default: "value" },
  placeholder: { type: String, default: "Select option" },
  searchable: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, handleBlur, meta, setValue } = useField(
  () => props.name
);

watch(
  () => props.modelValue,
  (val) => setValue(val),
  { immediate: true }
);

const updateValue = (val) => {
  emit("update:modelValue", val);
  setValue(val);
};
</script>

<template>
  <div>
    <label v-if="fieldLabel">{{ fieldLabel }}</label>

    <Multiselect
      v-model="value"
      :options="props.options"
      :label="props.label"
      :valueProp="props.valueProp"
      :searchable="props.searchable"
      :placeholder="props.placeholder"
      @blur="handleBlur"
      @update:modelValue="updateValue"
      :class="['multiselect', { 'is-invalid': meta.touched && errorMessage }]"
    />

    <div v-if="meta.touched && errorMessage" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style>
.multiselect.is-invalid {
  border-radius: 0.375rem;
  border: 1px solid #dc3545 !important;
}
</style>
