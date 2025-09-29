<script setup>
import { ref, watch } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  name: { type: String, required: true },
  placeholder: { type: String, default: "Type and press enter..." },
  modelValue: { type: Array, default: () => [] },
});

const { value, errorMessage, setValue } = useField(
  () => props.name,
  undefined,
  { initialValue: [] }
);

watch(
  () => props.modelValue,
  (newVal) => setValue(newVal),
  { immediate: true }
);

const newTag = ref("");

const addTag = () => {
  const val = newTag.value.trim();
  if (val && !value.value.includes(val)) {
    setValue([...value.value, val]);
  }
  newTag.value = "";
};

const removeTag = (index) => {
  const updated = [...value.value];
  updated.splice(index, 1);
  setValue(updated);
};

const checkComma = (e) => {
  if (e.key === ",") {
    e.preventDefault();
    addTag();
  }
};
</script>

<template>
  <div class="mb-3">
    <label class="form-label text-info" :for="props.name">
      Tags <code>optional</code>
    </label>

    <div class="choices bg-light">
      <!-- hidden input untuk submit ke backend -->
      <input type="hidden" :name="props.name" :value="value.join(',')" />

      <div class="choices__inner bg-light p-2 rounded border">
        <!-- daftar tags -->
        <div class="choices__list choices__list--multiple mb-2">
          <span
            v-for="(tag, index) in value"
            :key="index"
            class="badge bg-primary me-1 d-inline-flex align-items-center"
          >
            {{ tag }}
            <button
              type="button"
              class="btn-close btn-sm ms-2"
              @click="removeTag(index)"
            >
              <i class="las la-trash-alt"></i>
            </button>
          </span>
        </div>

        <!-- input untuk menambahkan tag -->
        <input
          type="text"
          class="form-control border-0 p-0 shadow-none choices__input choices__input--cloned"
          v-model="newTag"
          @keydown.enter.prevent="addTag"
          @keydown.space.prevent="addTag"
          @keydown="checkComma"
          :placeholder="props.placeholder"
          autocomplete="off"
        />
      </div>
    </div>

    <small v-if="errorMessage" class="text-danger">{{ errorMessage }}</small>
  </div>
</template>

<style scoped>
.choices__inner {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.choices__list--multiple {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  font-size: 14px;
}

.badge .btn-close {
  width: 14px;
  height: 14px;
  padding: 0;
  background: none;
  border: none;
  font-size: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
