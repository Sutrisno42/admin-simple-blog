<script setup>
import { onMounted, ref } from "vue";
import { getAvatar } from "@/utils/assetsHelper.js";
import {
  statusImgLabel,
  statusUserColor,
  statusUserLabel,
} from "@/utils/badgeStatus";
import { formatDefaultDate } from "@/utils/formatDate";
import ServerSidev2 from "./partials/ServerSidev2.vue";

const dataTableRef = ref(null);
const filters = ref({
  search: null,
});
const articles = ref([]);
const columns = [
  { width: "1%", label: "ID", name: "id", sortable: true, filterable: true },
  {
    width: "35%",
    label: "Title",
    name: "title",
    class: "text-uppercase fw-semibold",
    routeName: "article.detail-articles",
    params: "slug",
    sortable: true,
    filterable: true,
  },
  {
    width: "35%",
    label: "Publish Date",
    name: "published",
    class: "text-uppercase fw-semibold",
    sortable: true,
    filterable: true,
  },
  {
    width: "15%",
    label: "Author",
    name: "author",
    icon: "me-1 ri-file-list-3-line text-success",
    // routeName: "user.detail",
    params: "id",
    class: "text-uppercase",
    sortable: true,
    filterable: true,
  },
  {
    headerClass: "text-end",
    label: "Image",
    name: "image",
    class: "text-success text-center me-1",
    sortable: true,
    filterable: true,
  },
  {
    width: "1%",
    label: "View",
    name: "views",
    sortable: true,
    filterable: true,
  },
  {
    width: "1%",
    label: "Internal Backlinks",
    name: "",
    sortable: true,
    filterable: true,
  },
  { width: "1%", label: "Pillar", name: "", sortable: true, filterable: true },
  { width: "1%", label: "", name: "", sortable: true, filterable: true },
];
const avatar = (avatar) => getAvatar(avatar);
async function fetchTableData() {
  if (dataTableRef.value) {
    await dataTableRef.value.fetch();
  }
}
onMounted(() => {
  fetchTableData();
});
</script>
<template>
  <ServerSidev2
    :columns="columns"
    :filters="filters"
    :table-data="articles"
    fetch-route="/articles"
    ref="dataTableRef"
    with-search
  >
    <template #tableBody="{ rows }">
      <tr v-for="row in rows" :key="row.id">
        <td v-for="column in columns" :key="column.name">
          <div v-if="column.name == 'title'" :class="column.class">
            <router-link
              :to="{
                name: column.routeName,
                params: { slug: row[column.params] },
              }"
            >
              <i class="me-1 ri-file-list-3-line text-success"></i>
              {{ row[column.name] }}</router-link
            >
          </div>
          <div v-else-if="column.name === 'author'">
            <router-link
              :to="{
                name: column.routeName,
                params: { id: row[column.params] },
              }"
            >
              <i class="las la-user me-1 text-success"></i>
              {{ row.author?.username || "-" }}</router-link
            >
          </div>
          <div v-else-if="column.name === 'image'" :class="column.class">
            <span class="badge bg-success text-center">{{
              statusImgLabel(row[column.name])
            }}</span>
          </div>
          <!-- <div v-else-if="column.name == 'is_active'">
                        <span :class="'badge bg-' +
                            statusUserColor(row[column.name]) +
                            '-subtle text-' +
                            statusUserColor(row[column.name]) +
                            ' p-2 pt-1 pb-1 fs-10'
                            ">{{ statusUserLabel(row[column.name]) }}</span>
                    </div> -->
          <div v-else :class="column.class">
            {{ row[column.name] || "-" }}
          </div>
        </td>
      </tr>
    </template>
  </ServerSidev2>
</template>
