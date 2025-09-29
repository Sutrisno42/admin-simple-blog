<script setup>
import { reactive, computed, ref, onMounted } from "vue";
import thousandSeparator from "@/utils/thousandSeparator";
import {
  statusBadgeColor,
  statusBadgeLabel,
  statusMetaColor,
} from "@/utils/badgeStatus";
import { formatDefaultDate } from "@/utils/formatDate";
import { getAvatar } from "@/utils/assetsHelper";
const props = defineProps({
  url: {
    type: String,
    default: "",
  },
  fetchReload: {
    type: Boolean,
    default: false,
  },
  headerClassAll: {
    type: String,
    default: "",
  },
  table_search: {
    type: Boolean,
    default: true,
  },
  table_show: {
    type: Boolean,
    default: true,
  },
  table_pagination: {
    type: Boolean,
    default: true,
  },
  table_class: {
    type: String,
    default: "",
  },
  group: {
    type: Boolean,
    default: false,
  },
  sortBy: {
    type: String,
    default: "",
  },
  order: {
    type: Number,
    default: 1,
  },
  page_size: {
    type: Number,
    default: 10,
  },
  dataTable: {
    type: Array,
    default: () => [],
  },
  column: {
    type: Array,
    default: () => [],
  },
  headerGroup: {
    type: Array,
    default: () => [],
  },
  customRow: {
    type: Object,
  },
});
const state = reactive({
  items: props.dataTable,
  columns: props.column,
  groupHeader: props.headerGroup,
  filter: "",
  sortKey: props.sortBy,
  sortOrders: props.order,
  pageSize: props.page_size,
  currentPage: 1,
  pageSizeOptions: [10, 25, 50, 100],
});
const avatar = (avatar) => getAvatar(avatar);
const isDataEmpty = ref(false);
const loading = computed(() => {
  if (filteredItems.value.length === 0) {
    return true;
  } else {
    return false;
  }
});
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => {
    return current ? current[key] : null;
  }, obj);
};
const filteredItems = computed(() => {
  if (!state.filter) {
    return props.dataTable;
  }
  return props.dataTable.filter((item) => {
    return props.column.some((column) => {
      const columnName = column.name;
      if (!isColumnFilterable(columnName)) {
        return false;
      }
      const itemValue = getNestedValue(item, columnName);
      return (
        itemValue !== null &&
        String(itemValue).toLowerCase().includes(state.filter.toLowerCase())
      );
    });
  });
});
const sortedItems = computed(() => {
  const filterData = filteredItems.value;
  const sortingKey = state.sortKey;

  if (!sortingKey) {
    return filterData;
  }

  const detectDataType = (value) => {
    if (value === null || value === undefined) return "null";
    if (typeof value === "number") return "number";
    if (!isNaN(value) && !isNaN(parseFloat(value))) return "number";
    if (typeof value === "boolean") return "boolean";
    if (value instanceof Date) return "date";
    if (typeof value === "string") {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) return "date";
      return "string";
    }
    return "string";
  };

  const convertValue = (value, type) => {
    switch (type) {
      case "number":
        return parseFloat(value) || 0;
      case "date":
        return new Date(value).getTime();
      case "boolean":
        return Boolean(value);
      case "string":
        return String(value).toLowerCase();
      default:
        return value === null || value === undefined
          ? ""
          : String(value).toLowerCase();
    }
  };

  return filterData.slice().sort((a, b) => {
    let aValue = getNestedValue(a, sortingKey);
    let bValue = getNestedValue(b, sortingKey);

    const sampleValue = filterData
      .map((item) => getNestedValue(item, sortingKey))
      .find((val) => val !== null && val !== undefined);

    const dataType = detectDataType(sampleValue);

    aValue = convertValue(aValue, dataType);
    bValue = convertValue(bValue, dataType);

    if (dataType === "number" || dataType === "date") {
      return (aValue - bValue) * state.sortOrders;
    } else {
      if (aValue === bValue) return 0;
      return aValue > bValue ? state.sortOrders : -state.sortOrders;
    }
  });
});
const goToPage = (pageNumber) => {
  state.currentPage = pageNumber;
};
const prevPage = () => {
  if (state.currentPage > 1) {
    state.currentPage--;
  }
};
const nextPage = () => {
  if (state.currentPage < totalPages.value) {
    state.currentPage++;
  }
};
const totalPages = computed(() => {
  return sortedItems.value.length
    ? Math.ceil(sortedItems.value.length / state.pageSize)
    : 1;
});
const paginatedItems = computed(() => {
  const start = (state.currentPage - 1) * state.pageSize;
  const end = start + state.pageSize;
  return sortedItems.value.length ? sortedItems.value.slice(start, end) : [];
});
const pages = computed(() => {
  const pagesArray = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
});
const entriesRange = computed(() => {
  let start = 0;
  let end = 0;
  let total = 0;
  if (sortedItems.value.length) {
    start = (state.currentPage - 1) * state.pageSize + 1;
    end = Math.min(
      state.currentPage * state.pageSize,
      filteredItems.value.length
    );
    total = filteredItems.value.length;
  }
  return `${start} to ${end} of ${total}`;
});
const ellipsisPages = computed(() => {
  const visiblePages = 5; // Number of visible pages including ellipsis
  let start = state.currentPage - Math.floor(visiblePages / 2);
  start = Math.max(start, 1);
  let end = start + visiblePages - 1;
  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(end - visiblePages + 1, 1);
  }
  return {
    start,
    end,
    range: Array.from({ length: end - start + 1 }, (_, i) => start + i),
  };
});
const isColumnFilterable = (key) => {
  const column = state.columns.find((column) => column.name === key);
  return column ? column.filterable : false;
};
const getObjectValue = (obj, path, defaultValue) => {
  // Check if the path contains a separator
  if (!path.includes(".")) {
    // If no separator found, directly access the property
    return obj[path] !== undefined && obj[path] !== null
      ? obj[path]
      : defaultValue
        ? defaultValue
        : null;
  }
  // Split the path by dot
  const keys = path.split(".");

  // Initialize result with the object
  let result = obj;

  // Traverse each key in the path
  for (const key of keys) {
    if (result !== null && result !== undefined && typeof result === "object") {
      // If the key exists in the current result, update result with its value
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result = result[key];
      } else {
        // If the key doesn't exist, return undefined
        return defaultValue ? defaultValue : null;
      }
    } else {
      return defaultValue ? defaultValue : null;
    }
  }

  // Return the final result
  return result !== undefined && result !== null
    ? result
    : defaultValue
      ? defaultValue
      : null;
};
const toggleSorting = (column) => {
  if (column.sortable) {
    state.sortKey = column.name;
    state.sortOrders *= -1;
  }
};
const checkIcon = (column) => {
  if (column.sortable) {
    if (state.sortKey === column.name) {
      if (state.sortOrders === 1) {
        return "sorting sorting_asc";
      } else {
        return "sorting sorting_desc";
      }
    } else {
      return "sorting";
    }
  } else {
    return "";
  }
};
const filterRead = (data) => {
  const dataLength = data;
  if (dataLength === null) {
    return "";
  }
  return dataLength.filter((res) => res.read === true).length || "-";
};
const getDataLength = (data) => {
  const dataLength = data;
  if (dataLength === null) {
    return "";
  }
  return dataLength.length || "-";
};
const getDataLengthArray = (data) => {
  return data?.length || "-";
};
const routeBadge = (data) => {
  let routeName = data;
  if (routeName === null || routeName === undefined) {
    return "-";
  }
  return routeName.map((res) => res.route_name_prefix);
};
function lengthWords(text) {
  const words = text.length;
  return words;
}
function limitWords(text, wordLimit) {
  if (text) {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ")
      : text;
  }
  return text;
}
function truncateWords(text, wordLimit) {
  if (text) {
    const words = text.slice(0, wordLimit);
    return words;
  }
  return text;
}
const loadingState = ref(loading.value);
onMounted(() => {
  if (loading.value) {
    setTimeout(() => {
      isDataEmpty.value = true;
      loadingState.value = false;
    }, 200);
  }
});
</script>
<template>
  <div class="dataTables_wrapper dt-bootstrap5 no-footer">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_length" v-if="props.table_show">
          <label class="text-uppercase text-muted" style="font-size: 11px">
            Show
            <select v-model="state.pageSize" id="pageSize" aria-controls="datatable"
              class="form-select form-select-sm focus-ring focus-ring-light">
              <option v-for="(option, index) in state.pageSizeOptions" :value="option" :key="index">
                {{ option }}
              </option>
            </select>
            entries
          </label>
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <div class="dataTables_filter" v-if="props.table_search">
          <label class="text-uppercase text-muted" style="font-size: 11px">Search:<input type="search"
              v-model="state.filter" id="filter" class="form-control form-control-sm" aria-controls="datatable" />
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 table-responsive">
        <table ref="tableData" id="datatable" :class="props.table_class
          ? props.table_class + ' dataTable align-middle'
          : 'table table-hover dataTable align-middle'
          " style="width: 100%" aria-describedby="datatable_info">
          <!-- class="table table-hover table-bordered align-middle dt-responsive nowrap dataTable no-footer" -->
          <thead class="align-middle">
            <tr v-if="group">
              <th v-for="group in state.groupHeader" :colspan="group.colspan" :key="group.title" :class="group.class">
                {{ group.title }}
              </th>
            </tr>
            <tr :class="'text-info bg-light' + ' ' + props.headerClassAll">
              <th v-for="(column, index) in state.columns" :key="index" @click="toggleSorting(column)" :style="'width:' +
                column.width +
                '; cursor:' +
                (column.sortable ? ' pointer;' : ' default;')
                " :class="checkIcon(column) + ' ' + column.headerClass" aria-controls="datatable">
                <div style="font-size: 11px">
                  {{ column.label }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedItems" :key="index" :class="props.customRow && getObjectValue(item, props.customRow.value)
              ? props.customRow.class
              : ''
              ">
              <td v-for="(column, columnIndex) in state.columns" :key="columnIndex" style="font-size: 11px">
                <template v-if="column.isNumber">
                  <div :class="column.class">
                    {{ getObjectValue(item, column.name) || 0 }}
                  </div>
                </template>
                <template v-else-if="column.isColorList">
                  <div :class="column.class">
                    <span class="badge p-1 fs-10" :style="'width: 100px; background-color: ' +
                      getObjectValue(item, column.name)
                      ">&nbsp;</span>
                  </div>
                </template>
                <template v-else-if="column.custom">
                  <div v-if="column.custom.routeName" :class="column.bold ? 'fw-bolder ' : 'fw-normal '">
                    <span>
                      <i v-if="column.custom.icon" :class="column.custom.icon" :style="column.custom.iconColorObject
                        ? 'color: ' +
                        getObjectValue(
                          item,
                          column.custom.iconColorObject
                        ) +
                        ';'
                        : column.custom.iconColor
                          ? 'color: ' + column.custom.iconColor + ';'
                          : null
                        "></i>
                      <img v-if="column.custom.image" :src="avatar(getObjectValue(item, column.custom.image))"
                        class="rounded-circle avatar-xxs me-2" />
                      <img v-if="column.custom.thumbnail" :src="getObjectValue(item, column.custom.thumbnail)"
                        class="rounded-circle avatar-xs me-2" />
                      <template v-if="column.isFirst">
                        <router-link :to="{
                          name: column.custom.routeName,
                          params: {
                            id: getObjectValue(
                              item[column.name][0],
                              column.custom.params
                            ),
                            slug: getObjectValue(
                              item[column.name][0],
                              column.custom.slug
                            ),
                          },
                        }">
                          {{
                            getObjectValue(item[column.name][0], column.display)
                          }}
                        </router-link>
                      </template>
                      <template v-else-if="column.isLast">
                        <router-link :to="{
                          name: column.custom.routeName,
                          params: {
                            id: getObjectValue(
                              item[column.name][array.length - 1],
                              column.custom.params
                            ),
                            slug: getObjectValue(
                              item[column.name][array.length - 1],
                              column.custom.slug
                            ),
                          },
                        }">
                          {{
                            getObjectValue(
                              item[column.name][array.length - 1],
                              column.display
                            )
                          }}
                        </router-link>
                      </template>
                      <template v-else>
                        <router-link :to="{
                          name: column.custom.routeName,
                          params: {
                          id: column.custom.params ? getObjectValue(item, column.custom.params) : null,
                          slug: column.custom.params ? getObjectValue(item, column.custom.params) : null,
                          },
                        }">
                          <span v-if="column.custom.isTruncate">
                            <span :class="column.class">
                              {{
                                truncateWords(
                                  getObjectValue(item, column.name),
                                  column.custom.isTruncate
                                ) || "-"
                              }}
                            </span>
                            <span v-if="
                              lengthWords(
                                getObjectValue(item, column.name)
                              ) || '' > column.custom.isTruncate
                            " class="text-muted">
                              [...]
                            </span>
                          </span>
                          <span v-else-if="column.custom.isLimitWord">
                            <span :class="column.class">
                              {{
                                limitWords(
                                  getObjectValue(item, column.name),
                                  column.custom.isLimitWord
                                ) || "-"
                              }}
                            </span>
                          </span>
                          <span v-else :class="column.class">
                            {{ getObjectValue(item, column.name) || "-" }}
                          </span>
                          <i v-if="
                            column.custom.uniqueFirst &&
                            getObjectValue(
                              item,
                              column.custom.uniqueFirst.fields
                            ) === column.custom.uniqueFirst.value
                          " :class="column.custom.uniqueFirst.icon"></i>
                        </router-link>
                      </template>
                    </span>
                  </div>
                  <template v-else-if="column.custom.image">
                    <img v-if="column.custom.image" :src="avatar(getObjectValue(item, column.custom.image))"
                      class="rounded-circle avatar-xxs me-2" />
                    {{ getObjectValue(item, column.name) }}
                    <i v-if="
                      column.custom.uniqueFirst &&
                      getObjectValue(
                        item,
                        column.custom.uniqueFirst.fields
                      ) === column.custom.uniqueFirst.value
                    " :class="column.custom.uniqueFirst.icon"></i>
                  </template>
                  <div v-else :class="column.class">
                    <span>
                      <i :class="column.custom.icon"></i>
                      {{ getObjectValue(item, column.name) || "-" }}
                    </span>
                  </div>
                </template>
                <template v-else-if="column.isDataLength">
                  <div :class="column.class">
                    <span class="badge badge-label bg-primary">
                      {{ getDataLength(item[column.name]) }}
                    </span>
                  </div>
                </template>
                <template v-else-if="column.isLengthArray">
                  <div :class="column.class">
                    {{ getDataLengthArray(getObjectValue(item, column.name)) }}
                  </div>
                </template>
                <template v-else-if="column.isRouteBadge">
                  <div v-for="data in routeBadge(item[column.name])" :key="data" :class="column.class">
                    <span class="badge bg-info-subtle text-info"><i class="las la-check-square me-1"></i> {{ data
                    }}</span>
                  </div>
                </template>
                <template v-else-if="column.isStatusCampaign">
                  <div :class="column.class">
                    <span :class="'badge bg-' +
                      statusMetaColor(item[column.name]) +
                      ' fs-10'
                      ">{{ getObjectValue(item, column.name) }}</span>
                  </div>
                </template>
                <template v-else-if="column.isStatus">
                  <div :class="column.class">
                    <span :class="'badge bg-' +
                      statusBadgeColor(item[column.name]) +
                      ' fs-10'
                      ">{{ statusBadgeLabel(item[column.name]) }}</span>
                  </div>
                </template>
                <template v-else-if="column.badge">
                  <template v-if="column.badge.types">
                    <div v-if="column.badge.isArray">
                      <div v-for="(array, indexA) in item[column.name]" :key="indexA">
                        <div v-for="(model, indexB) in column.badge.types" :key="indexB">
                          <div v-if="
                            model.value ===
                            getObjectValue(array, column.badge.display)
                          ">
                            <span v-if="column.badge.custom" :class="'badge text-' + model.textColor"
                              :style="'background-color: ' + model.color + ';'">{{
                                model.label
                                  ? model.label
                                  : getObjectValue(array, column.badge.display)
                              }}</span>
                            <span v-else :class="'badge bg-' +
                              model.type +
                              '-subtle text-' +
                              model.type +
                              ' p-2'
                              ">{{
                                model.label
                                  ? model.label
                                  : getObjectValue(array, column.badge.display)
                              }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <template v-else>
                      <template v-for="(model, indexA) in column.badge.types" :key="indexA">
                        <template v-if="
                          model.value === getObjectValue(item, column.name)
                        ">
                          <span v-if="column.badge.custom" :class="'badge bg-' + model.class">
                            <i :class="model.icon"></i>
                            {{
                              model.label
                                ? model.label
                                : getObjectValue(item, column.name)
                            }}
                          </span>
                          <span v-else :class="'badge bg-' +
                            model.type +
                            '-subtle text-' +
                            model.type +
                            ' p-2'
                            ">{{
                              model.label
                                ? model.label
                                : getObjectValue(item, column.name)
                            }}</span>
                        </template>
                      </template>
                    </template>
                  </template>
                  <div v-else id="Badge">
                    <div v-if="column.badge.isArray">
                      <template v-for="(array, indexA) in item[column.name]" :key="indexA">
                        <span v-if="column.badge.custom" :class="'badge text-' + column.badge.textColor" :style="'background-color: ' +
                          getObjectValue(array, column.badge.color) +
                          ';'
                          ">{{
                            getObjectValue(array, column.badge.display)
                          }}</span>
                        <span v-else :class="'badge bg-' +
                          column.badge.type +
                          '-subtle text-' +
                          column.badge.type +
                          ' p-2'
                          ">{{
                            getObjectValue(array, column.badge.display)
                          }}</span>
                      </template>
                    </div>
                    <div v-else>
                      <span v-if="column.badge.custom" :class="'badge text-' + column.badge.textColor" :style="'background-color: ' +
                        getObjectValue(item, column.badge.color) +
                        ';'
                        ">{{ getObjectValue(item, column.name) }}</span>
                      <span v-else :class="'badge bg-' +
                        column.badge.type +
                        '-subtle text-' +
                        column.badge.type +
                        ' p-2'
                        ">{{ getObjectValue(item, column.name) }}</span>
                    </div>
                  </div>
                </template>
                <template v-else-if="column.isCountPermit">
                  <div :class="column.class">
                    {{ filterRead(item[column.name]) || "-" }}
                  </div>
                </template>
                <template v-else-if="column.isCurrencyCustom">
                  <div :class="column.class">
                    <span :class="column.isCurrencyCustom.color">
                      {{ column.isCurrencyCustom.name }}
                    </span>
                    <strong :class="column.isCurrencyCustom.colorValue">
                      {{
                        thousandSeparator(getObjectValue(item, column.name)) ||
                        0
                      }}
                    </strong>
                  </div>
                </template>
                <template v-else-if="column.isReport">
                  <router-link v-if="column.isReport" :class="column.class" :to="{
                    name: column.isReport.routeName,
                    params: {
                      id: getObjectValue(item, column.isReport.params),
                    },
                  }">
                    <span class="badge bg-info fs-10"><i class="las la-chart-bar"></i> Report</span>
                  </router-link>
                  <span v-else>-</span>
                </template>
                <template v-else-if="column.isDateTime">
                  <div :class="column.class">
                    {{ formatDefaultDate(getObjectValue(item, column.name)) }}
                  </div>
                </template>
                <template v-else>
                  <div :class="column.class">
                    {{ getObjectValue(item, column.name) || "-" }}
                  </div>
                </template>
              </td>
            </tr>
            <tr v-if="!paginatedItems.length">
              <td :colspan="state.columns.length" class="dataTables_empty" valign="top">
                <div v-if="loadingState" class="d-flex text-info justify-content-center align-items-center">
                  <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <span class="mx-3">Loading ...</span>
                </div>
                <span v-else class="text-uppercase text-info" style="font-size: 11px">No matching records found</span>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="paginatedItems.length">
            <slot name="tableFooter"></slot>
          </tfoot>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-5" v-if="props.table_pagination">
        <div class="dataTables_info" id="datatable_info" role="status" aria-live="polite">
          <span class="page-stats text-uppercase text-muted" style="font-size: 11px">Showing {{ entriesRange }}
            entries</span>
        </div>
      </div>
      <div class="col-sm-12 col-md-7" v-if="props.table_pagination">
        <div :class="totalPages >= 10 ? 'paging_simple_numbers' : 'paging_full_numbers'
          " class="dataTables_paginate text-center" id="datatable_paginate">
          <ul class="pagination">
            <li class="paginate_button page-item previous">
              <button @click="prevPage" class="page-link" data-dt-idx="0" tabindex="0" :style="'cursor:' +
                (state.currentPage === 1 ? ' default;' : ' pointer;')
                ">
                {{ "<" }} </button>
            </li>
            <template v-if="totalPages <= 10">
              <li class="paginate_button page-item" v-for="pageNumber in pages" :key="pageNumber">
                <button @click="goToPage(pageNumber)" class="page-link" data-dt-idx="2" tabindex="0"
                  :class="{ active: pageNumber === state.currentPage }" :style="'cursor:' +
                    (pageNumber === state.currentPage
                      ? ' default;'
                      : ' pointer;')
                    ">
                  {{ pageNumber }}
                </button>
              </li>
            </template>
            <template v-else>
              <li v-if="ellipsisPages.start > 1" class="paginate_button page-item">
                <button @click="goToPage(1)" class="page-link" data-dt-idx="2" tabindex="0"
                  :class="{ active: 1 === state.currentPage }" :style="'cursor:' +
                    (1 === state.currentPage ? ' default;' : ' pointer;')
                    ">
                  1
                </button>
              </li>
              <li v-if="ellipsisPages.start > 1">
                <span class="page-link">...</span>
              </li>
              <li class="paginate_button page-item" v-for="pageNumber in ellipsisPages.range" :key="pageNumber">
                <button @click="goToPage(pageNumber)" class="page-link" data-dt-idx="2" tabindex="0"
                  :class="{ active: pageNumber === state.currentPage }" :style="'cursor:' +
                    (pageNumber === state.currentPage
                      ? ' default;'
                      : ' pointer;')
                    ">
                  {{ pageNumber }}
                </button>
              </li>
              <li v-if="ellipsisPages.end < totalPages">
                <span class="page-link" style="pointer-events: none">...</span>
              </li>
              <li v-if="ellipsisPages.end < totalPages" class="paginate_button page-item">
                <button @click="goToPage(totalPages)" class="page-link" data-dt-idx="2" tabindex="0"
                  :class="{ active: totalPages === state.currentPage }" :style="'cursor:' +
                    (totalPages === state.currentPage
                      ? ' default;'
                      : ' pointer;')
                    ">
                  {{ totalPages }}
                </button>
              </li>
            </template>
            <li class="paginate_button page-item next">
              <button @click="nextPage" class="page-link" data-dt-idx="8" tabindex="0" :style="'cursor:' +
                (state.currentPage === totalPages ? ' default;' : ' pointer;')
                ">
                {{ ">" }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
