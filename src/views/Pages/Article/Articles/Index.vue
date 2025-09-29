<script setup>
import Layout from "@/layouts/Layout.vue";
import TableCard from "@/components/cards/TableCard.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import ServerSidev2 from "@/components/datatables/partials/ServerSidev2.vue";
import { statusImgLabel } from "@/utils/badgeStatus";
import { formatDefaultDate } from "@/utils/formatDate";
import ModalBasic from "@/components/modal/ModalBasic.vue";
import Multiselect from "@vueform/multiselect";
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { isAdmin } from "@/utils/isAdmin";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/service/ApiClientService";
import ServerSide from "@/components/datatables/partials/ServerSide.vue";

const componentKey = ref(0);
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const dataTableRef = ref(null);
const filters = ref({
  search: null,
  author: null,
  start_date: null,
  end_date: null,
  title: null,
});
let articles = ref([]);
const state = reactive({
  role: authStore.user.role.name,
  columns: [
    {
      hidden: false,
      width: "1%",
      label: "ID",
      name: "id",
      sortable: true,
      filterable: true,
    },
    {
      hidden: false,
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
      hidden: false,
      width: "35%",
      label: "Publish Date",
      name: "published_date",
      class: "text-success",
      sortable: true,
      filterable: true,
    },
    {
      hidden: false,
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
      hidden: false,
      headerClass: "text-end",
      label: "Image",
      name: "image",
      class: "text-success text-center me-1",
      sortable: true,
      filterable: true,
    },
    {
      hidden: false,
      width: "1%",
      label: "View",
      name: "views",
      sortable: true,
      filterable: true,
    },
    {
      width: "1%",
      label: "",
      name: "",
      routeName: "article.report-articles",
      params: "slug",
    },
  ],
  isFilter: false,
  formFilter: {
    title: null,
    author: null,
    rangeDate: null,
  },
  users: [],
  options: [
    {
      title: "Space Pirate",
      desc: "More space battles!",
      img: "assets/posters/fleet.png",
    },
    {
      title: "Merchant",
      desc: "PROFIT!",
      img: "assets/posters/trading_post.png",
    },
    {
      title: "Explorer",
      desc: "Discovering new species!",
      img: "assets/posters/creatures.png",
    },
    {
      title: "Miner",
      desc: "We need to go deeper!",
      img: "assets/posters/resource_lab.png",
    },
  ],
});
const toggleHeader = (label) => {
  const index = state.columns.findIndex((column) => column.label === label);
  state.columns[index].hidden = !state.columns[index].hidden;
  componentKey.value += 1;
};

const getAuthor = async () => {
  await apiClient.get("/users").then((res) => {
    state.users = res.result.data.map((item) => ({
      id: item.id,
      username: item.username,
    }));
  });
};

async function fetchTableData() {
  if (dataTableRef.value) {
    await dataTableRef.value.fetch();
  }
}

const filterArticle = async () => {
  const rangeDate = state?.formFilter?.rangeDate?.split("to") || null;

  const payload = {
    start_date: rangeDate && rangeDate[0],
    end_date: rangeDate && rangeDate[1],
    author: state?.formFilter?.author,
    search: state?.formFilter?.title,
  };

  filters.value = payload;
};

const clearFilterForm = () => {
  state.formFilter = {
    author: null,
    rangeDate: null,
    title: null,
  };
};

const openFilterForm = async () => {
  if (state.role === "SUPERADMIN") {
    await getAuthor();
  }
  state.isFilter = true;
};

const flatpickrConfig = {
  mode: "range",
  enableTime: false,
  dateFormat: "Y-m-d",
  altInput: false,
  altFormat: "F j, Y",
  defaultDate: null,
};

onMounted(() => {
  fetchTableData();
});
</script>
<template>
  <Layout>
    <div class="mb-3">
      <button
        type="button"
        class="btn btn-primary btn-sm text-uppercase fw-semibold"
      >
        <router-link :to="{ name: 'article.add-article' }" class="text-white">
          <i class="las la-plus me-1"></i>
          <span class="hide-xs">New Articles</span>
        </router-link>
      </button>
    </div>
    <TableCard>
      <template #header>
        <h5 class="flex-grow-1 mb-0 text-muted text-uppercase">
          <i class="las la-wallet me-1"></i> Articles
        </h5>
        <div class="flex-shrink-0">
          <button
            type="button"
            class="btn btn-info btn-sm me-1"
            @click="openFilterForm"
          >
            <i class="las la-filter"></i> Filter/
            <span class="hide-xs">Search</span>
          </button>

          <div class="btn-group btn-sm">
            <button
              class="btn btn-success btn-sm dropdown-toggle m-1"
              type="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="las la-columns"></i> <span class="hide-xs">Column</span>
            </button>
            <div
              class="dropdown-menu p-3 pb-1 fs-11 text-uppercase"
              id="showHideColumn"
              style=""
            >
              <div
                class="form-check form-check-success mb-1 dropdown-item"
                v-for="(toggle, index) in state.columns"
                :key="index"
              >
                <input
                  class="form-check-input toggle-vis"
                  type="checkbox"
                  :checked="!toggle.hidden"
                  @change="toggleHeader(toggle.label)"
                />
                {{ toggle.label }}
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-warning btn-sm">
            <router-link :to="{ name: 'article.calendar' }" class="text-light">
              <i class="las la-calendar"></i>
            </router-link>
          </button>
        </div>
      </template>
      <template #default>
        <ServerSide
          :columns="state.columns"
          :filters="filters"
          :table-data="articles"
          fetch-route="/blogs"
          ref="dataTableRef"
          with-search
        >
          <template #tableBody="{ rows }">
            <tr v-for="row in rows" :key="row.id">
              <td
                v-for="column in state.columns.filter((col) => !col.hidden)"
                :key="column.name"
              >
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
                <div
                  v-else-if="column.name === 'published_date'"
                  :class="column.class"
                >
                  {{ formatDefaultDate(row[column.name]) }}
                </div>
                <div v-else-if="column.name === 'author'">
                  <i class="las la-user me-1 text-success"></i>
                  {{ row.author?.username || "-" }}
                </div>
                <div v-else-if="column.name === 'image'" :class="column.class">
                  <span class="badge bg-success text-center">{{
                    statusImgLabel(row[column.name])
                  }}</span>
                </div>
                <div v-else-if="column.name === ''">
                  <router-link
                    :to="{
                      name: column.routeName,
                      params: { slug: row[column.params] },
                    }"
                  >
                    <i class="me-1 ri-file-list-3-line text-warning"></i>
                  </router-link>
                </div>
                <div v-else :class="column.class">
                  {{ row[column.name] || "0" }}
                </div>
              </td>
            </tr>
          </template>
        </ServerSide>
      </template>
    </TableCard>
  </Layout>

  <ModalBasic
    size="xl"
    title="Search Filter"
    :model-value="state.isFilter"
    @toggle="state.isFilter = false"
  >
    <template #modalBody>
      <div class="row">
        <div :class="isAdmin(state.role) ? 'col-md-4' : 'col-md-6'">
          <div class="border-bottom pb-3 mb-3">
            <label class="form-label text-uppercase fs-11" for="f_name"
              >Title</label
            >
            <div>
              <a
                href="#"
                class="btn text-muted"
                style="position: absolute; right: 10px"
                ><i class="las la-times"></i
              ></a>
              <input
                class="form-control bg-light"
                type="text"
                name="f_name"
                id="f_name"
                v-model="state.formFilter.title"
              />
            </div>
          </div>
        </div>
        <div class="col-md-4" v-if="isAdmin(state.role)">
          <div class="border-bottom pb-3 mb-3">
            <label for="">Author</label>
            <Multiselect
              required
              label="username"
              valueProp="id"
              track-by="username"
              class="bg-light"
              @click="getAuthor"
              v-model="state.formFilter.author"
              :options="state.users"
              :searchable="true"
              placeholder="Select
            author"
            />
          </div>
        </div>

        <div :class="isAdmin(state.role) ? 'col-md-4' : 'col-md-6'">
          <div class="mb-3 text-info border-bottom pb-3">
            <label class="form-label">Publish Date</label>
            <FlatPickr
              :config="flatpickrConfig"
              v-model="state.formFilter.rangeDate"
              class="form-control bg-light flatpickr-input"
            />
          </div>
        </div>
      </div>
    </template>

    <template #modalFooter>
      <div class="flex-shrink-0">
        <button
          class="btn btn-warning btn-sm"
          type="button"
          @click="clearFilterForm"
        >
          Clear Filter
        </button>
      </div>
      <div class="flex-grow-1 mb-0 text-end">
        <button
          class="btn btn-info btn-sm"
          type="submit"
          @click="filterArticle"
        >
          <i class="las la-search me-1"></i>
          Apply/Search
        </button>
        <button
          type="button"
          @click="state.isFilter = false"
          class="btn btn-light btn-sm"
          data-bs-dismiss="modal"
        >
          Cancel
        </button>
      </div>
    </template>
  </ModalBasic>
</template>

<style>
.multiselect-search {
  background-color: #f8f9fa !important;
}
</style>
