<script setup>
import { onMounted, ref } from "vue";
import ServerSidev2 from "./partials/ServerSidev2.vue";
import { formatPriceToIDR } from "@/utils/convertIdr";

const dataTableRef = ref(null);
const filters = ref({
    search: null,
});
const articles = ref([]);
const columns = [
    { width: "1%", label: "ID", name: "id", sortable: true, filterable: true },
    {
        label: "Store",
        name: "name",
        class: "text-uppercase fw-semibold",
        icon: "me-1 ri-file-list-3-line text-success",
        // routeName: "section.detail-products",
        // params: "id",
        sortable: true,
        filterable: true,
    },
    {
        width: "10%",
        label: "Desc/Username",
        name: "username",
        class: "text-uppercase",
        sortable: true,
        filterable: true,
    },
    {
        label: "URL",
        name: "url",
        class: "text-uppercase",
        sortable: true,
        filterable: true,
    },
    {
        width: "10%",
        label: "Clicks Lifetime",
        name: "total_clicks",
        class: "text-success text-end me-1",
        sortable: true,
        filterable: true,
    },
    {
        width: "10%",
        label: "Clicks This Month",
        name: "monthly_clicks",
        class: "text-success text-end me-1",
        sortable: true,
        filterable: true,
    },
];
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
    <ServerSidev2 :columns="columns" :filters="filters" :table-data="articles" fetch-route="/stores" ref="dataTableRef"
        with-search>
        <template #tableBody="{ rows }">
            <tr v-for="row in rows" :key="row.id">
                <td v-for="column in columns" :key="column.name">
                    <div v-if="column.name == 'name'" :class="column.class">
                        <router-link :to="{
                            name: column.routeName,
                            params: { id: row[column.params] },
                        }">
                            <i class="me-1 ri-stack-line text-success "></i>
                            {{ row[column.name] }}</router-link>
                    </div>
                    <div v-else :class="column.class">
                        {{ row[column.name] || "0" }}
                    </div>
                </td>
            </tr>
        </template>
    </ServerSidev2>
</template>
