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
import Empresa from '@/services/Empresa';

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
    mounted() {
        this.getEmpresas();
    },
    data(){
        return {
            series: [{
                data: [10,20,30,40,50]
            }],
            chartOptions: {
                chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: ['default','default2','default3','default4','default5'],
                }
            },
        };
    },
    methods: {
        getEmpresas(){
            Empresa().get("/?fields=id,nombre_comercial").then((response) => {
                this.chartOptions.xaxis.categories = [];
                response.data.data.filter(a => this.chartOptions.xaxis.categories.push(a.nombre_comercial));
                for (let i = 0; i < response.data.data.length; i++) {
                    this.getConceptos(response.data.data[i].id);
                }
            }).catch(e => {
                console.log(e);
            }); 
        },
        getConceptos(id){
            Empresa().get(`/${id}/conceptos/?limit=1`).then((response) => {
                this.series[0].data.push(response.data.totalCount);
            }).catch(e => {
                console.log(e);
            })
        }
    },
};
</script>