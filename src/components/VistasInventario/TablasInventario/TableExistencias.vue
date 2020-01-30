<template>
    <v-container>
        <v-toolbar flat color="#fff">
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                label="Buscar"
                single-line
                append-icon="search"
                type="text"
                color="#005598"
                hide-details
                dense
            />
        </v-toolbar>
        <v-data-table
            :headers="headers"
            :items="conceptos"
            class="elevation-0"
            :items-per-page="7"
            :search="search"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="verExistencia(item)">remove_red_eye</v-icon>
                <v-icon small class="mr-2" @click="editedItem(item)">add</v-icon>
            </template>
        </v-data-table>
        <Snackbar :error="error" :exito="exito"/>
    </v-container>
</template>

<script>
import Conceptos from '@/services/Conceptos';
//import Movimiento_deposito from '@/services/Movimiento_deposito';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';

    export default {
        components:{
            Snackbar
        },
        data(){
            return {
                error:null,
                exito:null,
                search:'',
                valid:false,
                dialog:false,
                loading:false,
                conceptos:[],
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Codigo',sortable: true, value: 'codigo' },
                    { text: 'Referencia',sortable: true, value: 'referencia' },
                    { text: 'Existencia minima',sortable: true, value: 'existencia_minima' },
                    { text: 'Existencia maxima',sortable: true, value: 'existencia_maxima' },
                    { text: 'Existencia',sortable: true, value: 'existencia' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                editIndex:-1,
            }
        },
        mounted() {
            this.getConceptos();
        },
        computed: {
            title(){
                return this.editIndex == -1 ? 'Agregar':'Editar';
            }
        },
        methods: {
            ...mapActions(['setSnackbar']),

            getConceptos(){
                Conceptos().get("/").then((response) => {
                    for (let i = 0; i < response.data.data.length; i++) {
                        this.getConceptosExistencia(response.data.data[i]);
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
            getConceptosExistencia(item){
                Conceptos().get(`/${item.id}/depositos`).then((response) => {
                    item.existencia = response.data.data[0].existencia;
                    this.conceptos.push(item);
                }).catch(e => {
                    console.log(e);
                });
            },
            editedItem(item){
                console.log(item);
            },
            verExistencia(item){
                console.log(item);
            }
        },
    }
</script>