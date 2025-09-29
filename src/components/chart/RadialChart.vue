<script setup>
import VueApexCharts from "vue3-apexcharts";

const props = defineProps(['data', 'labels'])
const series = props.data ?? [50]
const chartOptions = {
    chart: {
        type: "radialBar",
        height: 1000,
    },
    plotOptions: {
        radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
                margin: 5,
                  size: '20%',
                  background: 'transparent',
            },
            track: {
                background: "#f2f2f2",
                strokeWidth: "100%",
            },
            dataLabels: {
                show: true,
                name: {
                    show: true,
                },
                value: {
                    show: true,
                    formatter: (val) => `${val}%`
                }
            },
            barLabels: {
                  enabled: true,
                  useSeriesColors: true,
                  offsetX: -20,
                  fontSize: '14px',
                  formatter: function(seriesName, opts) {
                    return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
                  },
                },
        },
    },
    stroke: {
        lineCap: "round",
        width: 20,
    },
    labels: props.labels ?? [],
    colors: ["#E38878", "#3F4D7E", "#38B2AC", "#F4C430"],
    
    responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                    show: true,
                    position: "left",
                    offsetX: 0,
                }
              }
            }],
}
</script>
<template>
    <div id="chart" class="flex-shrink-0">
        <VueApexCharts type="radialBar" :options="chartOptions" height="1000" :series="series" />
    </div>
</template>
