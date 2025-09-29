<script setup>
import { onMounted, ref } from "vue";
import { statusPublishLabel, statusUserColor, statusUserLabel } from "@/utils/badgeStatus";
import ServerSidev2 from "./partials/ServerSidev2.vue";
import { formatDate, formatDefaultDate } from "@/utils/formatDate";

const dataTableRef = ref(null);
const filters = ref({
    search: null,
});
const users = ref([]);
const columns = [
    { width: "1%", label: "ID", name: "id", sortable: true, filterable: true },
    {
        width: "50%",
        label: "Title",
        name: "title",
        class: "text-uppercase fw-semibold",
        icon: "me-1 ri-home-line text-success",
        routeName: "homepage.detail-heroes",
        params: "id",
        sortable: true,
        filterable: true,
    },
    {
        width: "5%",
        label: "Publish Date",
        name: "published_date",
        class: "text-uppercase fw-semibold",
        sortable: true,
        filterable: true,
    },
    {
        width: "5%",
        label: "End Date",
        name: "end_date",
        class: "text-uppercase",
        sortable: true,
        filterable: true,
    },
    {
        width: "5%",
        label: "Status",
        name: "published",
        class: "text-success text-center me-1",
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
    <ServerSidev2 :columns="columns" :filters="filters" :table-data="users" fetch-route="/heroes/admin/all" ref="dataTableRef"
        with-search>
        <template #tableBody="{ rows }">
            <tr v-for="row in rows" :key="row.id">
                <td v-for="column in columns" :key="column.name">
                    <div v-if="column.name == 'title'" :class="column.class">
                        <router-link :to="{
                            name: column.routeName,
                            params: { id: row[column.params], },
                        }">
                            <i :class="column.icon" />
                            {{ row[column.name] }}
                        </router-link>
                    </div>
                    <div v-else-if="column.name == 'published_date' || column.name == 'end_date'">
                        {{ formatDefaultDate(row[column.name]) }}
                    </div>
                    <div v-else-if="column.name == 'status'" :class="column.class">
                        <span :class="'badge bg-' +
                            statusUserColor(row[column.name]) +
                            '-subtle text-' +
                            statusUserColor(row[column.name]) +
                            ' p-2 pt-1 pb-1 fs-10'
                            ">{{ statusPublishLabel(row[column.name]) }}</span>
                    </div>
                    <div v-else :class="column.class">
                        {{ row[column.name] || "-" }}
                    </div>
                </td>
            </tr>
        </template>
    </ServerSidev2>
</template>
