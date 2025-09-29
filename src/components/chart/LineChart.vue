<script>
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            chartOptions: this.getChartOptions(this.data)
        };
    },
    methods: {
        getCloseMarkers(seriesData, threshold = 5) {
            if(!seriesData || seriesData.series || seriesData.series.length < 2){
                return[];
            }
            const growthData = seriesData.series[0].data;
            const totalData = seriesData.series[1].data;
            const closeMarkers = [];

            growthData.forEach((value, index) => {
                const totalValue = totalData[index];
                if (Math.abs(value - totalValue) <= threshold) {
                    closeMarkers.push({
                        seriesIndex: 0,
                        dataPointIndex: index,
                        size: 0
                    });
                }
            });

            return closeMarkers;
        },
        getChartOptions(data) {
            const closeMarkers = this.getCloseMarkers(data, 10);

            return {
                chart: {
                    height: 350,
                    type: 'line',
                    stacked: false,
                    toolbar: {
                        show: false
                    }
                },
                markers: {
                    size: 7,
                    discrete: closeMarkers
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: [1],
                    style: {
                        colors: ['#404040']
                    },
                    dropShadow: {
                        enabled: true
                    }
                },
                colors: ['#289DDE', '#F3B94C'],
                stroke: {
                    width: 4
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        borderRadiusApplication: 'end',
                        dataLabels: {
                            position: 'top'
                        }
                    }
                },
                xaxis: {
                    categories: data?.xaxis
                },
                
                yaxis: [
                    {
                        seriesName: 'Growth',
                        show: false,
                        opposite: true,
                        axisTicks: {
                            show: true
                        },
                        axisBorder: {
                            show: true,
                            color: '#289DDE'
                        },
                        labels: {
                            style: {
                                colors: '#289DDE'
                            }
                        },
                        title: {
                            text: 'Growth',
                            style: {
                                color: '#289DDE'
                            }
                        }
                    },
                    {
                        seriesName: 'Total',
                        opposite: true,
                        axisTicks: {
                            show: true
                        },
                        axisBorder: {
                            show: true
                        },
                        labels: {
                            style: {
                                colors: '#F3B94C'
                            }
                        }
                    }
                ],
                tooltip: {
                    fixed: {
                        enabled: true,
                        position: 'topLeft',
                        offsetY: 30,
                        offsetX: 60
                    }
                },
                legend: {
                    horizontalAlign: 'left',
                    offsetX: 40
                },
                responsive: [
                    {
                        breakpoint: 1400,
                        options: {
                            yaxis: {
                                show: false
                            }
                        }
                    }
                ]
            };
        }
    },
    watch: {
        data: {
            handler(newData) {
                this.chartOptions = this.getChartOptions(newData);
            },
            deep: true
        }
    }
});
</script>

<template>
    <div id="chart" v-if="data && data.series">
        <apexchart type="line" height="350" :options="chartOptions" :series="data.series"></apexchart>
    </div>
</template>