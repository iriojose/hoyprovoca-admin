<template>
    <div>
        <v-card class="mt-5">
            <v-sheet
                class="v-sheet--offset mx-auto title text-center white--text py-5"
                dark
                elevation="12"
                max-width="calc(100% - 32px)"
            >
                Empresas
            </v-sheet>

            <v-card-text>
                <v-data-table
                    no-results-text="No se encontraron resultados..."
                    :headers="headers"
                    :items="empresas"
                    :items-per-page="5"
                    hide-default-footer
                >
                    <template v-slot:item.action="{ item }">
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                 <v-icon v-on="on" class="mr-2" @click="callPedidos(item)"> 
                                    shop
                                </v-icon>
                            </template>
                            <span>pedidos</span>
                        </v-tooltip>

                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" class="mr-2" @click="callConceptos(item)"> 
                                    remove_red_eye
                                </v-icon>
                            </template>
                            <span>conceptos</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
            <v-card width="100%" height="100%">
                <v-card-title class="color">
                    <v-btn icon @click="dialog=false">
                        <v-icon color="#005598" x-large>
                            keyboard_arrow_left
                        </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <div class="font-weight-bold title">
                        Pedidos
                    </div>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-divider></v-divider>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';

    export default {
        data(){
            return {    
                dialog:false,
                empresas:[],
                pedidos:[],
                conceptos:[],
                headers: [
                    {
                        text: 'Id',
                        align: 'left',
                        sortable: true,
                        value: 'id',
                    },
                    { text: 'Nombre', value: 'nombre_comercial'},
                    { text: 'Direccion', value: 'direccion'},
                    { text: 'Rif', value: 'rif'},
                    { text: 'Telefono', value: 'telefono'},
                    { text: 'Email', value: 'correo_electronico'},
                    {text: 'Acciones', value: 'action', sortable: false},
                ],
            }
        },
        mounted() {
            this.getEmpresas();
        },
        methods: {
            getEmpresas(){
                Empresa().get("/").then((response) => {
                    this.empresas=response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            getEmpresaPedidos(id){
                Empresa().get(`/${id}/pedidos`).then((response) => {
                    console.log(response.data.data);
                }).catch(e => {
                    console.log(e);
                });
            },
            getEmpresasConceptos(id){
                Empresa().get(`/${id}/conceptos`).then((response) => {
                    console.log(response.data.data);
                }).catch(e => {
                    console.log(e);
                });
            },
            callPedidos(item){
                this.dialog = true;
                this.getEmpresaPedidos(item.id);
            },
            callConceptos(item){
                this.dialog = true;
                this.getEmpresasConceptos(item.id);
            }
        },
    }
</script>

<style scope>
    .v-sheet--offset {
        top: -30px;
        position: relative;
    }

    .color{
        background-color: #f5f5f5;
    }
</style>