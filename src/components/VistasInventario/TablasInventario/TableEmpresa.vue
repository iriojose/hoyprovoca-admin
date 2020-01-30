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
            :items="empresas"
            class="elevation-0"
            :items-per-page="7"
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
import validations from '@/validations/validations';
import Empresa from '@/services/Empresa';
import {mapActions} from 'vuex';
import Snackbar from '@/components/helpers/Snackbar';

    export default {
        components:{
            Snackbar
        },
        data(){
            return {
                valid:false,
                loading:false,
                exito:null,
                error:null,
                empresas:[],
                dialog:false,
                editIndex:-1,
                showImage:'http://107.152.36.120/api/images/default.png',
                imagen:null,
                ...validations,
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Visualizar', value: 'visualizar' },
                    { text: 'posicion', value: 'posicion' },
                    { text: 'Imagen', value: 'imagen' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
            }
        },
        mounted() {
            this.getEmpresas();
        },
        computed: {
            title(){
                return this.editIndex == -1 ? 'Agregar':'Editar';
            }
        },
        methods: {
            ...mapActions(['setSnackbar']),

            getEmpresas(){
                Empresa().get("/").then((response) => {
                    this.empresas = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteEmpresa(item){
                Empresa().delete(`/${item.id}`).then((response) => {
                    console.log(response);
                    this.exito = 'Se elimino la empresa exitosamente.';
                    const index = this.empresas.indexOf(item);
                    this.empresas.splice(index,1);
                    this.setSnackbar(true);
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo eliminar esta empresa.';
                    this.setSnackbar(true);
                });
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar esta empresa?') && this.deleteEmpresa(item);
            },
            editedItem(item){
                console.log(item);
            },
            procesoImg(evt){
                if(evt){
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        this.showImage = e.target.result;
                        this.imagen = evt;
                    }
                    reader.readAsDataURL(evt);
                }
            },
        },
    }
</script>