<script setup>
import TableCard from "@/components/cards/TableCard.vue";
import ModalBasic from "@/components/modal/ModalBasic.vue";
import Layout from "@/layouts/Layout.vue";
import * as yup from "yup";
import { formatDefaultDate } from "@/utils/formatDate";
import Swal from "sweetalert2";
import { Form } from "vee-validate";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputBase from "@/components/Input/InputBase.vue";
import { handleError } from "@/handler/errorHandler";
import apiClient from "@/service/ApiClientService";

const route = useRoute();
const router = useRouter();
const state = reactive({
  data: {},
  result: {},
  formData: {},
  modalUpdate: false,
  checked: false,
});

const updateSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
});

function showModal() {
  state.modalUpdate = !state.modalUpdate;
  state.checked = false;

  // untuk mengambil title
  state.formData = {
    title: state.result.title,
  };
}
async function updateData(values) {
  try {
    await apiClient.patch(`/categories/${route.params.slug}`, values);

    state.modalUpdate = false;
    state.formData = {};
    router.push({ name: "article.categories" }).then(() => {
      Swal.fire(
        "success",
        "The data has been updated successfully.",
        "success"
      );
    });
  } catch (error) {
    handleError(error);
  }
}
const fetchData = async () => {
  try {
    await apiClient.get(`/categories/${route.params.slug}`).then((res) => {
      state.result = res.result;
    });
  } catch (error) {
    handleError(error);
  }
};

async function deleteData() {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to archive/delete this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    await apiClient.delete(`/categories/${route.params.slug}`);

    router.push({ name: "article.categories" }).then(async () => {
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The data has been deleted successfully!",
      });
    });
  } catch (error) {
    handleError(error);
  }
}

onMounted(() => {
  fetchData();
});
</script>
<template>
  <Layout>
    <TableCard>
      <template #header>
        <h5 class="flex-grow-1 mb-0 text-muted text-uppercase">
          <i class="las las la-braille"></i> Category
        </h5>
        <div class="flex-shrink-0">
          <button
            type="button"
            class="btn btn-sm btn-success"
            @click="showModal"
          >
            <i class="me-1 las la-pen"></i>
            <span class="hide-xs">Update Category</span>
          </button>
        </div>
      </template>
      <template #default>
        <div class="row">
          <div class="col-md-4" v-if="state.result.title">
            <span class="text-muted text-uppercase fs-11">Name</span>
            <div
              class="fs-11 fw-semibold border-bottom pb-2 mb-3 text-uppercase"
            >
              <i class="las la-braille me-1 text-info"></i>
              <strong>{{ state.result.title }}</strong>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <nav aria-label="breadcrumb mb-0">
          <ol class="breadcrumb text-uppercase mb-0">
            <li class="breadcrumb-item">
              <i class="las la-arrow-left me-1 text-muted"></i>
              <router-link
                :to="{ name: 'article.categories' }"
                class="text-info"
              >
                <strong>Category</strong>
              </router-link>
            </li>
          </ol>
        </nav>
      </template>
    </TableCard>
    <div class="row fs-11">
      <div class="col-lg-12">
        <div class="card">
          <div
            class="card-body table-responsive text-uppercase"
            id="div_card__footer"
          >
            <div class="row text-muted">
              <div class="col-md-6">
                Created: {{ formatDefaultDate(state.result.created_at) }} by
                {{ state.result.created_by || "no users" }}
              </div>
              <div class="col-md-6" v-if="state.result.updated_by">
                Modified:
                {{ formatDefaultDate(state.result.updated_at) }} by
                {{ state.result.updated_by || "no users" }}
              </div>
            </div>
          </div>

          <div class="card-footer bg-light pt-2 pb-2">
            <div class="row">
              <div class="col-6 pt-1">
                <i class="las la-braille me-1 text-muted"></i>
              </div>
              <div class="col-6 text-end">
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-light text-muted"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="las la-trash"></i> Delete/Archive
                  </button>
                  <div class="dropdown-menu fs-12" style="">
                    <button
                      class="dropdown-item text-primary"
                      @click="deleteData"
                    >
                      <i class="las la-inbox"></i> Archive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  <ModalBasic
    title="Update Category"
    titleClass="text-uppercase text-primary"
    :modelValue="state.modalUpdate"
    noClose
    @toggle="state.modalUpdate = $event"
  >
    <template #modalBody>
      <Form
        :validation-schema="updateSchema"
        @submit="updateData"
        id="updateCategory"
      >
        <div class="col-md-12 border-bottom pb-3">
          <InputBase
            label="Category Name/Title"
            type="text"
            name="title"
            :model-value="state.formData.title"
          />
        </div>
      </Form>
    </template>
    <template #modalFooter>
      <button
        type="button"
        class="btn btn-light btn-sm"
        @click="state.modalUpdate = !state.modalUpdate"
      >
        Cancel
      </button>
      <button
        class="btn btn-info btn-sm"
        form="updateCategory"
        type="submit"
        :class="!state.checked ? 'disabled' : ''"
      >
        <i class="ri-check-line align-middle me-1"></i>
        Add/Save
      </button>
      <label style="padding-left: 11px">
        <input
          type="checkbox"
          name="confirm"
          v-model="state.checked"
          required
        />
        <span class="lbl"> Confirm.</span>
      </label>
    </template>
  </ModalBasic>
</template>
