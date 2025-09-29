<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Layout from "@/layouts/Layout.vue";
import TableCard from "@/components/cards/TableCard.vue";
import ReportChart from "@/components/chart/ReportChart.vue";
import TableHead from "@/components/datatables/partials/TableHead.vue";
import { formatCustomDate, getDateIndex } from "@/utils/formatDate";
import { handleError } from "@/handler/errorHandler";
import apiClient from "@/service/ApiClientService";

// --- Route Params & Query
const { slug } = useRoute().params;
const { month = "", year = "" } = useRoute().query;

// --- State
const state = reactive({
  result: {},
  reportsDaily: {},
  reportsMonth: {},
  chartData: {},
  isLoading: false,
});

// --- Table Columns
const columns = ref([
  { name: "date", label: "Date", sortable: false, width: "200px" },
  { name: "views", label: "Views", sortable: false, width: "100px" },
]);

const columns2 = ref([
  { name: "month/year", label: "Month/Year", sortable: false, width: "200px" },
  { name: "views", label: "Views", sortable: false, width: "100px" },
]);

// --- API Calls
const getReportDaily = async (par = {}) => {
  state.isLoading = true;

  const defaultParams = {
    slug,
    month: month || new Date().getMonth() + 1,
    year: year || new Date().getFullYear(),
  };

  const params = typeof par === "object" && par !== null ? par : {};

  try {
    const res = await apiClient.get(`/articles/${slug}/views/daily`, {
      params: { ...defaultParams, ...params },
    });

    state.reportsDaily = res.result;
    console.log("Daily Reports:", state.reportsDaily);
  } catch (error) {
    handleError(error);
  } finally {
    state.isLoading = false;
  }
};

const getReportMonth = async () => {
  try {
    const res = await apiClient.get(`/articles/${slug}/views/monthly`, {
      params: { slug },
    });

    state.reportsMonth = res.result;
    console.log("Monthly Reports:", state.reportsMonth);
  } catch (error) {
    handleError(error);
  }
};

// --- Lifecycle
onMounted(async () => {
  await getReportDaily();
  await getReportMonth();
});
</script>

<template>
  <Layout>
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header align-items-center">
            <h5 class="mb-0 text-muted text-uppercase">Daily Views</h5>
            <div class="">
              <router-link
                :to="{
                  name: 'article.detail-articles',
                  params: { slug: slug },
                }"
              >
                <i class="me-2 ri-file-list-3-line text-success"></i>
                <span
                  ><strong>{{ slug }}</strong></span
                >
              </router-link>
            </div>
          </div>
          <div class="card-body table-responsive">
            <p v-if="state.isLoading"></p>
            <ReportChart v-else :data="state.reportsDaily.data" />
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-header align-items-center">
            <h5 class="mb-0 text-muted text-uppercase">Statistics</h5>
          </div>
          <div class="card-body table-responsive">
            <table class="table nowrap align-middle fs-11 text-uppercase">
              <tr>
                <td>
                  <i class="ri-eye-line text-info"></i>
                  Views (ALL-TIME)
                </td>
                <td>
                  {{ state.reportsDaily.total_count }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <TableCard :no-body="false">
        <template #header>
          <h5 class="mb-0 text-muted text-uppercase">Report</h5>
        </template>
        <div class="row">
          <div class="col-md-4">
            <h4>Daily Views</h4>
            <hr />
            <table
              class="table nowrap table-bordered table-striped table-hover align-middle fs-11 text-uppercase"
            >
              <TableHead :columns="columns" />
              <tbody>
                <tr v-for="report in state.reportsDaily.data">
                  <td>
                    <i class="las la-calendar text-info me-1"></i>
                    {{
                      formatCustomDate(report.date, "YYYY-MM-DD", "D MMM YYYY")
                    }}
                  </td>
                  <td class="text-end">
                    {{ report.count }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-soft-info">
                  <td>
                    <strong>DAILY TOTAL</strong>
                  </td>
                  <td class="text-end">
                    {{ state.reportsDaily.total_count }}
                  </td>
                </tr>
                <tr class="bg-light">
                  <td>
                    <strong>DAILY AVERAGES</strong>
                  </td>
                  <td class="text-end">
                    {{ state.reportsDaily.averages }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="col-md-8">
            <h4>Monthly Report</h4>
            <hr />
            <table
              class="table nowrap table-bordered table-striped table-hover align-middle fs-11 text-uppercase"
            >
              <TableHead :columns="columns2" />
              <tbody>
                <tr v-for="report in state.reportsMonth.data">
                  <td>
                    <router-link
                      :to="{
                        query: {
                          year: getDateIndex(report.month, false),
                          month: getDateIndex(report.month, true),
                        },
                      }"
                    >
                      <i class="las la-calendar text-info me-1"></i>
                      <strong>
                        {{
                          formatCustomDate(report.month, "YYYY-MM", "MMM YYYY")
                        }}</strong
                      >
                    </router-link>
                  </td>
                  <td class="text-end">
                    {{ report.count }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-soft-info">
                  <td>
                    <strong>MONTHLY TOTAL</strong>
                  </td>
                  <td class="text-end">
                    {{ state.reportsMonth.total_count }}
                  </td>
                </tr>
                <tr class="bg-light">
                  <td>
                    <strong>MONTHLY AVERAGES</strong>
                  </td>
                  <td class="text-end">
                    {{ state.reportsMonth.averages }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <template #footer>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb text-uppercase mb-0 align-items-center">
              <li class="breadcrumb-item d-flex align-items-center">
                <i class="las la-arrow-left me-1 text-muted"></i>
                <router-link
                  :to="{ name: 'article.articles' }"
                  class="text-info fw-bold"
                >
                  Articles
                </router-link>
              </li>

              <li class="breadcrumb-item d-flex align-items-center">
                <router-link
                  :to="{
                    name: 'article.detail-articles',
                    params: { slug: slug },
                  }"
                  class="text-info fw-bold"
                >
                  Detail Article
                </router-link>
              </li>

              <li
                class="breadcrumb-item active fw-bold text-muted"
                aria-current="page"
              >
                Report Articles
              </li>
            </ol>
          </nav>
        </template>
      </TableCard>
    </div>
  </Layout>
</template>
