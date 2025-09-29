<script setup>
import simplebar from "simplebar-vue";
import { useField } from "vee-validate";
import { computed, watch } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: "Categories" },
  categories: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, meta, setValue } = useField(
  props.name,
  (val) => {
    if (!val || val.length === 0) {
      return "Minimal pilih 1 kategori";
    }
    return true;
  },
  { initialValue: props.modelValue }
);

watch(
  () => props.modelValue,
  (val) => {
    setValue(val);
  },
  { immediate: true }
);

watch(value, (val) => {
  emit("update:modelValue", val);
});

const hasError = computed(() => !!errorMessage.value && meta.touched);
</script>

<template>
  <div>
    <label class="form-label">{{ label }}</label>
    <div id="scrollbar">
      <div class="wrapper">
        <simplebar class="test" data-simplebar-auto-hide="false">
          <div v-for="category in categories" :key="category.id" class="mb-1">
            <label class="form-check-label text-muted">
              <input
                class="form-check-input me-2"
                type="checkbox"
                :value="category.id"
                v-model="value"
              />
              {{ category.name }}
            </label>
          </div>
        </simplebar>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="hasError" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>
  </div>
</template>
