<template>
    <div id="chart">
        <apexchart 
            type="pie" 
            width="100%"
            height="350"
            :options="chartOptions" 
            :series="series"
        >
        </apexchart>
    </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import {mapState} from 'vuex';

    export default {
        components: {
            apexchart: VueApexCharts,
        },
        computed: {
            ...mapState(['series'])
        },
        data() {
            return {
                chartOptions: {
                    chart: {
                        width: 350,
                        type: 'pie',
                    },
                    labels: ['Pedidos Iniciados', 'Pedidos Pendientes', 'Pedidos Completados'],
                    responsive: [{
                        breakpoint: 450,
                        options: {
                            chart: {
                                width: 300
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }],
                    theme: {
                        mode: 'light', 
                        palette: 'palette', 
                        monochrome: {
                            enabled: false,
                            color: '#D32F2F',
                            shadeTo: 'light',
                            shadeIntensity: 0.65
                        },
                    }
                },
            }
        },
    }
</script>