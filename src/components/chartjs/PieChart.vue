<template>
    <apexcharts
        width="100%"
        height="350"
        type="donut"
        :options="options"
        :series="series"
    ></apexcharts>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

    export default {
        components: {
            apexcharts: VueApexCharts
        },
        data() {
            return {
                options:{
                    chart: {
                        width: 350,
                        type: 'donut',
                        id: 'PieChart'
                    },
                    labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
                    dataLabels: {
                        dropShadow: {
                            blur: 3,
                            opacity: 0.5
                        }
                    },
                    theme: {
                        mode: 'light', 
                        palette: 'palette2', 
                        monochrome: {
                            enabled: false,
                            color: '#255aee',
                            shadeTo: 'light',
                            shadeIntensity: 0.65
                        },
                    }
                },
                series: [44, 55, 41, 17, 15],
            }
        }
    }
</script>