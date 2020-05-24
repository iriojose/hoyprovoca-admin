<template>
    <div>
        <v-sheet color="grey" class="px-3 pt-3 mb-3" v-if="!usuarios">
            <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
        </v-sheet>
        <v-card width="100%" elevation="2" color="#fff" v-else>
            <v-card-title class="mb-2">
                <v-btn 
                    :height="35" color="#1c3faa"
                    class="radius font-weight-bold text-capitalize overline white--text" 
                >
                    Add new user
                </v-btn>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-text-field
                    dense
                    height="30"
                    :full-width="true"
                    single-line
                    hide-details
                    filled
                    class="foco"
                    v-model="search"
                    color="#1c3faa"
                    label="search..."
                    append-icon="mdi-magnify"
                >
                </v-text-field>
            </v-card-title>

            <v-data-table 
                :loading="loading && '#005598'" 
                loading-text="Loading... Please wait" 
                :headers="headers" 
                :items="usuarios" 
                class="elevation-0 noBorder theme--light v-table" 
                :search="search"
                :headers-length="60"
                
            >   
                <template v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="item in items" :key="item.name">
                            <td>
                                <v-avatar size="50">
                                    <v-img :src="image+item.imagen"></v-img>
                                </v-avatar>
                            </td>
                            <td>{{item.nombre}}</td>
                            <td>{{item.apellido}}</td>
                            <td>{{item.email}}</td>
                            <td>{{item.perfil}}</td>
                            <td align="center">
                                <div>
                                    <v-icon 
                                        :small="$vuetify.breakpoint.smAndDown ? false:true"
                                        @click="editar(item)" color="#232323"
                                    >
                                        mdi-pencil-box-outline
                                    </v-icon>
                                    <strong  @click="editar(item)" class="black--text mr-4">Edit</strong>
                                    <v-icon 
                                        :small="$vuetify.breakpoint.smAndDown ? false:true"
                                        @click="editar(item)" color="#E53935"
                                    >
                                        mdi-delete-sweep-outline
                                    </v-icon>
                                    <strong class="red--text mr-4" @click="editar(item)">Delete</strong>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </template>

                <!--template v-slot:item.imagen="{item}">
                    <v-avatar size="50">
                        <v-img :src="image+item.imagen"></v-img>
                    </v-avatar>
                </template-->
                
                <!--template v-slot:item.action="{ item }">
                    <div>
                        <v-icon 
                            :small="$vuetify.breakpoint.smAndDown ? false:true"
                            @click="editar(item)" color="#232323"
                        >
                            mdi-pencil-box-outline
                        </v-icon>
                        <strong  @click="editar(item)" class="black--text mr-4">Edit</strong>
                        <v-icon 
                            :small="$vuetify.breakpoint.smAndDown ? false:true"
                            @click="editar(item)" color="#E53935"
                        >
                            mdi-delete-sweep-outline
                        </v-icon>
                        <strong class="red--text mr-4" @click="editar(item)">Delete</strong>
                    </div>
                </template-->
            </v-data-table>
        </v-card>
    </div>      
</template>

<script>
import Usuario from '@/services/Usuario';
import variables from '@/services/variables_globales';

    export default {
        data() {
            return {
                ...variables,
                loading:false,
                search:'',
                tota:0,
                offset:0,
                usuarios:[],
                headers: [
                    { text: 'IMAGEN',align: 'center',value: 'imagen'},
                    { text: 'Nombre', value: 'nombre'},
                    { text: 'Apellido', value: 'apellido' },
                    { text: 'Email', value: 'email' },
                    { text: 'Perfil', value: 'perfil' },
                    { text: 'Acciones', align: 'center',value: 'action'},
                ],
            }
        },
        mounted() {
            this.getUsuarios();
        },
        methods:{
            getUsuarios(){
                this.loading = true;
                Usuario().get(`/?limit=50&offset=${this.offset}&order=desc`).then((response) => {
                    for (let i = 0; i < response.data.data.length; i++) {
                        if(response.data.data[i].perfil_id == 1){
                            response.data.data[i].perfil = 'Administrador';
                        }else if(response.data.data[i].perfil_id == 2){
                            response.data.data[i].perfil = 'Super usuario';
                        }else if(response.data.data[i].perfil_id == 3){
                            response.data.data[i].perfil = 'Cliente';
                        }else if(response.data.data[i].perfil_id == 4){
                            response.data.data[i].perfil = 'Bloqueado';
                        }else if(response.data.data[i].perfil_id == 5){
                            response.data.data[i].perfil = 'Repartidor';
                        }
                        this.usuarios.push(response.data.data[i]);
                    }
                    this.total = response.data.totalCount;
                    this.offset+=50;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            editIten(item) {
                console.log(item);
            }
        }
    }
</script>

<style lang="scss" >

    .sombra{
       /*box-shadow: 0px 0px 50px 20px (173, 185, 201, 0.9);*/
        box-shadow: 0px 0px 35px 5px rgba(173, 185, 201,0.2);
    }

    .fondo-table-body{
        background: #fff;
        height: 60px;
        margin-top:20px;
        margin-bottom:20px;
    }

    .fondo-table{
        background: #06c;
    }

    .radius{
        border-radius:5%;
    }

    .foco:focus{
        border:2px solid #06c !important;
    }

    .v-data-table table {
        border-spacing: 0 15px!important;
        background: #eeeeee;
    }

    .v-data-table table tr{
        background: #fff;
    }


    .noBorder.theme--light.v-data-table tbody tr:not(:last-child) td:last-child, .theme--light.v-data-table tbody tr:not(:last-child) td:not(.v-data-table__mobile-row) {
        border-bottom: thin solid transparent;
        
    }

    .v-table tr:hover:not(.v-table__expanded__content) {
        background: #fff !important;
        border-spacing: 0 15px;
    }
    
    .mytable table tr {
        background-color: #fff;
        margin-top:20px !important;
        margin-bottom:20px !important;
        border-bottom: none !important;
    }

    .theme--light.v-table tbody tr:not(:last-child) {
        border-bottom: none !important;
    }
</style>