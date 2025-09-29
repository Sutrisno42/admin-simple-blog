<script setup>
import TableHead from "./TableHead.vue";
import { reactive, ref, watch } from "vue";
import { debounce } from "lodash";
import TableHeader from "./TableHeader.vue";
import thousandSeparator from "@/utils/thousandSeparator";
import apiClient from "@/service/ApiClientService";

const props = defineProps({
  withSearch: {
    type: Boolean,
    default: false,
  },
  fsTable: {
    type: String,
  },
  filters: {
    order_by: {
      type: String,
      default: null,
    },
    sort: {
      type: String,
      default: null,
    },
  },
  fetchRoute: {
    type: String,
    default: null,
  },
  columns: {
    type: Array,
    default: () => [],
  },
});
const uri = ref(props.fetchRoute);
const search = ref(null);
const tableData = ref([]);
const pagination = reactive({
  currentPage: 1,
  perpage: 10,
  from: 0,
  to: 0,
  total: 0,
  navLinks: {},
  links: [],
});
function sortBy(column) {
  if (props.filters.order_by != column.name) {
    props.filters.order_by = column.name;
    props.filters.sort = "asc";
  } else {
    if (props.filters.sort == "asc") {
      props.filters.sort = "desc";
    } else {
      props.filters.sort = "asc";
    }
  }
}
function removePath(path, link) {
  if (link) {
    return link.replace(path, "");
  }
  return link;
}
function transform(response) {
  if (response.meta) {
    const meta = response.meta;
    const baseString = meta.path + "?page=";
    const links = meta.links.map((lnk) => ({
      ...lnk,
      url: removePath(baseString, lnk.url),
    }));
    pagination.currentPage = meta.current_page;
    pagination.perpage = meta.per_page;
    pagination.from = meta.from;
    pagination.to = meta.to;
    pagination.total = meta.total;
    pagination.navLinks = response.links;
    pagination.links = links;
    tableData.value = response.data;
    props.filters = meta.filters;
  } else {
    const baseString = response.path + "?page=";
    const links = response.links.map((lnk) => ({
      ...lnk,
      url: removePath(baseString, lnk.url),
    }));
    pagination.currentPage = response.current_page;
    pagination.perpage = response.per_page;
    pagination.from = response.from;
    pagination.to = response.to;
    pagination.total = response.total;
    pagination.navLinks = response.links;
    pagination.links = links;
    tableData.value = response.data;
    props.filters = response.filters;
  }
}
async function fetch(queryString = null) {
  try {
    let fetchUri = uri.value;
    if (queryString) {
      fetchUri = uri.value.includes("?")
        ? `${uri.value}&${queryString}`
        : `${uri.value}?${queryString}`;
    }
    const response = await apiClient.get(fetchUri);
    transform(response);
  } catch (exception) {
    console.info("exception caught", exception);
  }
}
function fetchFilters() {
  const cleanedFilters = Object.fromEntries(
    Object.entries(props.filters).filter(([_, value]) => value !== null)
  );
  const queryString = new URLSearchParams(cleanedFilters).toString();
  fetch(queryString);
}
const debouncedFetch = debounce(() => {
  props.filters.search = search.value;
}, 500);

watch(
  () => search.value,
  (newSearch, oldSearch) => {
    debouncedFetch();
  }
);
watch(
  () => props.filters,
  (newFilters, oldFilters) => {
    fetchFilters();
  },
  { deep: true }
);
defineExpose({
  fetch,
});
</script>
<template>
  <div class="dataTables_wrapper dt-bootstrap5 no-footer">
    <div class="row fs-11 text-muted" v-if="props.withSearch">
      <TableHeader
        :perpage="filters.perpage"
        :search="search"
        @select="
          (e) => {
            if (e > 5) {
              filters.perpage = e;
            } else {
              filter.perpage = 10;
            }
          }
        "
        @search="(e) => (search = e)"
      />
    </div>
    <div class="row">
      <div style="overflow-x: auto; overflow-y: hidden">
        <table
          id="datatable"
          :class="'table table-bordered table-hover align-middle text-nowrap dt-responsive dataTable no-footer fs-11 text-uppercase'"
          style="width: 100%"
        >
          <TableHead
            :columns="columns"
            :orderBy="props.filters?.order_by ?? 'id'"
            :sort="props.filters?.sort ?? 'asc'"
            @reorder="(e) => sortBy(e)"
          />
          <tbody>
            <td
              v-if="tableData.length == 0"
              :colspan="columns.length"
              align="center"
              class="py-5"
            >
              <span class="text-uppercase fw-semibold text-info">
                No matching records found
              </span>
            </td>
            <slot name="tableBody" :rows="tableData">
              <tr v-for="row in tableData" :key="row.id">
                <td v-for="column in columns" :key="column.name" align="center">
                  <div :class="column.class">
                    {{ row[column.name] }}
                  </div>
                </td>
              </tr>
            </slot>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-5 text-muted text-uppercase fs-11">
        <div class="dataTables_info">
          Showing {{ thousandSeparator(pagination.from) }} to
          {{ thousandSeparator(pagination.to) }} of
          {{ thousandSeparator(pagination.total) }} entries
        </div>
      </div>
      <div class="col-sm-12 col-md-7">
        <div
          class="dataTables_paginate paging_simple_numbers"
          id="datatable_paginate"
        >
          <ul class="pagination">
            <li
              v-for="(link, index) in pagination.links"
              :key="index"
              class="paginate_button page-item"
              :class="{ active: link.active }"
            >
              <button
                v-if="link.label.includes('Previous')"
                :href="link.url"
                type="button"
                aria-controls="datatable"
                data-dt-idx="1"
                tabindex="0"
                class="page-link"
                :class="{ disabled: !link.url }"
                v-html="'&laquo'"
                @click="() => (props.filters.page = link.url)"
              />
              <button
                v-else-if="link.label.includes('Next')"
                :href="link.url"
                type="button"
                aria-controls="datatable"
                data-dt-idx="1"
                tabindex="0"
                class="page-link"
                :class="{ disabled: !link.url }"
                v-html="'&raquo'"
                @click="() => (props.filters.page = link.url)"
              />
              <button
                v-else
                :href="link.url"
                v-html="link.label"
                type="button"
                aria-controls="datatable"
                data-dt-idx="1"
                tabindex="0"
                class="page-link"
                :class="{ disabled: !link.url }"
                @click="() => (props.filters.page = link.url)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
