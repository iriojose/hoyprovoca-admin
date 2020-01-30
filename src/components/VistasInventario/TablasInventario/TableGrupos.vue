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
            :items="grupos"
            class="elevation-0"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
        </v-data-table>
        
        <Snackbar :error="error" :exito="exito" />
    </v-container>
</template>

<script>
import Grupos from '@/services/Grupos';
import validations from '@/validations/validations';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                valid:false,
                error:null,
                exito:null,
                ...validations,
                headers: [
                    {text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Visualizar', value: 'visualizar' },
                    { text: 'posicion', value: 'posicion' },
                    { text: 'Imagen', value: 'imagen' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                grupos:[],
            }
        },
        mounted() {
            this.getGrupos();
        },
        methods: {
            ...mapActions(['setSnackbar']),

            getGrupos(){//trae los grupos para enlistarlos
                Grupos().get("/").then((response) => {
                    this.grupos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteGrupos(item){//eliminar un grupo
                Grupos().delete(`/${item.id}`).then((response) =>{
                    console.log(response);
                    const index = this.grupos.indexOf(item);
                    this.grupos.splice(index, 1);
                    this.exito="Se elimino el grupo exitosamente.";
                }).catch(e => {
                    console.log(e);
                    this.error="No se pudo eliminar el grupo.";
                });
                this.setSnackbar(true);
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar este Grupo?') && this.deleteGrupos(item);
            },
            editItem(item){
                this.error = null;
                this.exito = null;
                this.setInventario(item);
                this.setDialogInventario(true);
            },
        },    
    }
</script>