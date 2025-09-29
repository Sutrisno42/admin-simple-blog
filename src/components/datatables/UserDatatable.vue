<script setup>
import { onMounted, ref } from "vue";
import { statusUserColor, statusUserLabel } from "@/utils/badgeStatus";
import ServerSidev2 from "./partials/ServerSidev2.vue";

const dataTableRef = ref(null);
const filters = ref({
    search: null,
});
const users = ref([]);
const columns = [
    { width: "1%", label: "ID", name: "id", sortable: true, filterable: true },
    {
        width: "35%",
        label: "Name",
        name: "fullname",
        class: "text-uppercase fw-semibold",
        icon: "me-1 las la-gift text-success",
        routeName: "user.detail",
        params: "id",
        sortable: true,
        filterable: true,
    },
    {
        width: "35%",
        label: "Nick",
        name: "username",
        class: "text-uppercase fw-semibold",
        sortable: true,
        filterable: true,
    },
    {
        width: "15%",
        label: "Group",
        name: "role",
        class: "text-uppercase",
        sortable: true,
        filterable: true,
    },
    {
        headerClass: "text-end",
        label: "Status",
        name: "is_active",
        class: "text-success text-end me-1",
        sortable: true,
        filterable: true,
    },
    { width: "1%", label: "Phone", name: "phone", sortable: true, filterable: true },
    // { width: "1%", label: "Last Login", name: "id", sortable: true, filterable: true },
    // { width: "1%", label: "Last Activity", name: "id", sortable: true, filterable: true },
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
    <ServerSidev2 :columns="columns" :filters="filters" :table-data="users" fetch-route="/users" ref="dataTableRef"
        with-search>
        <template #tableBody="{ rows }">
            <tr v-for="row in rows" :key="row.id">
                <td v-for="column in columns" :key="column.name">
                    <div v-if="column.name == 'fullname'" :class="column.class">
                        <router-link :to="{
                            name: column.routeName,
                            params: { id: row[column.params] },
                        }">
                            <img :src="row.image_url"
                                class="avatar-xxs me-1 rounded-circle"  />
                            <!-- <img :src="" class="avatar-xxs me-1 rounded-circle" /> -->
                            {{ row[column.name] }}</router-link>
                    </div>
                    <!-- <div v-else-if="column.name == 'role'">
                        <span :style="'background-color:' + row.role.color"
                            class="badge bg-opacity-10 p-2 pt-1 pb-1 fs-10">
                            {{ row.role.display_name }}
                        </span>
                    </div> -->
                    <div v-else-if="column.name == 'is_active'">
                        <span :class="'badge bg-' +
                            statusUserColor(row[column.name]) +
                            '-subtle text-' +
                            statusUserColor(row[column.name]) +
                            ' p-2 pt-1 pb-1 fs-10'
                            ">{{ statusUserLabel(row[column.name]) }}</span>
                    </div>
                    <div v-else :class="column.class">
                        {{ row[column.name] || "-" }}
                    </div>
                </td>
            </tr>
        </template>
    </ServerSidev2>
</template>
