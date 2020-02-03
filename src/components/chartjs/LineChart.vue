<template>
    <apexcharts
        width="100%"
        height="350"
        type="line"
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
                options : {
                    chart: {
                        height: 350,
                        type: 'line',
                        id: 'LineChart'
                        
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    title: {
                        text: 'Ganancias',
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'],
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: ['Oct', 'Nov', 'Dic', 'Ene', 'Feb','Mar'],
                    }
                },
                series: [
                    {
                        name: "Dolares",
                        data: [10, 41, 35, 51, 49, 62]
                    }
                ],
            }
        }, 
    }
</script>