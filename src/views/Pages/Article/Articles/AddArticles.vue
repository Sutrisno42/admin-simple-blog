<script setup>
import { onMounted, ref } from "vue";
import * as yup from "yup";
import Layout from "@/layouts/Layout.vue";
import Editor from "@/components/cards/Editor.vue";
import { reactive } from "vue";
import Swal from "sweetalert2";
import router from "@/router";
import moment from "moment";
import { handleError } from "@/handler/errorHandler";
import InputBase from "@/components/Input/InputBase.vue";
import InputImages from "@/components/Input/InputImages.vue";
import InputMultiSelect from "@/components/Input/InputMultiSelect.vue";
import InputTextArea from "@/components/Input/InputTextArea.vue";
import InputFlatPickr from "@/components/Input/InputFlatPickr.vue";
import InputTags from "@/components/Input/InputTags.vue";
import { Form } from "vee-validate";
import InputCheckboxGroup from "@/components/Input/InputCheckboxGroup.vue";
import InputRichText from "@/components/Input/InputRichText.vue";
import apiClient from "@/service/ApiClientService";
import { useAuthStore } from "@/stores/auth";

const state = reactive({
  data: [],
  result: {},
  formData: {
    description: "",
  },
  add: false,
  checked: false,
  categories: [],
  errorUploadMessage: "",
  selectedCategories: [],
  isLoading: false,
});

const validationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters"),
  short_desc: yup
    .string()
    .required("short description is required")
    .max(500, "Short description must not exceed 500 characters"),
  tags: yup.array().of(yup.string()),
  category_id: yup.array().min(1, "At least one category must be selected"),
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
  published_date: yup.date().required("Published date is required"),
});

async function submitAdd(values) {
  state.isLoading = true;
  try {
    const authStore = useAuthStore();
    const user = authStore.user;
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("short_desc", values.short_desc || "");
    formData.append("author_id", user.id);
    formData.append("category_id", values.category_id);
    formData.append("image", values.image);
    formData.append("tags", values.tags || []);

    await apiClient.post("/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    router.push({ name: "article.articles" }).then(() => {
      Swal.fire({
        icon: "success",
        title: "Article Created",
        text: "Your article has been successfully added!",
      });
    });
  } catch (error) {
    handleError(error);
  } finally {
    state.isLoading = false;
  }
}

const fetchCategory = async () => {
  try {
    const response = await apiClient.get("/categories");
    state.categories = response.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  } catch (error) {
    handleError(error);
  }
};
onMounted(() => {
  fetchCategory();
});
</script>
<template>
  <Layout>
    <Form
      :validation-schema="validationSchema"
      @submit="submitAdd"
      id="addArtikel"
    >
      <Editor>
        <template #header>
          <h5 class="flex-grow-1 mb-0 text-muted text-uppercase">
            <i class="las la-braille"></i> Artikel
          </h5>
          <div class="flex-shrink-0">
            <button
              form="addArtikel"
              type="submit"
              class="btn btn-primary btn-sm"
              :disabled="state.isLoading"
            >
              <span
                v-if="state.isLoading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              <i v-else class="ri-check-line align-middle me-1"></i>
              <span v-if="state.isLoading">Saving...</span>
              <span v-else>Save & <span class="hide-xs">Publish</span></span>
            </button>
          </div>
        </template>
        <template #leftBody>
          <div class="mb-3 text-info">
            <InputBase
              label="Title"
              type="text"
              name="title"
              v-model="state.formData.title"
              :disabled="state.isLoading"
            />
          </div>
          <div class="mb-3 text-info">
            <InputImages
              name="image"
              style-image="width-500px"
              :image-size="'900x500px'"
              :imageUrl="state.formData.image"
              :disabled="state.isLoading"
            />
          </div>
          <div class="mb-3 text-info">
            <InputRichText
              name="content"
              :model-value="state.formData.content"
              label="Content"
              :disabled="state.isLoading"
            />
          </div>
        </template>
        <template #rightBody>
          <div class="mb-3 text-info">
            <InputFlatPickr
              name="published_date"
              :model-value="state.formData.published_date"
              label="Publish Date"
              :config="{
                enableTime: true,
                dateFormat: 'Y-m-d H:i:S',
                time_24hr: false,
                defaultDate: new Date(new Date().getTime() + 10 * 60 * 1000),
              }"
              :disabled="state.isLoading"
            />
          </div>
          <div class="mb-3 text-info">
            <InputTextArea
              name="short_desc"
              v-model="state.formData.short_desc"
              label="Excerpt/Short Desc"
              :rows="4"
              placeholder="Tuliskan ringkasan singkat..."
              :disabled="state.isLoading"
            />
          </div>
          <div class="mb-3 text-info">
            <InputCheckboxGroup
              name="category_id"
              :categories="state.categories"
              :model-value="state.selectedCategories"
              :disabled="state.isLoading"
            />
          </div>
          <div class="mb-3">
            <InputTags
              name="tag"
              :disabled="state.isLoading"
              v-model="state.formData.tag"
            />
          </div>
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
  </Layout>
</template>
<style>
.width-500px {
  width: 500px;
}

.test {
  height: 100px;
}

.loading-overlay {
  position: relative;
}

.loading-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
  pointer-events: none;
}

/* Disable form interactions during loading */
.form-disabled {
  pointer-events: none;
  opacity: 0.7;
}
</style>
