<template>
    <apexcharts
        width="100%"
        height="350"
        type="bar"
        :options="chartOptions"
        :series="series"
    ></apexcharts>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
    components: {
        apexcharts: VueApexCharts
    },
    props:{
        pedidos:{
            type:Array,
            default:() => ([])
        }
    },
    mounted(){//toISOString().substr(0, 10);
        this.mes = new Date().getMonth();
        console.log(this.mes);
    },
    data(){
        return {
            mes:null,
            meses:[
                {text:'Ene'},{text:'Feb'},{text:'Mar'},{text:'Abr'},{text:'May'},{text:'Jun'},
                {text:'Jul'},{text:'Ago'},{text:'Sep'},{text:'Oct'},{text:'Nov'},{text:'Dic'}
            ],
            chartOptions: {
                chart: {
                    id: "barChart",
                    animations: {
                        speed: 200
                    }
                },
                title: {
                    text: 'Pedidos Completados',
                    align: 'left'
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                        distributed: true
                    }
                },
                xaxis: {
                    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May']
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
            series: [
                {
                    name: "Pedidos",
                    data: [30, 40, 45, 30, 49]
                }
            ],
        };
    },
};
</script>