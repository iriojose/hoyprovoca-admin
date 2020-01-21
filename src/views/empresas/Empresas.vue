<template>
    <div>
        <v-card class="mt-12">
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
    </div>
</template>

<script>
import Empresa from '@/services/Empresa';

    export default {
        data(){
            return {    
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
                this.getEmpresaPedidos(item.id);
            },
            callConceptos(item){
                this.getEmpresasConceptos(item.id);
            }
        },
    }
</script>

<style>
    .v-sheet--offset {
        top: -30px;
        position: relative;
    }
</style>