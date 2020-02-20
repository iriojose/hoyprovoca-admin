<template>
    <div>
        <v-card class="mt-10">
            <v-sheet
                class="v-sheet--offset mx-auto title text-center white--text py-5"
                dark
                elevation="12"
                max-width="calc(100% - 32px)"
            >
                Pedidos
            </v-sheet>

            <v-card-text>
                <v-data-table
                    no-results-text="No se encontraron resultados..."
                    :headers="headers"
                    :items="pedidos"
                    hide-default-footer
                >
                    <template v-slot:item.action="{ item }">
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                 <v-icon v-on="on" small class="mr-2" @click="call(item)"> 
                                    edit
                                </v-icon>
                            </template>
                            <span>pedidos</span>
                        </v-tooltip>

                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="call(item)"> 
                                    remove_red_eye
                                </v-icon>
                            </template>
                            <span>conceptos</span>
                        </v-tooltip>

                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="call(item)"> 
                                    remove_red_eye
                                </v-icon>
                            </template>
                            <span>Factura</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import Pedidos from '@/services/Pedidos';
import Empresa from '@/services/Empresa';

    export default {
        data() {
            return {
                empresas:[],
                pedidos:[],
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Estado', value: 'estado' },
                    { text: 'Estatus', value: 'rest_estatus_id' },
                    { text: 'Empresa', value: 'empresa' },
                    { text: 'Detalles', value: 'items' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        mounted() {
            this.getPedidos();
        },
        methods:{
            getEmpresas(pedidos){
                Empresa().get("/").then((response) =>  {
                    this.procees(pedidos,response.data.data);
                }).catch(e => {
                    console.log(e);
                });
            },
            getPedidos(){
                Pedidos().get("/?&after-rest_estatus_id=2&before-rest_estatus_id=7").then((response) => {
                    console.log(response);
                    response.data.data;
                    for (let i = 0; i < response.data.data.length; i++) {
                        response.data.data[i].items = response.data.data[i].detalles.length
                    }
                    this.getEmpresas(response.data.data);
                }).catch(e => {
                    console.log(e);
                });
            },
            procees(pedidos,empresas){
               pedidos.filter(a=> empresas.filter(b=> a.empresa_id==b.id ? a.empresa=b.nombre_comercial:null));
               this.empresas = empresas;
               this.pedidos = pedidos;
            },
            call(item){
                console.log(item);
            }
        }        
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