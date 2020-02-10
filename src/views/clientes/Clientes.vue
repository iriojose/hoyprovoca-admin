<template>
    <div>
        <v-card class="mt-10">
            <v-sheet
                class="v-sheet--offset mx-auto title text-center white--text py-5"
                dark
                elevation="12"
                max-width="calc(100% - 32px)"
            >
                Clientes
            </v-sheet>

            <v-card-text>
                <v-data-table 
                    no-results-text="No se encontraron resultados..."
                    :headers="headers"
                    :items="clientes"
                    hide-default-footer
                >
                    <template v-slot:item.action="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="pedidosUsuario(item)"> 
                                    shop
                                </v-icon>
                            </template>
                            <span>Pedidos</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="perfilUsuario(item)"> 
                                    account_circle
                                </v-icon>
                            </template>
                            <span>Perfil</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>

        <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
            <v-card width="100%" height="100%">
                <v-card-title class="color">
                    <v-btn icon @click="dialog=false">
                        <v-icon color="#005598" x-large>
                            keyboard_arrow_left
                        </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <div class="title font-weight-bold" v-show="opc==1">Pedidos</div>
                    <div class="title font-weight-bold" v-show="opc==2">Perfil</div>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-divider></v-divider>

                <v-card-text>
                    <PedidosUsuario v-if="opc==1" :usuario="usuario"/>
                    <PerfilUsuario v-else-if="opc==2" :usuario="usuario"/>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
//import Usuario from '@/services/Usuario';
import PedidosUsuario from '@/components/vistaClientes/PedidosUsuario';
import PerfilUsuario from '@/components/vistaClientes/PerfilUsuario';

    export default {
        components:{
            PerfilUsuario,
            PedidosUsuario
        },
        data(){
            return {
                opc:0,
                usuario:null,
                dialog:false,
                clientes: [
                    {
                        id:16,
                        nombre:'Irio',
                        apellido:'Gómez',
                        email:'iriojgomezv@gmail.com',
                        login:'iriojose',
                    }
                ],
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Apellido', value: 'apellido' },
                    { text: 'Email', value: 'email' },
                    { text: 'Usuario', value: 'login' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
            }
        },
        methods:{
            /*getUsuarios(){
                Usuario().get("/").then((response) => {
                    this.clientes = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            }*/

            pedidosUsuario(item){
                this.opc = 1;
                this.usuario = item;
                this.dialog = true;
            },
            perfilUsuario(item){
                this.opc = 2;
                this.usuario = item;
                this.dialog = true;
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