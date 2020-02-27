<template>
    <v-container>
        <v-toolbar flat color="#fff">
            <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="getConceptos">
                Nuevo
                <v-icon dark class="ml-2">
                    add_circle
                </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                label="Buscar"
                single-line
                append-icon="search"
                type="text"
                color="#005598"
                hide-details
                dense
            />
        </v-toolbar>
        <v-data-table 
            :loading="loading && '#005598'" loading-text="Loading... Please wait" :headers="headers" :items="cargos" class="elevation-0" :search="search" no-results-text="No se encontraron resultados"
        ></v-data-table>

        <v-dialog v-model="dialog" width="900" class="pa-10">
            <v-data-table 
                :loading="loading && '#005598'" loading-text="Loading... Please wait" :headers="headers2" @click:row="pushCargo($event)" :items="conceptos" class="elevation-0" :search="search" no-results-text="No se encontraron resultados"
            ></v-data-table>
        </v-dialog>
        
        <v-dialog v-model="dialog1" width="400" :persistent="loading">
            <v-card>
                <v-card-title class="color">
                    Añadir cargo
                    <v-spacer></v-spacer>
                    <v-icon @click="dialog1 = !dialog1">cancel</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form v-model="valid" @submit.prevent="" class="pa-5" v-if="!loading">
                        <v-row>
                            <v-col cols="12" md="12" sm="12">
                                <v-text-field 
                                    type="number"
                                    v-model="existencia.existencia"
                                    dense
                                    color="#005598"
                                    label="Existencia Actual"
                                    disabled
                                    outlined
                                />
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-text-field 
                                    type="number"
                                    v-model="cargo.cantidad"
                                    dense
                                    color="#005598"
                                    label="Existencia fisica"
                                    :rules="[positivo()]"
                                    clearable
                                    outlined
                                />
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn 
                                        :dark="valid" 
                                        :disabled="!valid" 
                                        :loading="loading"
                                        class="white--text caption text-capitalize"
                                        @click="postCargos(cargo)"
                                    >
                                        Enviar
                                        <template v-slot:loader>
                                            <span class="custom-loader">
                                                <v-icon light>cached</v-icon>
                                            </span>
                                        </template> 
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-row>
                    </v-form>

                    <v-row v-else justify="center" align="center">
                        <v-col cols="12" md="12" sm="12">
                            <v-div class="text-center">
                                <div class="font-weight-black subtitle-2">Loading... Please wait</div>
                                <v-img contain width="200" height="200" :src="require('@/assets/loading.svg')" />
                            </v-div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <Snackbar :error="error" :exito="exito"/>
    </v-container>
</template>

<script>
import Cargos from '@/services/Cargos';
import Conceptos from '@/services/Conceptos';
import validations from '@/validations/validations';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                search:'',
                error:null,
                exito:null,
                dialog:false,
                dialog1:false,
                valid:false,
                loading:true,
                ...validations,
                existencia:{
                    existencia:0,
                },
                cargos:[],
                conceptos:[],
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Fecha',sortable: true, value: 'fecha_at'},
                    { text: 'Concepto',sortable: true, value: 'conceptos_id' },
                    { text: 'Cantidad',sortable: true, value: 'cantidad' },
                    { text: 'Usuario',sortable: true, value: 'usuario_id' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                headers2: [
                    { text: 'Id',align: 'left',sortable: true,value:'id'},
                    { text: 'Codigo',sortable: true, value: 'codigo'},
                    { text: 'Referencia',sortable: true, value: 'referencia'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                    { text: 'Precio' , sortable:true, value:'precio_a'},
                    { text: 'Costo' , sortable:true, value:'ultimo_costo'},
                    { text: 'Costo' , sortable:true, value:'costo_mayor'},
                ],
                cargo:{ 
                    fecha_at:new Date().toLocaleString(),
                    conceptos_id:0,
                    depositos_id:1,
                    cantidad:0,
                    usuario_id:3
                },
            }
        },
        mounted(){
            this.getCargos();
        },
        watch: {
            dialog1(){
                if(!this.dialog1){
                    this.dialog1 = false;
                    this.loading = false;
                    this.cargo.cantidad = 0;
                }
            }
        },
        methods:{
            ...mapActions(['setSnackbar']),

            getCargos(){
                Cargos().get("/").then((response) => {
                    this.cargos = response.data.data;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                });
            },
            postCargos(cargo){
                this.loading = true;
                console.log(cargo);
                Cargos().post("/",{data:cargo}).then((response) => {
                    console.log(response);
                    this.cargos.push(cargo);
                    this.exito= "Se creo el cargo exitosamente.";
                    this.setSnackbar(true);
                    this.dialog1=false;
                }).catch(e => {
                    console.log(e);
                    this.error = "No se pudo crear el cargo.";
                    this.setSnackbar(true);
                    this.dialog1=false;
                });
            },
            getConceptos(){
                this.loading = true;
                this.dialog = true;
                Conceptos().get("/").then((response) => {
                    this.conceptos = response.data.data;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                });
            },
            getConceptosDeposito(id){
                this.loading = true;
                Conceptos().get(`/${id}/depositos`).then((response) => {
                    this.existencia = response.data.data[0];
                    this.cargo.conceptos_id = id;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                });
            },
            pushCargo(item){
                this.dialog = false;
                this.dialog1 = true;
                this.getConceptosDeposito(item.id);
            }
        }
    }
</script>

<style scope>
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