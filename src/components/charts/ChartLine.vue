<template>
    <div :class="$vuetify.breakpoint.smAndDown ? 'sombra mx-2':'sombra'">
        <v-card elevation="0" width="100%">
            <v-card-title class="color title font-weight-bold">
                Ganancias mensuales
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <apexchart 
                    type="line" 
                    :options="chartOptions" 
                    :series="series"
                ></apexchart>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
//import {mapState} from 'vuex';

    export default {
        components: {
            apexchart: VueApexCharts,
        },
        computed: {
            //...mapState(['series'])
        },
        data() {
            return {
                series: [{
                    name: "Ganancias",
                    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
                }],
                chartOptions: {
                    chart: {
                        height: 350,
                        type: 'line',
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    /*title: {
                        text: 'Product Trends by Month',
                        align: 'left'
                    },*/
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                                return "Bs "+value+',00';
                            }
                        },
                    },
                    theme: {
                        monochrome: {
                            enabled: true,
                            color: '#255aee',
                            shadeTo: 'light',
                            shadeIntensity: 0.65
                        }
                    },
                },
            }
        },
    }
</script>

<style lang="scss" scope>
    .sombra{
        /*box-shadow: 0px 0px 35px 80px (173, 185, 201, 0.8) !important;*/
        box-shadow: 0px 0px 35px 5px rgba(173, 185, 201,0.2);
    }
    .color{
        color:#3b61d1;
    }
</style>