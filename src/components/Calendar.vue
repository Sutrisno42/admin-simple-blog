<script setup>
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import ModalBasic from "./modal/ModalBasic.vue";
import Multiselect from "@vueform/multiselect";
import simplebar from "simplebar-vue";
import { useRoute } from "vue-router";
import { months, years } from "@/utils/getDate";
import apiClient from "@/service/ApiClientService";

const route = useRoute();
const calendarRef = ref(null);
const state = reactive({
  data: [],
  modal: false,
  confirm: false,
  selectedMonth: null,
  selectedYear: null,
});
const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "title",
    center: "",
    right: "prev next search",
  },
  customButtons: {
    search: {
      text: "",
      click: () => {
        state.modal = !state.modal;
      },
    },
  },
  initialView: "dayGridMonth",
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  dayHeaderFormat: { weekday: 'long' },
  height: 1800,
  width: 1000,
});

const fetchData = async () => {
  await apiClient.get("/blogs").then((res) => {
    state.data = res.result.data || [];
  });
};

onMounted(() => {
  fetchData();
  setTimeout(() => {
    const searchButton = document.querySelector(".fc-search-button");
    searchButton.innerHTML =
      '<i class="las la-calendar label-icon align-middle fs-14"></i>';
    searchButton.style.backgroundColor = "#f8f9fa";
    searchButton.style.color = "#000";
    searchButton.style.border = "#000"
  }, 100);
});

// Watch untuk memperbarui events pada calendarOptions
watch(
  () => state.data,
  (newData) => {
    calendarOptions.events = newData.map((item) => ({
      // id: item.id,
      title: item.title,
      start: item.published_date,
      // end: item.published_date,
      extendedProps: {
        slug: item.slug,
      },
    }));
  },
  { immediate: true }
);

const jumpToDate = () => {
  if (state.selectedMonth && state.selectedYear) {
    const targetDate = new Date(state.selectedYear, state.selectedMonth - 1, 1);
    if (calendarRef.value) {
      calendarRef.value.getApi().gotoDate(targetDate);
    }
    state.modal = false;
  }
};
</script>

<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar" ref="calendarRef" :options="calendarOptions">
        <template v-slot:dayHeaderContent="arg">
          <div class="day-header-content">
            <span :class="{ 'text-danger': arg.date.getDay() === 0, 'text-info': arg.date.getDay() !== 0 }">
              {{ arg.text }}
            </span>
          </div>
        </template>
        <template v-slot:dayCellContent="arg">
          <div class="ms-3">
            <span>{{ arg.dayNumberText }}</span>
          </div>
          <router-link :to="{ name: 'article.add-article' }">
            <i class="ms-2 las la-plus text-success"></i>
          </router-link>
        </template>
        <template v-slot:eventContent="arg">
          <!-- <simplebar style="max-height: 310px; overflow: auto;" auto-hide="false" track="primary">
          </simplebar> -->
          <router-link :to="{ name: 'article.detail-articles', params: { slug: arg.event.extendedProps.slug } }"
            class="text-decoration-none text-white">
              {{ arg.event.title }}
            </router-link>
        </template>
      </FullCalendar>
    </div>
  </div>

  <ModalBasic title="Jump To" titleClass="text-uppercase text-primary" :modelValue="state.modal" noClose
    @toggle="state.modal = $event">
    <template #modalBody>
      <form id="addCategory" class="row g-3" @submit.prevent="">
        <div class="col-md-6 border-bottom pb-3">
          <label class="form-label text-info" for="title">Month</label>
          <Multiselect required label="name" valueProp="id" placeholder="Select Month" :options="months"
            v-model="state.selectedMonth" />
        </div>
        <div class="col-md-6 border-bottom pb-3">
          <label class="form-label text-info" for="title">Year</label>
          <Multiselect required label="name" valueProp="id" placeholder="Select Year" :options="years"
            v-model="state.selectedYear" />
        </div>
      </form>
    </template>
    <template #modalFooter>
      <button type="button" class="btn btn-light btn-sm" @click="state.modal = !state.modal">
        Cancel
      </button>
      <button class="btn btn-info btn-sm" @click="jumpToDate" type="button">
        <!-- <i class="ri-check-line align-middle me-1"></i> -->
        Confirm
      </button>
    </template>
  </ModalBasic>
</template>
<style>
.demo-app-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Sesuaikan tinggi dengan viewport */
}

.demo-app-calendar {
  flex-grow: 1;
  overflow-y: auto;
  min-height: 500px;
  /* Bisa disesuaikan */
  max-height: 800px;
}

.simplebar-container {
  height: 900px;
  /* Sesuaikan tinggi sesuai kebutuhan */
  overflow: hidden;
}

.simplebar-content {
  max-height: 100%;
  overflow-y: auto;
  padding: 10px;
}

.fc-daygrid-day-top {
  justify-content: flex-end;

}

.fc-prev-button,
.fc-next-button {
  background-color: #0ab39c !important;
  color: white !important;
  border-radius: 5px !important;
  border: none !important;
  padding: 5px 10px !important;
}

.fc-prev-button:hover,
.fc-next-button:hover {
  background-color: #099885 !important;
  /* Warna lebih gelap saat hover */
}

.fc-event-title {
  white-space: normal !important;
  word-wrap: break-word !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  text-align: left !important;
  font-size: 11px !important;
  color: #ffffff !important;
  padding: 5px;
  border-radius: 4px;
  font-style: normal !important;
}

.fc-event {
  background-color: rgba(0, 123, 255, 0.8) !important;
  border-radius: 10px;
  font-style: normal !important;
}
</style>
