<template>
    <div>
        <AppBar />
        
        <v-row justify="center" align="center" class="pa-10">
            <v-col cols="12" md="12" sm="12"> 
                <v-card elevation="0" color="#eee" width="100%">
                    <v-card-title class="color2 white--text elevation-0">Productos</v-card-title>
                    <v-card-text>
                        <v-row class="px-10 py-5">
                            <v-col cols="12" md="4" sm="12">
                                <v-text-field 
                                    label="Codigo"
                                    dense
                                    v-model="codigo"
                                    color="#005598"
                                    outlined
                                    type="text"
                                    clearable
                                    @change="getConceptos($event)"
                                    :rules="[required('Codigo')]"
                                />
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="12">
                <v-form v-model="valid">
                    <v-data-table 
                        :headers="headers" 
                        :items="detalles" 
                        class="elevation-0" 
                        :loading="loading"
                        no-data-text="No se encontraron resultados"
                        no-results-text="No se encontraron resultados"
                    >
                        <template v-slot:item.cantidad="{ item }">
                            <v-text-field 
                                class="mt-4"
                                label="Cantidad"
                                dense
                                v-model="item.precio_b"
                                color="#005598"
                                outlined
                                type="number"
                                :rules="[required('Cantidad'),positivo('Cantidad')]"
                            />
                        </template>
                        <template v-slot:item.action="{ item }">
                            <v-icon @click="del(item)">cancel</v-icon>
                        </template>
                    </v-data-table>
                </v-form>
            </v-col>

            <v-col cols="12" md="12" sm="12">
                <v-card elevation="0" color="#eee">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="postCargos()" color="#005598" :disabled="!valid" class="white--text text-capitalize" :loading="loading">
                            Guardar
                        </v-btn>

                    <v-hover v-slot:default="{hover}">
                        <v-btn :elevation="hover ? 3:0" @click="back" class="mx-2 text-capitalize">
                            Cancerlar
                            <v-icon>
                                block
                            </v-icon>
                        </v-btn>
                    </v-hover>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialog" width="800" class="pa-5">
            <v-data-table 
                :headers="headers" 
                :items="conceptos" 
                class="elevation-0" 
                :loading="loading"
                no-data-text="No se encontraron resultados"
                no-results-text="No se encontraron resultados"
            >
                <template v-slot:item.action="{ item }">
                    <v-icon @click="add(item)">add_circle</v-icon>
                </template>
            </v-data-table>
        </v-dialog>

        <Snackbar :error="error" :exito="exito"/>
        <Footer />
    </div>
</template>

<script>
import AppBar from '@/components/navbar/AppBar';
import Footer from '@/components/footer/Footer';
import Cargos from '@/services/Cargos';
import Conceptos from '@/services/Conceptos';
import validations from '@/validations/validations';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';
import router from '@/router';

    export default {
        components:{
            AppBar,
            Footer,
            Snackbar,
        },
        data() {
            return {
                ...validations,
                codigo:'',
                exito:null,
                error:null,
                loading:false,
                dialog:false,
                existencia:{},
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id'},
                    { text: 'Codigo',sortable: true, value: 'codigo'},
                    { text: 'Referencia',sortable: true, value: 'referencia'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Precio' , sortable:true, value:'precio_a'},
                    { text: 'Cantidad', sortable:true, value: 'cantidad'},
                    { text: 'Acciones', value: 'action', sortable: false},
                ],
                conceptos:[],
                cargo:{
                    fecha_at:new Date().toLocaleString(),
                    conceptos_id:0,
                    depositos_id:1,
                    cantidad:0,
                    usuario_id:16
                },
                default:{
                    fecha_at:new Date().toLocaleString(),
                    conceptos_id:0,
                    depositos_id:1,
                    cantidad:0,
                    usuario_id:16
                }
            }
        },        
        methods:{
            ...mapActions(['setSnackbar']),

            postCargos(){
                Cargos().post("/",{data:this.cargo}).then((response)  => {
                    console.log(response.data);
                    this.exito= "Se creo el cargo exitosamente.";
                    this.setSnackbar(true);
                    this.back();
                }).catch(e  => {
                    console.log(e);
                    this.error = "No se pudo crear el cargo.";
                    this.setSnackbar(true);
                });
            },
            getConceptosDeposito(id){
                Conceptos().get(`/${id}/depositos`).then((response) => {
                    this.existencia = response.data.data[0];
                }).catch(e => {
                    console.log(e);
                });
            },
            getConceptos(evt){
                this.dialog = true;
                this.loading = true;
                Conceptos().get(`/?codigo=${evt}`).then((response) => {
                    this.conceptos = response.data.data;
                    this.loading = false;
                }).catch(e =>{
                    console.log(e);
                })
            },
            add(item){
                this.detalles.push(item);
                this.cargo.conceptos_id = item.id;

            },
            del(item){
                const index = this.detalles.indexOf(item);
                this.detalles.splice(index,1);
            },
            back(){
                setTimeout(() => {
                    router.go(-1);
                },2000);
            },
        }
    }
</script>

<style scope>
    .color2{
        background-color: #303F9F;
    }
    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }
    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>