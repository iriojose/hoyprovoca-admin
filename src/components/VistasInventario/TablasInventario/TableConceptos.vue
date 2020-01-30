<template>
    <v-container>
        <v-toolbar flat color="#fff">
            <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="dialog=!dialog">
                Nuevo
                <v-icon dark class="ml-2">
                    add_circle
                </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table
            :headers="headers"
            :items="conceptos"
            class="elevation-0"
            :loading="loading"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
        </v-data-table>

        <Snackbar :exito="exito" :error="error" />
    </v-container>
</template>

<script>
//import Grupos from '@/services/Grupos';
//import SubGrupos from '@/services/SubGrupos';
import Conceptos from '@/services/Conceptos';
//import Empresa from '@/services/Empresa';
//import validations from '@/validations/validations';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';

    export default {
        components: {
            Snackbar
        },
        data() {
            return {
                error:null,
                exito:null,
                loading:true,
                conceptos:[],
                headers: [
                    {text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Codigo', value: 'codigo' },
                    { text: 'Referencia', value: 'referencia' },
                    { text: 'Precio', value: 'precio_a' },
                    { text: 'Imagen', value: 'imagen' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        watch: {
            conceptos(){
                this.loading=false;
            }
        },
        mounted() {
            this.getConceptos();
        },
        methods: {
            ...mapActions(['setSnackbar']),

            getConceptos(){
                Conceptos().get("/").then((response) => {
                    this.conceptos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteConcepto(item){
                Conceptos().delete(`/${item.id}`).then((response) => {
                    console.log(response);
                    const index = this.conceptos.indexOf(item);
                    this.conceptos.splice(index,1);
                    this.exito = 'Se elimino el producto exitosamente.';
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo eliminar el Producto.';
                });
                this.setSnackbar(true);
            },
            editItem(item){
                this.error = null;
                this.exito = null;
                console.log(item);
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar este Producto?') && this.deleteConcepto(item);
            }
        },
    }
</script>