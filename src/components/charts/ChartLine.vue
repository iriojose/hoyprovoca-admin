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

    export default {
        components: {
            apexchart: VueApexCharts,
        },
        mounted() {
            let resta = 1000 * 60 * 60  * 24 * 30;
            let fecha = new Date();
            let date = fecha.getTime();

            for (let i = 0; i < 5; i++) {
                if(i !== 0)  date -= resta;
                for (let e = 0; e < this.meses.length; e++) {
                    if(new Date(date).getMonth() == e) {
                        this.chartOptions.xaxis.categories[i] = this.meses[e];
                    }
                }
            }
            this.chartOptions.xaxis.categories.reverse();
        },
        computed: {
            
        },
        data() {
            return {
                mes:null,
                meses:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
                numMeses:[],
                series: [{
                    name: "Ganancias",
                    data: [10, 41, 35, 51,50]
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
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'],
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: ['','','','',''],
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