<template>
    <div>
        <div ref="printMe">
            <v-data-table 
                :headers="headers" 
                :items="conceptos" 
                :loading="loading && '#005598'" 
                loading-text="Loading... please wait" 
                no-results-text="No se encontraron resultados" 
                class="elevation-0" 
                :search="search">
            </v-data-table>
        </div>

        <v-toolbar color="#eee" elevation="0" class="mb-12">
            <v-spacer></v-spacer>
            <v-btn @click="exportPdf" depressed  elevation="0" class="text-capitalize mx-2" dark>
                Export Pdf
            </v-btn>
        </v-toolbar>

        <div>
            <div class="text-center">
                Somos sistemas
            </div>
        </div>
    </div>
</template>

<script>
import Conceptos from '@/services/Conceptos';
import jsPDF from 'jspdf';
// eslint-disable-next-line
import autoTable from 'jspdf-autotable';

    export default {
        data() {
            return {
                conceptos:[],
                search:'',
                loading:true,
                headers: [
                    { text: 'Codigo', value: 'codigo' },
                    { text: 'Referencia', value: 'referencia' },
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Precio', value: 'precio_a' },
                    { text: 'Utilidad', value: 'utilidad_a' },
                    { text: 'Costo', value: 'costo_mayor' },
                    { text: 'Imagen', value: 'imagen' },
                ],
            }
        },
        mounted(){
            this.getConceptos();
        },
        methods:{
            getConceptos(){
                Conceptos().get("/").then((response) => {
                    this.conceptos = response.data.data;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                })
            },
            exportPdf(){
                var vm = this
                var fecha = new Date().toLocaleString();

                var columns = [
                    { title: 'Codigo', dataKey: 'codigo' },
                    { title: 'Referencia', dataKey: 'referencia' },
                    { title: 'Nombre',dataKey: 'nombre' },
                    { title: 'Precio', dataKey: 'precio_a' },
                    { title: 'Utilidad', dataKey: 'utilidad_a' },
                    { title: 'Costo', dataKey: 'costo_mayor' },
                ];
                var doc = new jsPDF('p','pt');
                doc.text('Somos Sistemas', 250, 30);
                doc.autoTable(columns, vm.conceptos);
                doc.save('Productos '+fecha+'.pdf');
            },
        }        
    }
</script>
