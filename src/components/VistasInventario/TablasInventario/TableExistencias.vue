<template>
    <v-container>
        <v-toolbar flat color="#fff">
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
            :headers="headers"
            :items="conceptos"
            class="elevation-0"
            :search="search"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="crearMovimiento(item)">create</v-icon>
                <v-icon small class="mr-2" @click="editedItem(item)">add</v-icon>
            </template>
        </v-data-table>
        
        <v-dialog v-model="dialog" width="400" @MouseEvent="close">
            <v-card>
                <v-card-title class="color">
                    {{title}}
                    <v-spacer></v-spacer>
                    <v-icon @click="close">
                        cancel
                    </v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form v-model="valid" @submit.prevent="" class="px-5">
                        <v-row>
                            <v-col cols="12" md="12" sm="12">
                                <v-text-field 
                                    type="number"
                                    v-model="existencia"
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
                                    v-model="editItem.existencia"
                                    dense
                                    color="#005598"
                                    label="Existencia fisica"
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
                                        @click="save(editItem)"
                                    >
                                        Enviar
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <Snackbar :error="error" :exito="exito"/>
    </v-container>
</template>

<script>
import Conceptos from '@/services/Conceptos';
import Movimiento_deposito from '@/services/Movimiento_deposito';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';

    export default {
        components:{
            Snackbar
        },
        data(){
            return {
                error:null,
                exito:null,
                search:'',
                valid:false,
                dialog:false,
                loading:false,
                conceptos:[],
                existencia:0,
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Codigo',sortable: true, value: 'codigo' },
                    { text: 'Referencia',sortable: true, value: 'referencia' },
                    { text: 'Existencia minima',sortable: true, value: 'existencia_minima' },
                    { text: 'Existencia maxima',sortable: true, value: 'existencia_maxima' },
                    { text: 'Existencia',sortable: true, value: 'existencia' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                editIndex:-1,
                editItem:{
                    depositos_id:1,
                    conceptos_id:0,
                    existencia:0,
                },
                defaultItem:{
                    depositos_id:1,
                    conceptos_id:0,
                    existencia:0,
                }
            }
        },
        mounted() {
            this.getConceptos();
        },
        computed: {
            title(){
                return this.editIndex == -1 ? 'Crear movimiento de deposito':'Editar movimiento de deposito';
            }
        },
        methods: {
            ...mapActions(['setSnackbar']),

            getConceptos(){
                Conceptos().get("/").then((response) => {
                    for (let i = 0; i < response.data.data.length; i++) {
                        this.getConceptosExistencia(response.data.data[i]);
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
            getConceptosExistencia(item){
                Conceptos().get(`/${item.id}/depositos`).then((response) => {
                    item.existencia = response.data.data[0].existencia;
                    this.conceptos.push(item);
                }).catch(e => {
                    console.log(e);
                });
            },
            postMovimientoDepoito(item){
                Movimiento_deposito().post("/",{data:item}).then((response) => {
                    console.log(response);
                    this.exito="Se creo el movimiento de deposito exitosamente.";
                    this.setSnackbar(true);
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = "No se pudo crear el movimiento.";
                    this.setSnackbar(true);
                    this.close();
                });
            },
            updateMovimientoDeposito(item){
                const aux = item.existencia + this.existencia;
                Movimiento_deposito().post(`/${item.conceptos_id}`,{data:aux}).then((response) => {
                    console.log(response);
                    this.error = "se actualizo el movimiento exitosamente.";
                    this.setSnackbar(true);
                    this.editIndex = -1;
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = "No se pudo actualizar el movimiento.";
                    this.setSnackbar(true);
                    this.close();
                })
            },
            editedItem(item){
                this.existencia=item.existencia;
                this.editIndex = this.conceptos.indexOf(item);
                this.dialog = true;
                console.log(item);
            },
            crearMovimiento(item){
                this.dialog = true;
                console.log(item);
            },
            close(){
                this.dialog = false;
                this.existencia=0;
                setTimeout(() => { 
                    this.editIndex = -1;
                    this.editItem = Object.assign({},this.defaultItem);
                },300);               
            },
            save(item){
                this.error = null;
                this.exito = null;
                if(this.editIndex > -1){
                    this.updateMovimientoDeposito(item);
                }else{
                    this.updateMovimientoDeposito(item);
                }
            }
        },
    }
</script>

<style scope>
    .color{
        background: #eee;
    }
</style>