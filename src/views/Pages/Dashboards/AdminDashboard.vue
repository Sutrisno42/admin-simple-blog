<script setup>
import Stats from "@/components/cards/Stats.vue";
import TableCard from "@/components/cards/TableCard.vue";
import RadialChart from "@/components/chart/RadialChart.vue";
import Layout from "@/layouts/Layout.vue";
import { useAuthStore } from "@/stores/auth";
import simplebar from "simplebar-vue";
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import ReportChart from "@/components/chart/ReportChart.vue";
import apiHealthygrain from "@/service/ApiHealthygrainService";


const authStore = useAuthStore();
const route = useRoute();
const state = reactive({
  dataID: route.params.id,
  result: {},
  isLoading: false,
  statsAcc: [],
  fullname: authStore.user?.fullname ?? null,
  username: authStore.user?.username ?? null,
  image: authStore.user?.image_url ?? null,
  role: authStore.user?.role.name ?? null,
});
const fetchData = async () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; // Months are zero-based
  const year = currentDate.getFullYear();
  const currentStasAcc = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
  await apiHealthygrain.get(`/visitors/article`).then((res) => {
    state.article = [...res.result.data].sort((a, b) => b.views - a.views);
    state.latest = res.result.data;
    state.totalArticle = res.result.meta.total;
  });
  await apiHealthygrain
    .get(`/visitors/last-30-days`, { params: { month, year } })
    .then((res) => {
      state.chart = res.result.last30DaysVisitors;
    });
  await apiHealthygrain.get(`/visitors/video`).then((res) => {
    state.video = res.result.data.sort((a, b) => b.view_count - a.view_count);
    state.totalVideo = res.result.meta.total;
  });

  await apiHealthygrain
    .get(`/view-accumulation/monthly`, {
      params: { month: currentStasAcc },
    })
    .then((res) => {
      state.statsAcc = res.view_percentages || [];
    });
  await apiHealthygrain.get(`/visitors/today`).then((res) => {
    state.today = res.result.visitorsToday;
  });
  await apiHealthygrain.get(`/visitors/month`).then((res) => {
    state.month = res.result.visitorsThisMonth;
  });
};

onMounted(() => {
  fetchData();
});
</script>
<template>
  <Layout>
    <div class="mb-2 mb-lg-2 pb-lg-1">
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-auto">
              <div class="avatar-lg">
                <img
                  v-if="state.image"
                  :src="state.image"
                  class="img-thumbnail rounded-circle"
                  alt="avatar"
                />

                <img
                  v-else
                  class="img-thumbnail rounded-circle"
                  src="@/assets/images/avatar-superadmin.png"
                  alt="Avatar"
                />
              </div>
            </div>
            <div class="col">
              <div class="p-2 pt-4 ps-0">
                <h3>{{ state.fullname }}</h3>
                <p class="text-uppercase">{{ state.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-3">
      <Stats
        :value="state.today"
        color="success"
        icon="ri-user-add-line"
        title="Visitor [Today]"
      />
      <Stats
        :value="state.month"
        color="info"
        icon="ri-user-heart-line"
        title="Visitor [This Month]"
      />
      <Stats
        :value="state.totalArticle"
        color="warning"
        icon="ri-file-list-3-line"
        title="Articles"
      />
      <Stats
        :value="state.totalVideo"
        color="primary"
        icon="ri-play-line"
        title="Videos"
      />
    </div>
    <div class="row">
      <!-- CHART LINE -->
      <div class="col-lg-8">
        <TableCard>
          <template #header>
            <h6 class="flex-grow-1 mb-0 text-muted text-uppercase">
              <i class="las la-history"></i> Visit/Hits (Last 30 Days)
            </h6>
          </template>
          <template #default>
            <div class="card-body table-responsive">
              <p v-if="state.isLoading"></p>
              <ReportChart :data="state.chart" />
              <!-- <p v-else class="text-center text-muted">No data available</p> -->
            </div>
          </template>
        </TableCard>
      </div>
      <!-- POPULAR ARTICLE -->
      <div class="col-lg-4">
        <TableCard>
          <template #header>
            <h6 class="flex-grow-1 mb-0 text-muted text-uppercase">
              <i class="las la-chart-area"></i> Popular Articles
            </h6>
            <div class="flex-shrink-0">
              <span class="text-muted">Last 30 Days</span>
            </div>
          </template>
          <template #default>
            <simplebar
              style="max-height: 310px; overflow: auto"
              auto-hide="false"
              track="primary"
            >
              <table class="table table-striped fs-12 mb-0" width="100%">
                <thead class="">
                  <tr>
                    <th>Article</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in state.article" :key="item.id">
                    <td>
                      <router-link
                        :to="{
                          name: 'article.detail-articles',
                          params: { slug: item.slug },
                        }"
                      >
                        {{ item.title }}
                      </router-link>
                    </td>
                    <td class="text-end fw-semibold">{{ item.views }}</td>
                  </tr>
                </tbody>
              </table>
            </simplebar>
          </template>
        </TableCard>
      </div>
    </div>

    <div class="row">
      <!-- SECTION STATS -->
      <div class="col-lg-4">
        <TableCard>
          <template #header>
            <h6 class="flex-grow-1 mb-0 text-muted text-uppercase">
              <i class="las la-chart-area"></i> Section Stats
            </h6>
            <div class="flex-shrink-0">
              <span class="text-muted">Last 30 Days</span>
            </div>
          </template>
          <template #default>
            <p v-if="state.isLoading">Loading...</p>
            <RadialChart
              v-if="state.statsAcc.length > 0"
              :data="state.statsAcc.map((item) => item.percentage)"
              :labels="state.statsAcc.map((item) => item.feature)"
            />
            <!-- <RadialChart v-else :data="state.statsAcc?.percentage" /> -->
          </template>
        </TableCard>
      </div>

      <!-- POPULAR VIDEO -->
      <div class="col-lg-4">
        <TableCard>
          <template #header>
            <h6 class="flex-grow-1 mb-0 text-muted text-uppercase">
              <i class="las la-chart-area"></i> Popular Videos
            </h6>
            <div class="flex-shrink-0">
              <span class="text-muted">Last 30 Days</span>
            </div>
          </template>
          <template #default>
            <simplebar
              style="max-height: 310px; overflow: auto"
              auto-hide="false"
              track="primary"
            >
              <table class="table table-striped fs-12 mb-0" width="100%">
                <thead class="">
                  <tr>
                    <th>Video</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in state.video" :key="item.id">
                    <td>
                      <router-link
                        :to="{ name: 'video.detail', params: { id: item.id } }"
                      >
                        {{ item.title }}
                      </router-link>
                    </td>
                    <td class="text-end fw-semibold">{{ item.view_count }}</td>
                  </tr>
                </tbody>
              </table>
            </simplebar>
          </template>
        </TableCard>
      </div>

      <!-- LATEST ARTICLES -->
      <div class="col-lg-4">
        <TableCard>
          <template #header>
            <h6 class="flex-grow-1 mb-0 text-muted text-uppercase">
              <i class="las la-chart-area"></i>Latest Articles
            </h6>
            <div class="flex-shrink-0">
              <span class="text-muted">Last 30 Days</span>
            </div>
          </template>
          <template #default>
            <simplebar
              style="max-height: 310px; overflow: auto"
              auto-hide="false"
              track="primary"
            >
              <table class="table table-striped fs-12 mb-0" width="100%">
                <thead class="">
                  <tr>
                    <th>Article</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in state.latest" :key="item.slug">
                    <td>
                      <router-link
                        :to="{
                          name: 'article.detail-articles',
                          params: { slug: item.slug },
                        }"
                      >
                        {{ item.title }}
                      </router-link>
                    </td>
                    <td class="text-end fw-semibold">{{ item.views }}</td>
                  </tr>
                </tbody>
              </table>
            </simplebar>
          </template>
        </TableCard>
      </div>
    </div>
  </Layout>
</template>
