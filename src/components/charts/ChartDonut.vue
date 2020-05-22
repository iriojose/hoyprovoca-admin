<template>
    <div :class="$vuetify.breakpoint.smAndDown ? 'sombra mx-2':'sombra'">
        <v-card elevation="0" width="100%">
            <v-card-title class="color title font-weight-bold">
                Pedidos
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <apexchart 
                    type="donut" 
                    :options="chartOptions" 
                    :series="series"
                ></apexchart>
            </v-card-text>
        </v-card>
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
                        width: 400,
                        type: 'donut',
                    },
                    legend: {
                        position: 'bottom'
                    },
                    theme: {
                        monochrome: {
                            enabled: true,
                            color: '#255aee',
                            shadeTo: 'light',
                            shadeIntensity: 0.65
                        }
                    },
                    labels: ['Iniciados', 'Pendientes', 'Completados'],
                    /*responsive: [{
                        breakpoint: 450,
                        options: {
                            chart: {
                                width: 300
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }],*/
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