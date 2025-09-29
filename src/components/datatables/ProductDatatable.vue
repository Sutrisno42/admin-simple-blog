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
        width: "50%",
        label: "Product",
        name: "name",
        class: "text-lowercase fw-semibold",
        icon: "me-1 ri-file-list-3-line text-success",
        routeName: "section.detail-products",
        params: "slug",
        sortable: true,
        filterable: true,
    },
    {
        width: "10%",
        label: "Price",
        name: "publishPrice",
        class: "text-uppercase",
        sortable: true,
        filterable: true,
    },
    {
        width: "10%",
        label: "Views Lifetime",
        name: "total_views",
        class: "text-success text-end",
        sortable: true,
        filterable: true,
    },
    {
        width: "10%",
        label: "Views This Month",
        name: "monthly_views",
        class: "text-success text-end",
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
    <ServerSidev2 :columns="columns" :filters="filters" :table-data="articles" fetch-route="/products"
        ref="dataTableRef" with-search>
        <template #tableBody="{ rows }">
            <tr v-for="row in rows" :key="row.id">
                <td v-for="column in columns" :key="column.name">
                    <div v-if="column.name == 'name'" :class="column.class">
                        <router-link :to="{
                            name: column.routeName,
                            params: { slug: row[column.params] },
                        }">
                            {{ row[column.name] }}</router-link>
                    </div>
                    <div v-else-if="column.name == 'publishPrice'" >
                        {{ formatPriceToIDR(row.publishPrice) }}
                    </div>
                    <div v-else :class="column.class">
                        {{ row[column.name] || "-" }}
                    </div>
                </td>
            </tr>
        </template>
    </ServerSidev2>
</template>
