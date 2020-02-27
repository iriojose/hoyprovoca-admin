<template>
    <div class="mb-12">
        <v-row justify="center" align="center">
            <v-col cols="12" md="3" sm="12">
                <v-select
                    :items="grupos"
                    label="Grupo"
                    dense
                    v-model="selectGrupo"
                    color="#005598"
                    hide-details
                    chips
                    item-text="nombre"
                    small-chips
                    hide-selected
                    return-object
                    @input="filGrupos($event)"
                    outlined
                ></v-select>
            </v-col>
            <v-col cols="12" md="3" sm="12">
                <v-select
                    dense
                    :disabled="selectGrupo == null ? true:false"
                    :items="subgruposSeleccionados"
                    color="#005598"
                    v-model="selectSubgrupo"
                    item-text="nombre"
                    return-object
                    chips
                    small-chips
                    label="SubGrupo"
                    hide-details
                    @input="filSubgrupos($event)"
                    hide-selected
                    outlined
                ></v-select>
            </v-col>
            <v-col cols="12" md="3" sm="12">
                <v-select
                    dense
                    :items="marcas"
                    color="#005598"
                    item-text="nombre"
                    v-model="selectMarca"
                    return-object
                    label="Marca"
                    chips
                    small-chips
                    hide-details
                    @input="filMarcas($event)"
                    hide-selected
                    outlined
                ></v-select>
            </v-col>
        </v-row>

        <v-data-table 
            :headers="headers" 
            :items="filtrado" 
            :loading="loading && '#005598'" 
            loading-text="Loading... please wait" 
            no-results-text="No se encontraron resultados..." 
            no-data-text="No se encontraron resultados..."
            class="elevation-0" 
        ></v-data-table>

        <v-toolbar color="#eee" elevation="0" class="mb-12">
            <v-spacer></v-spacer>
            <v-btn @click="exportPdf" depressed  elevation="0" class="text-capitalize mx-2" dark>
                Export Pdf
            </v-btn>
        </v-toolbar>
    </div>
</template>

<script>
import Grupos from '@/services/Grupos';
import SubGrupos from '@/services/SubGrupos';
import Marcas from '@/services/Marcas';
import Conceptos from '@/services/Conceptos';
import jsPDF from 'jspdf';
// eslint-disable-next-line
import autoTable from 'jspdf-autotable';

    export default {
        data() {
            return {
                loading:true,
                grupos:[],
                subgrupos:[],
                marcas:[],
                conceptos:[],
                filtrado:[],
                subgruposSeleccionados:[],
                selectGrupo:null,
                selectSubgrupo:null,
                selectMarca:null,
                headers: [
                    { text: 'Codigo', value: 'codigo' },
                    { text: 'Referencia', value: 'referencia' },
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Grupo', value: 'grupo' },
                    { text: 'Subgrupo', value: 'subgrupo' },
                    { text: 'Marca', value: 'marca' },
                    { text: 'Existencia', value: 'existencia'},
                    { text: 'Costo', value: 'costo'},
                    { text: 'Total', value: 'total'},
                ],
            }
        },
        mounted() {
            this.getConceptos();
        },
        methods:{
            getConceptos(){
                Conceptos().get("/").then((response) => {
                    this.conceptos = response.data.data;
                    this.getGrupos();
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                });
            },
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos = response.data.data;
                    this.conceptos.filter(a => this.grupos.filter(b => a.grupos_id==b.id ? a.grupo=b.nombre:null));
                    console.log(this.conceptos);
                    this.getSubgrupos();
                }).catch(e => {
                    console.log(e);
                });
            },
            getSubgrupos(){
                SubGrupos().get("/").then((response) => {
                    this.subgrupos = response.data.data;
                    this.conceptos.filter(a => this.subgrupos.filter(b => a.subgrupos_id==b.id ? a.subgrupo=b.nombre:null));
                    this.getMarcas();
                }).catch(e => {
                    console.log(e);
                });
            },
            getMarcas(){
                Marcas().get("/").then((response) => {
                    this.marcas = response.data.data;
                    this.conceptos.filter(a => this.marcas.filter(b => a.marcas_id==b.id ? a.marcas=b.nombre:null));
                    this.filtrado = this.conceptos;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });

            },
            filGrupos(evt){
                this.filtrado = this.conceptos.filter(a=>a.grupos_id==evt.id);
                this.subgruposSeleccionados = this.subgrupos.filter(a => a.grupos_id == evt.id);
            },  
            filSubgrupos(evt){
                this.filtrado = this.conceptos.filter(a=>a.subgrupos_id==evt.id);
            },
            filMarcas(evt){
                this.filtrado = this.conceptos.filter(a=>a.marcas_id==evt.id);
            },
            exportPdf(){
                var vm = this
                var fecha = new Date().toLocaleString();

                var columns = 
                [
                    {  title: 'Codigo', dataKey: 'codigo' },
                    {  title: 'Referencia', dataKey: 'referencia' },
                    {  title: 'Nombre', dataKey: 'nombre' },
                    {  title: 'Grupo', dataKey: 'grupo' },
                    {  title: 'Subgrupo', dataKey: 'subgrupo' },
                    {  title: 'Marca', dataKey: 'marca' },
                    {  title: 'Existencia', dataKey: 'existencia'},
                    {  title: 'Costo', dataKey: 'costo'},
                    {  title: 'Total', dataKey: 'total'},
                ];

                var doc = new jsPDF('p','pt');
                doc.text('Somos Sistemas', 250, 30);
                doc.autoTable(columns, vm.filtrado);
                doc.save('Productos '+fecha+'.pdf');
            },
        }
    }
</script>
