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
                        type: 'donut',
                    },
                    theme: {
                        monochrome: {
                            enabled: true,
                            color: '#255aee',
                            shadeTo: 'light',
                            shadeIntensity: 0.65
                        }
                    },
                    labels: ['Pedidos Iniciados', 'Pedidos Pendientes', 'Pedidos Completados'],
                    legend: {
                        show: true,
                        position: 'bottom',
                        horizontalAlign: 'center', 
                        fontSize: '14px',
                        fontFamily: 'Helvetica, Arial',
                        fontWeight: 400,
                        offsetX: 0,
                        offsetY: 0,
                        markers: {
                            width: 12,
                            height: 12,
                            strokeColor: '#232323',
                            radius: 12,
                            offsetX: 0,
                            offsetY: 0
                        },
                        itemMargin: {
                            horizontal: 5,
                            vertical: 0
                        },
                        onItemClick: {
                            toggleDataSeries: true
                        },
                        onItemHover: {
                            highlightDataSeries: true
                        },
                    },
                    noData: {
                        text: 'Not results',
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetX: 0,
                        offsetY: 0,
                        style: {
                            fontSize: '14px',
                        }
                    }
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
        color:#232323;
    }
</style>