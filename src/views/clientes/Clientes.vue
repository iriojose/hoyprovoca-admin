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
                                <v-icon v-on="on" small class="mr-2" @click="call(item)"> 
                                    shop
                                </v-icon>
                            </template>
                            <span>Pedidos</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="call(item)"> 
                                    account_circle
                                </v-icon>
                            </template>
                            <span>Perfil</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
//import Usuario from '@/services/Usuario';

    export default {
        data(){
            return {
                clientes: [
                    {
                        id:1,
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