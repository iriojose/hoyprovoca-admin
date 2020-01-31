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
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import Pedidos from '@/services/Pedidos';

    export default {
        data() {
            return {
                pedidos:[],
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Estado', value: 'estado' },
                    { text: 'Estatus', value: 'rest_estatus_id' },
                    { text: 'Detalles', value: 'items' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        mounted() {
            this.getPedidos();
        },
        methods:{
            getPedidos(){
                Pedidos().get("/?&after-rest_estatus_id=2&before-rest_estatus_id=7").then((response) => {
                    console.log(response);
                    this.pedidos = response.data.data;
                    for (let i = 0; i < this.pedidos.length; i++) {
                        this.pedidos[i].items = this.pedidos[i].detalles.length
                    }
                }).catch(e => {
                    console.log(e);
                });
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