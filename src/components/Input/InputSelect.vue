<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="list-group-item bg-info text-white">
    <input
      class="form-check-input me-1"
      type="checkbox"
      :name="`namespace[]`"
      :value="item.value"
      :checked="modelValue"
      @change="emit('update:modelValue', $event.target.checked)"
    />
    {{ item.name }}
  </label>
</template>

<style scoped></style>
