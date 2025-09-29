<script setup>
import { useField } from "vee-validate";
import { computed, watch } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  modelValue: { type: String, default: "" },
  isIcon: { type: Boolean },
  isOptional: { type: Boolean, default: false },
});

const { name, label, type, placeholder, modelValue, isIcon, isOptional } =
  props;

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, handleBlur, meta, setValue } = useField(name);

const hasError = computed(() => !!errorMessage.value && meta.touched);

const onInput = (e) => {
  if (type === "number") {
    // hanya angka dan titik desimal
    let sanitized = e.target.value.replace(/[^0-9.]/g, "");

    // mencegah lebih dari 1 titik desimal
    if ((sanitized.match(/\./g) || []).length > 1) {
      sanitized = sanitized.substring(0, sanitized.length - 1);
    }

    e.target.value = sanitized;
    setValue(sanitized === "" ? null : Number(sanitized));
    emit("update:modelValue", sanitized === "" ? null : Number(sanitized));
  }
};

watch(
  () => props.modelValue,
  (val) => {
    setValue(val);
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <label class="form-label"
      ><i class="las la-braille text-muted me-1" v-if="isIcon"></i>{{ label }}
      <code v-if="isOptional">optional</code></label
    >
    <input
      :type="type"
      class="form-control bg-light"
      :class="{ 'is-invalid': hasError }"
      v-model="value"
      :placeholder="placeholder"
      @blur="handleBlur"
      @input="onInput"
    />
    <div v-if="hasError" class="invalid-feedback">
      {{ errorMessage }}
    </div>
  </div>
</template>
