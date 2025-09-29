<script setup>
import { defineProps } from "vue";
const emit = defineEmits();
const { columns } = defineProps({
  columns: {
    type: Array,
    default: [],
  },
  orderBy: {
    type: String,
    default: null,
  },
  sort_order: {
    type: String,
    default: "asc",
  },
});
</script>
<template>
  <thead class="align-middle">
    <tr class="text-info bg-soft-info">
      <th
        v-for="column in columns"
        :key="column.name"
        @click="(e) => (column.sortable ? emit('reorder', column) : null)"
        :class="{
          sorting: column.sortable,
          ['sorting_asc']:
            column.sortable && orderBy === column.name && sort_order === 'ASC',
          ['sorting_desc']:
            column.sortable && orderBy === column.name && sort_order === 'DESC',
        }"
        :style="
          'width:' +
          column.width +
          '; cursor:' +
          (column.sortable ? ' pointer;' : ' default;')
        "
        :hidden="column.hidden ? column.hidden : false"
      >
        <span>{{ column.label }}</span>
      </th>
    </tr>
  </thead>
</template>
