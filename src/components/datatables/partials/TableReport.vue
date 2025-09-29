<script setup>
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
  <table
    class="table nowrap table-bordered table-striped table-hover align-middle fs-11 text-uppercase"
  >
    <thead>
      <tr class="text-info bg-light">
        <th
          v-for="column in columns"
          :key="column.name"
          @click="(e) => (column.sortable ? emit('reorder', column) : null)"
          :class="{
            sorting: column.sortable,
            ['sorting_asc']:
              column.sortable &&
              orderBy === column.name &&
              sort_order === 'ASC',
            ['sorting_desc']:
              column.sortable &&
              orderBy === column.name &&
              sort_order === 'DESC',
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
    <tbody></tbody>
    <tfoot></tfoot>
  </table>
</template>

<style scoped></style>
