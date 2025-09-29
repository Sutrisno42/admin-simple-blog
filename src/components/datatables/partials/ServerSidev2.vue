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
    sort_by: {
      type: String,
      default: null,
    },
    sort_order: {
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
const loading = ref(false);
const search = ref(null);
const tableData = ref([]);
const pagination = reactive({
  currentPage: 1,
  limit: 10,
  from: 0,
  to: 0,
  total: 0,
  navLinks: {},
  links: [],
  prevPageUrl: null,
  nextPageUrl: null,
  firstPageUrl: null,
  lastPageUrl: null,
});
function sortBy(column) {
  if (props.filters.sort_by != column.name) {
    props.filters.sort_by = column.name;
    props.filters.sort_order = "ASC";
  } else {
    if (props.filters.sort_order == "ASC") {
      props.filters.sort_order = "DESC";
    } else {
      props.filters.sort_order = "ASC";
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
  if (!response?.result) {
    // console.error("Invalid response format:", response);
    tableData.value = [];
    return;
  }

  const result = response.result;
  const paginationData = result.pagination || {};
  pagination.currentPage = paginationData.currentPage ?? 1;
  pagination.limit = paginationData.limit ?? 10;
  pagination.from = paginationData.from ?? 0;
  pagination.to = paginationData.to ?? 0;
  pagination.total = paginationData.total ?? 0;
  pagination.prevPageUrl = paginationData.prevPageUrl ?? null;
  pagination.nextPageUrl = paginationData.nextPageUrl ?? null;
  pagination.firstPageUrl = paginationData.firstPageUrl ?? null;
  pagination.lastPageUrl = paginationData.lastPageUrl ?? null;

  pagination.links = [];

  const totalPages = Math.ceil(paginationData.total / paginationData.limit);
  const currentPage = pagination.currentPage;

  // Tombol Previous
  if (paginationData.prevPageUrl) {
    pagination.links.push({
      label: "<",
      url: paginationData.prevPageUrl,
      active: false,
    });
  }

  // Tambahkan halaman pertama
  pagination.links.push({
    label: "1",
    url: `${paginationData.firstPageUrl.split("?")[0]}?page=1&limit=${
      paginationData.limit
    }`,
    active: currentPage === 1,
  });

  // Tambahkan titik (...) jika halaman lebih dari 5 dan user tidak berada di halaman awal
  if (totalPages > 5 && currentPage > 3) {
    pagination.links.push({
      label: "...",
      url: null,
      active: false,
    });
  }

  // Tambahkan 3 halaman sebelum dan sesudah halaman aktif
  const startPage = Math.max(2, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pagination.links.push({
      label: `${i}`,
      url: `${paginationData.firstPageUrl.split("?")[0]}?page=${i}&limit=${
        paginationData.limit
      }`,
      active: i === currentPage,
    });
  }

  // Tambahkan titik (...) jika halaman lebih dari 5 dan user tidak berada di halaman akhir
  if (totalPages > 5 && currentPage < totalPages - 2) {
    pagination.links.push({
      label: "...",
      url: null,
      active: false,
    });
  }

  // Tambahkan halaman terakhir jika lebih dari 1 halaman
  if (totalPages > 1) {
    pagination.links.push({
      label: `${totalPages}`,
      url: `${
        paginationData.firstPageUrl.split("?")[0]
      }?page=${totalPages}&limit=${paginationData.limit}`,
      active: currentPage === totalPages,
    });
  }

  // Tombol Next
  if (paginationData.nextPageUrl) {
    pagination.links.push({
      label: ">",
      url: paginationData.nextPageUrl,
      active: false,
    });
  }

  tableData.value = result.data ?? [];
}
function goToPage(url) {
  if (!url) return;

  const urlObj = new URL(url, window.location.origin);
  const pageParam = urlObj.searchParams.get("page");

  if (pageParam) {
    props.filters.page = Number(pageParam);
  }
}

async function fetch(queryString = null) {
  try {
    loading.value = true;

    let fetchUri = uri.value;
    if (queryString) {
      fetchUri = uri.value.includes("?")
        ? `${uri.value}&${queryString}`
        : `${uri.value}?${queryString}`;
    }

    const response = await apiClient.get(fetchUri);

    if (!response || !response.result) {
      return;
    }

    transform(response);
  } catch (exception) {
    console.error("Exception caught:", exception);
  } finally {
    loading.value = false;
  }
}

function fetchFilters() {
  loading.value = true;
  tableData.value = [];

  const cleanedFilters = Object.fromEntries(
    Object.entries(props.filters).filter(([_, value]) => value !== null)
  );
  const queryString = new URLSearchParams(cleanedFilters).toString();
  console.log(queryString);
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
        :limit="filters.limit"
        :search="search"
        @select="
          (e) => {
            if (e > 5) {
              filters.limit = e;
            } else {
              filter.limit = 10;
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
            :orderBy="props.filters?.sort_by ?? 'id'"
            :sort="props.filters?.sort_order ?? 'ASC'"
            @reorder="(e) => sortBy(e)"
          />
          <tbody>
            <tr v-if="loading">
              <td :colspan="columns.length" align="center" class="py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>

            <td
              v-else-if="tableData?.length == 0"
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
                type="button"
                aria-controls="datatable"
                data-dt-idx="1"
                tabindex="0"
                class="page-link"
                :class="{ disabled: !link.url }"
                v-html="'<'"
                @click="goToPage(link.url)"
              />
              <button
                v-else-if="link.label.includes('Next')"
                type="button"
                aria-controls="datatable"
                data-dt-idx="1"
                tabindex="0"
                class="page-link"
                :class="{ disabled: !link.url }"
                v-html="'>'"
                @click="goToPage(link.url)"
              />
              <button
                v-else
                type="button"
                aria-controls="datatable"
                data-dt-idx="1"
                tabindex="0"
                class="page-link"
                v-html="link.label"
                :class="{ disabled: !link.url }"
                @click="goToPage(link.url)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
