<script setup>
import TableCard from "@/components/cards/TableCard.vue";
import DatatableClient from "@/components/datatables/partials/DatatableClient.vue";
import InputBase from "@/components/Input/InputBase.vue";
import ModalBasic from "@/components/modal/ModalBasic.vue";
import Layout from "@/layouts/Layout.vue";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Form } from "vee-validate";
import { onMounted, reactive } from "vue";
import apiClient from "@/service/ApiClientService";

const state = reactive({
  columns: [
    { width: "1%", label: "ID", name: "id", sortable: true, filterable: true },
    {
      width: "50%",
      label: "Category",
      name: "title",
      class: "text-uppercase fw-semibold",
      custom: {
        icon: "me-1 ri-bookmark-3-line text-success ",
        routeName: "article.detail-categories",
        params: "slug",
      },
      sortable: true,
      filterable: true,
    },
    {
      width: "5%",
      label: "Articles",
      name: "articleCounts",
      class: "text-uppercase fw-semibold",
      sortable: true,
      filterable: true,
    },
  ],
  data: [],
  formData: {},
  modal: false,
  checked: false,
});

const addSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
});

const fetchData = async () => {
  try {
    await apiClient.get("/categories").then((res) => {
      state.data = res.result || [];
    });
  } catch (error) {
    handleError(error);
  }
};

const showModal = async () => {
  state.modal = !state.modal;
  state.checked = false;
};

async function submitAdd(values) {
  try {
    console.log("Submitted Data:", values);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to add new role data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    });

    if (!result.isConfirmed) return;

    await apiClient.post("/categories", values);

    await Swal.fire({
      icon: "success",
      title: "Categories Created",
      text: "Your category has been successfully added!",
    });

    fetchData();
    state.modal = false;
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
          <i class="las la-braille"></i>Article Category
        </h5>
        <div class="flex-shrink-0">
          <button type="button" class="btn btn-sm btn-info" @click="showModal">
            <i class="las la-plus"></i>
            <span class="hide-xs">Add Categories</span>
          </button>
        </div>
      </template>
      <template #default>
        <DatatableClient
          :column="state.columns"
          headerClassAll="text-uppercase"
          table_class="table table-hover table-bordered"
          :dataTable="state.data"
        />
      </template>
    </TableCard>
  </Layout>
  <ModalBasic
    title="Add Category"
    titleClass="text-uppercase text-primary"
    :modelValue="state.modal"
    noClose
    @toggle="state.modal = $event"
  >
    <template #modalBody>
      <Form
        :validation-schema="addSchema"
        id="addCategory"
        class="row g-3"
        @submit="submitAdd"
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
        @click="state.modal = !state.modal"
      >
        Cancel
      </button>
      <button
        class="btn btn-info btn-sm"
        form="addCategory"
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
