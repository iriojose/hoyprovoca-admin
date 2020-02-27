<template>
    <v-container class="mb-12">
        <v-row justify="center" align="center">
            <v-col cols="12" md="6" lg="4" sm="12" v-for="(stat,i) in stats" :key="i">
                <v-card :color="stat.color" elevation="10" height="150" width="100%">
                    <v-row justify="center" align="center" class="fill-height">
                        <v-col cols="12" sm="3" md="3">
                            <v-icon dark size="70">
                                {{stat.icon}}
                            </v-icon>
                        </v-col>
                        <v-col cols="12" sm="9" md="6">
                            <div class="text-center white--text font-weight-bold title">{{stat.text}}</div>
                            <div class="text-center white--text font-weight-bold title">{{stat.number}}</div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <v-col cols="12" md="6" sm="6">
                <v-hover v-slot:default="{hover}">
                    <v-card width="100%" height="380" :elevation="hover ? 15:0" color="#eee" class="pa-4">
                        <BarChart />
                    </v-card>
                </v-hover>
            </v-col>
            <v-col cols="12" md="6" sm="6">
                 <v-hover v-slot:default="{hover}">
                    <v-card width="100%" height="380" :elevation="hover ? 15:0" color="#eee">
                        <LineChart /> 
                    </v-card>
                </v-hover>
            </v-col>

            <v-col cols="12" md="6" sm="6" class="mt-12">
                <v-hover v-slot:default="{hover}">
                    <v-card width="100%" height="380" :elevation="hover ? 15:0" color="#eee" class="pa-4">
                        <BarChart /> 
                    </v-card>
                </v-hover>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="mt-12">
                 <v-hover v-slot:default="{hover}">
                    <v-card width="100%" height="380" :elevation="hover ? 15:0" color="#eee">
                        <PieChart /> 
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BarChart from '@/components/chartjs/BarChart';
import LineChart from '@/components/chartjs/LineChart';
import PieChart from '@/components/chartjs/PieChart';

    export default {
        components: {
            BarChart,
            LineChart,
            PieChart
        },
        data() {
            return {
                stats:[
                    {text:'Clientes',icon:'person',number:'500',color:'#303f9f'},
                    {text:'Pedidos',icon:'shopping_basket',number:'40',color:'#00796b'},
                    {text:'Utilidad',icon:'monetization_on',number:'30%',color:'#455a64'}
                ],
            }
        },
    }
</script>
