<script setup>
import { defineProps } from "vue";

const { search, limit } = defineProps({
  limit: {
    type: Number,
    default: 10,
  },
  search: {
    type: String,
    default: "",
  },
});
const emit = defineEmits();
const selection = ["10", "25", "50", "100"];
</script>
<template>
  <div class="col-sm-12 col-md-6">
    <div class="dataTables_length">
      <span class="mx-1">Show</span>
      <select
        :value="limit"
        class="form-select form-select-sm"
        style="max-width: 80px"
        @change="(e) => emit('select', e.target.value)"
      >
        <option
          v-for="(records, index) in selection"
          :key="index"
          :value="records"
        >
          {{ records }}
        </option>
      </select>
      <span class="mx-1">entries</span>
    </div>
  </div>
  <div class="col-sm-12 col-md-6">
    <div class="dataTables_filter">
      <label>
        <span>Search:</span>
        <input
          type="search"
          class="form-control form-control-sm"
          :value="search"
          placeholder=""
          aria-controls="datatable"
          @input="(e) => emit('search', e.target.value)"
        />
      </label>
    </div>
  </div>
</template>
