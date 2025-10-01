<script setup>
import Editor from "@/components/cards/Editor.vue";
import TableCard from "@/components/cards/TableCard.vue";
import Layout from "@/layouts/Layout.vue";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import router from "@/router";
import ModalBasic from "@/components/modal/ModalBasic.vue";
import { formatDefaultDate } from "@/utils/formatDate";
import moment from "moment-timezone";
import OffCanvas from "@/components/OffCanvas.vue";
import InputRelateArticle from "@/components/Input/InputRelateArticle.vue";
import InputBase from "@/components/Input/InputBase.vue";
import InputRichText from "@/components/Input/InputRichText.vue";
import InputImages from "@/components/Input/InputImages.vue";
import InputTags from "@/components/Input/InputTags.vue";
import InputMultiSelect from "@/components/Input/InputMultiSelect.vue";
import InputTextArea from "@/components/Input/InputTextArea.vue";
import InputCheckboxGroup from "@/components/Input/InputCheckboxGroup.vue";
import { handleError } from "@/handler/errorHandler";
import * as yup from "yup";
import { Form } from "vee-validate";
import { isAdmin } from "@/utils/isAdmin";
import { useAuthStore } from "@/stores/auth";
import InputFlatPickr from "@/components/Input/InputFlatPickr.vue";
import apiClient from "@/service/ApiClientService";
import { getAvatar, getStorage } from "@/utils/assetsHelper";

const { slug } = useRoute().params;
const authStore = useAuthStore();
const state = reactive({
  result: {},
  formData: {},
  categories: [],
  selectedCategories: [],
  modalImg: false,
  checked: false,
  errorUploadMessage: "",
  previewImage: "",
  relateArticle: [],
  isOpenRelatedArticle: false,
  role: authStore.user?.role.name ?? null,
});

const showModal = async () => {
  state.modalImg = !state.modalImg;
  state.checked = false;
};

const updateSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters"),
  slug: yup
    .string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters"),
  short_desc: yup
    .string()
    .required("short description is required")
    .max(500, "Short description must not exceed 500 characters"),
  // status: yup.boolean().required("Status is required"),
  published_date: yup.date().required("Published date is required"),
  // vidio_url: yup.string().optional().nullable(),
  tags: yup.array().of(yup.string()),
  category_id: yup.array().min(1, "At least one category must be selected"),
});

const validationImage = yup.object({
  image: yup
    .mixed()
    .required("Image wajib diisi")
    .test("fileSize", "Ukuran file maksimal 2MB", (value) => {
      if (!value) return false;
      return value.size <= 2 * 1024 * 1024; // 2MB
    })
    .test("fileType", "Format file harus berupa gambar", (value) => {
      if (!value) return false;
      return ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
        value.type
      );
    }),
});

async function updateArticle(values) {
  try {
    await apiClient.patch(`/blogs/${slug}`, values);

    Swal.fire("Success", "The data has been updated successfully.", "success");

    router.push({ name: "article.articles" });
  } catch (error) {
    handleError(error);
  }
}

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

    await apiClient.delete(`/blogs/${slug}`);

    await Swal.fire(
      "Deleted!",
      "The data has been deleted successfully!",
      "success"
    );

    router.push({ name: "article.articles" });
  } catch (error) {
    handleError(error);
    console.log('update', handleError)
  }
}

const fetchData = async () => {
  try {
    const res = await apiClient.get(`/blogs/${slug}`);

    state.result = res.data;
    state.selectedCategories = res.data.category
      ? [res.data.category.id]
      : [];
  } catch (error) {
    handleError(error);
  }
};

const fetchCategory = async () => {
  try {
    const res = await apiClient.get("/categories");
    state.categories = res.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

const onCLoseModal = () => {
  state.previewImage = "";
  state.modalImg = !state.modalImg;
};

const flatpickrConfig = {
  enableTime: true,
  dateFormat: "Y-m-d H:i:S",
  time_24hr: false,
  altInput: false,
};

onMounted(async () => {
  try {
    await Promise.all([fetchData(), fetchCategory()]);
  } catch (e) {
    console.error("Error salah satu:", e);
  }
});
</script>
<template>
  <Layout>
    <TableCard>
      <template class="d-flex align-items-center">
        <h5 class="flex-grow-1 mb-0 text-muted text-uppercase">
          <i class="las la-braille"></i> Article
        </h5>
        <div class="flex-shrink-0">
          <a
            :href="'http://8.215.33.70:3012/article/' + slug"
            class="btn btn-success btn-sm me-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit <span class="hide-xs">Page</span>
          </a>
          <router-link
            :to="'/article/articles-report/' + slug"
            class="btn btn-warning btn-sm"
            @click=""
          >
            Report
          </router-link>
        </div>
      </template>
    </TableCard>
    <Form
      :validation-schema="updateSchema"
      @submit="updateArticle"
      id="updateArtikel"
    >
      <Editor>
        <template #header>
          <h5 class="flex-grow-1 mb-0 text- text-uppercase"></h5>
          <div class="flex-shrink-0">
            <button
              type="submit"
              class="btn btn-info btn-sm me-1"
              form="updateArtikel"
            >
              <i class="ri-check-line align-middle"></i> Update &
              <span class="hide-xs">Publish</span>
            </button>
            <button
              type="button"
              class="btn btn-warning btn-sm"
              @click="state.isOpenRelatedArticle = true"
            >
              <i class="ri-link-m align-middle"></i>
            </button>
          </div>
        </template>
        <template #leftBody>
          <div class="mb-3">
            <span class="text-warning"
              >! Disarankan menggunakan <strong>Chrome Browser</strong>.</span
            >
          </div>
          <div class="mb-3 text-info">
            <InputBase
              label="Title"
              type="text"
              name="title"
              :model-value="state.result.title"
            />
          </div>
          <div class="mb-3 text-info">
            <InputRichText
              name="content"
              :model-value="state.result.content"
              label="Content"
            />
          </div>
        </template>
        <template #rightBody>
          <div class="mb-3 text-info border-bottom pb-3">
            <label for="formFile" class="form-label">Image</label>
            <div class="mb-3">
              <img
                :src="getStorage(state.result.image_url)"
                alt=""
                width="100%"
              />
              <button
                type="button"
                class="btn btn-warning btn-sm mt-2"
                @click="showModal"
              >
                <i class="las la-pen"></i> Change Image
              </button>
            </div>
          </div>
          <div class="mb-3 text-info border-bottom pb-3">
            <InputTextArea
              name="short_desc"
              :model-value="state.result.short_desc"
              label="Excerpt/Short Desc"
              :rows="4"
              placeholder="Tuliskan ringkasan singkat..."
            />
          </div>

          <div class="mb-3 text-info border-bottom pb-3">
            <InputBase
              label="Slug"
              type="text"
              name="slug"
              :model-value="state.result.slug"
            />
          </div>
          <div class="mb-3 text-info">
            <InputCheckboxGroup
              name="category"
              :categories="state.categories"
              :model-value="state.selectedCategories"
            />
          </div>

          <div class="mb-3 text-info border-bottom pb-3">
            <InputTags name="tags" :model-value="state.result.tags" />
          </div>
          <!-- <div
            class="mb-3 text-info border-bottom pb-3"
            v-if="isAdmin(state.role)"
          >
            <InputMultiSelect
              name="author"
              :model-value="state?.result?.author_id?.id"
              :options="state.users"
              field-label="Author"
              placeholder="Select author"
              valueProp="id"
              label="username"
            />
          </div> -->
        </template>
        <template #footer>
          <nav aria-label="breadcrumb mb-0">
            <ol class="breadcrumb text-uppercase mb-0">
              <li class="breadcrumb-item">
                <i class="las la-arrow-left me-1 text-muted"></i>
                <router-link
                  :to="{ name: 'article.articles' }"
                  class="text-info"
                >
                  <strong>Articles</strong>
                </router-link>
              </li>
            </ol>
          </nav>
        </template>
      </Editor>
    </Form>
    <div class="row fs-11">
      <div class="col-lg-12">
        <div class="card">
          <div
            class="card-body table-responsive text-uppercase"
            id="div_card__footer"
          >
            <div class="row text-muted">
              <div class="col-md-6">
                <!-- Created: {{ formatDefaultDate(state.result.created_at) }} -->
                <!-- by -->
                <!-- {{ state.result?.author?.username || "no users" }} -->
              </div>
              <div class="col-md-6" v-if="state.result.updated_at">
                Modified:
                <!-- {{ formatDefaultDate(state.result.updated_at) }} -->
                <!-- by -->
                <!-- {{ state.result?.author?.username || "no users" }} -->
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

  <OffCanvas
    title="Related Article"
    :is-open="state.isOpenRelatedArticle"
    @close="state.isOpenRelatedArticle = false"
  >
    <div v-for="(item, index) in state.relateArticle" class="">
      <InputRelateArticle :title="item.title" :content="item.slug" />
      <hr />
    </div>
  </OffCanvas>

  <ModalBasic
    title="Change Image"
    titleClass="text-uppercase text-primary"
    :modelValue="state.modalImg"
    noClose
    @toggle="state.modalImg = $event"
  >
    <template #modalBody>
      <Form
        :validationImage="validationImage"
        @submit="updateImg"
        id="updateImg"
        class="row g-3"
      >
        <div class="col-md-12 border-bottom pb-3">
          <InputImages
            name="image"
            style-image="width-500px"
            :image-size="'900x500px'"
            :imageUrl="state.result.image_url"
          />
        </div>
      </Form>
    </template>
    <template #modalFooter>
      <button type="button" class="btn btn-light btn-sm" @click="onCLoseModal">
        Cancel
      </button>
      <button
        class="btn btn-info btn-sm"
        form="updateImg"
        type="submit"
        :class="!state.checked ? 'disabled' : ''"
      >
        <i class="ri-check-line align-middle me-1"></i>
        Add/Save
      </button>
      <label style="padding-left: 11px">
        <input
          type="checkbox"
          form="updateImg"
          name="confirm"
          v-model="state.checked"
          required
        />
        <span class="lbl"> Confirm.</span>
      </label>
    </template>
  </ModalBasic>
</template>

<style scoped></style>
