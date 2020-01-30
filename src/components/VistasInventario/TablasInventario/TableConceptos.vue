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
                <v-icon small class="mr-2" @click="editedItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
        </v-data-table>


        <Snackbar :error="error" :exito="exito" />
    </v-container>
</template>

<script>
import Conceptos from '@/services/Conceptos';
import Snackbar from '@/components/helpers/Snackbar';
import validations from '@/validations/validations';
import {mapActions} from 'vuex';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                valid:false,
                dialog:false,
                loading:false,
                error:null,
                exito:null,
                search:'',
                showImage:'http://192.168.0.253:81/api/images/default.png',
                imagen:null,
                editIndex: -1,
                conceptos:[],
                ...validations,
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Codigo', value: 'codigo' },
                    { text: 'Referencia', value: 'referencia' },
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Precio', value: 'precio_a' },
                    { text: 'Utilidad', value: 'utilidad_a' },
                    { text: 'Costo', value: 'costo_mayor' },
                    { text: 'Imagen', value: 'imagen' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
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
                    this.conceptos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteConceptos(item){
                Conceptos().delete(`/${item.id}`).then((response)  => {
                    console.log(response);
                    this.error = "Se elimino el concepto exitosamente.";
                    this.setSnackbar(true);
                    const index = this.conceptos.indexOf(item);
                    this.conceptos.splice(index,1);
                }).catch(e  => {
                    console.log(e);
                    this.error = "No se pudo eliminar este concepto";
                    this.setSnackbar(true);
                });
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar este Concepto?') && this.deleteConceptos(item);
            },
            editedItem(item){
                console.log(item);
            }
        },
    }
</script>

<style scope>
    .color{
        background: #eee;
    }
</style>