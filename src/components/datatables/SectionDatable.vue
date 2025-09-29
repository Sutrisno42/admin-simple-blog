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
        label: "Title",
        name: "title",
        class: "text-lowercase fw-semibold",
        icon: "me-1 ri-file-list-3-line text-success",
        routeName: "homepage.detail-sections",
        params: "id",
        sortable: true,
        filterable: true,
    },
    // {
    //     label: "Paragraph",
    //     name: "paragraph",
    //     class: "text-uppercase",
    //     sortable: true,
    //     filterable: true,
    // },
    {
        label: "Content",
        name: "content",
        class: "text-success",
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
    <ServerSidev2 :columns="columns" :filters="filters" :table-data="articles" fetch-route="/sections"
        ref="dataTableRef" with-search>
        <template #tableBody="{ rows }">
            <tr v-for="row in rows" :key="row.id">
                <td v-for="column in columns" :key="column.name">
                    <div v-if="column.name == 'title'" :class="column.class">
                        <router-link :to="{
                            name: column.routeName,
                            params: { id: row[column.params] },
                        }">
                            {{ row[column.name] }}</router-link>
                    </div>
                    <!-- <div v-else-if="column.name == 'paragraph'" >
                        {{ row[column.name] }}
                    </div> -->
                    <div v-else :class="column.class">
                        {{ row[column.name] || "-" }}
                    </div>
                </td>
            </tr>
        </template>
    </ServerSidev2>
</template>
