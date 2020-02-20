<template>
    <v-container>
        <v-form v-model="valid">
            <v-card elevation="0" color="#eee">
                <v-card-title>
                    <div class="title ">Nueva Factura</div>
                </v-card-title>
                <v-card-text>   
                    <v-row justify="center" align="center">
                        <v-col cols="12" md="3" sm="6" >
                            <v-text-field
                                color="#005598"
                                label="Nr. Factura" 
                                outlined
                                dense
                                v-model="factura.numero_factura"
                            />
                        </v-col>
                        <v-col cols="12" md="3" sm="6" >
                            <v-text-field
                                color="#005598"
                                label="Nr. Fiscal" 
                                outlined
                                dense
                                v-model="factura.numero_fiscal"
                            />
                        </v-col>
                        <v-col cols="12" md="3" sm="6" >
                            <v-select
                                label="Tarifa"
                                hide-selected
                                dense
                                color="#005598"
                                outlined
                                :items="tarifas"
                            />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="8" sm="12">
                            <v-card elevation="0" height="45" width="100%">
                                <v-card-title>
                                    Datos de la Factura
                                </v-card-title>
                            </v-card>
                            <v-row class="px-2">
                                <v-col cols="12" md="4" sm="12">
                                    <v-text-field
                                        color="#005598"
                                        label="Rif / Cedula" 
                                        outlined
                                        dense
                                        v-model="factura.numero_fiscal"
                                    />
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" md="4" sm="12">
                            
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="12" sm="12">
                            <v-card elevation="0" height="45" width="100%">
                                <v-card-title>
                                    Productos
                                </v-card-title>
                            </v-card>
                            <v-row class="px-2">
                                <v-col cols="12" md="3" sm="12">
                                    <v-text-field
                                        color="#005598"
                                        label="codigo" 
                                        outlined
                                        dense
                                        v-model="codigo"
                                        @change="searchConceptos($event)"
                                    />
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    
                    <v-row>
                        <v-col cols="12" md="12" sm="12">
                            <v-data-table
                                :headers="headers"
                                :items="detalles"
                                class="elevation-0"
                                no-data-text="No se encontraron resultados..."
                            >
                                <template v-slot:item.action="{ item }">
                                    <v-icon small @click="del(item)">delete</v-icon>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-btn @click="postFactura()" color="#005598" :disabled="valid" class="white--text text-capitalize" :loading="loading">
                                Guardar
                            </v-btn>
                            </div>
                        </template>
                        <span>Faltan campos por rellenar</span>
                    </v-tooltip>

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
        </v-form>

        <v-dialog v-model="dialog" width="800" class="pa-5">
            <v-data-table
                :headers="headers"
                :items="conceptos"
                class="elevation-0"
                no-data-text="No se encontraron resultados..."
            >
                <template v-slot:item.action="{ item }">
                    <v-icon small @click="push(item)">add</v-icon>
                </template>
            </v-data-table>
        </v-dialog>
    </v-container>
</template>

<script>
import router from '@/router';
import Factura from '@/services/Factura';
import Conceptos from '@/services/Conceptos';
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                ...validations,
                dialog:false,
                valid:false,
                loading:false,
                codigo:'',
                conceptos:[],
                tarifas:[
                    {text:'Tarifa A'},{text:'Tarifa B'},{text:'Tarifa C'}
                ],
                factura:{
                    numero_factura:'0000255',
                    numero_fiscal:'',
                    subtotal:'',
                    subtotal_dolar:''
                },
                detalles:[],
                headers: [
                    { text: 'id',align: 'left',value: 'id',},
                    { text: 'Codigo', value: 'codigo' },
                    { text: 'Referencia', value: 'referencia' },
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Precio', value: 'precio_a' },
                    { text: 'Acciones', value: 'action', sortable: false},
                ],
            }
        },
        methods: {
            back(){
                router.go(-1);
            },
            postFactura(){
                this.loading = true;
                Factura().post("/",{data:this.factura,data1:this.detalles}).then((response) =>  {
                    console.log(response.data);
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                });
            },
            searchConceptos(codigo){
                Conceptos().get(`/?codigo=${codigo}`).then((response) => {
                    console.log(response);
                    this.conceptos = response.data.data;
                    this.dialog = true;
                }).catch(e => {
                    console.log(e);
                    this.dialog = true;
                });
            },
            push(item){
                this.detalles.push(item);
            },
            del(item){
                const index = this.detalles.indexOf(item);
                this.detalles.splice(index,1);
            }
        },
    }
</script>

<style>
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