<script setup>
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

// Utility imports
import { findMaxMinCount } from "@/utils/findMaxMin";
import { formatCustomDate } from "@/utils/formatDate";

// Props dari parent
const props = defineProps(["data"]);

// Fungsi untuk membuat opsi chart
const createChartOptions = (data) => {
  if (!data || data.length === 0) return {};
  const { max, min } = findMaxMinCount(data);

  return {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: data.map((_, index) => index + 1),
    },
    tooltip: {
      x: {
        formatter: (value) =>
          formatCustomDate(data[value - 1]?.date, "YYYY-MM-DD", "D MMM YYYY"),
      },
    },
    yaxis: {
      min: Math.floor(min.count),
      max: Math.ceil(max.count + 1),
    },
  };
};
</script>

<template>
  <div id="chart">
    <VueApexCharts
      v-if="props.data && props.data.length"
      type="line"
      height="350"
      :options="createChartOptions(props.data)"
      :series="[{ name: 'Visitor', data: props.data.map((val) => val.count) }]"
    />
  </div>
</template>
