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
                <v-icon small class="mr-2" @click="editedItemSum(item)">add</v-icon>
                <v-icon small class="mr-2" @click="editedItemRest(item)">remove</v-icon>
            </template>
        </v-data-table>
        
        <v-dialog v-model="dialog" width="400" @MouseEvent="close">
            <v-card>
                <v-card-title class="color">
                    Actualizar
                    <v-spacer></v-spacer>
                    <v-icon @click="close">
                        cancel
                    </v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form v-model="valid" @submit.prevent="" class="pa-5">
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
                                    :rules="[positivo()]"
                                    clearable
                                    outlined
                                />
                            </v-col>
                            <v-col cols="12" md="12" sm="12" v-if="add == 1">
                                <v-textarea 
                                    label="Nota"
                                    filled
                                    color="#005598"
                                    v-model="nota"
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
import validations from '@/validations/validations';
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
                ...validations,
                nota:'',
                error:null,
                exito:null,
                search:'',
                valid:false,
                dialog:false,
                loading:false,
                conceptos:[],
                existencia:0,
                id:0,
                add:0,
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
                editItem:{
                    existencia:0,
                },
            }
        },
        mounted() {
            this.getConceptos();
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
            updateMovimientoDeposito(item){
                let aux=0;
                if(this.add == 1 ){
                    aux = Number.parseInt(this.existencia) - Number.parseInt(item.existencia);
                }else{
                    aux = Number.parseInt(item.existencia) + Number.parseInt(this.existencia);
                }
                Movimiento_deposito().post(`/${this.id}`,{data:{existencia:aux}}).then((response) => {
                    console.log(response);
                    this.updateLocal(this.id,aux);
                    this.exito= "se actualizo el movimiento exitosamente.";
                    this.setSnackbar(true);
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = "No se pudo actualizar el movimiento.";
                    this.setSnackbar(true);
                    this.close();
                })
            },
            updateLocal(id,monto){
                for (let i = 0; i < this.conceptos.length; i++) {
                    if(this.conceptos[i].id == id){
                        this.conceptos[i].existencia = monto+'.00';
                    }
                }
            },
            editedItemSum(item){
                this.existencia=item.existencia;
                this.id = item.id;
                this.dialog = true;
                this.add=2;
            },
            editedItemRest(item){
                this.existencia=item.existencia;
                this.id = item.id;
                this.dialog = true;
                this.add=1;
            },
            close(){
                this.dialog = false;
                this.loading=false;
                this.existencia=0;  
                this.add = 0;      
                this.editItem.existencia = 0;   
                this.nota='';  
            },
            save(item){
                this.loading = true;
                this.error = null;
                this.exito = null;
                this.updateMovimientoDeposito(item);
            }
        },
    }
</script>

<style scope>
    .color{
        background: #eee;
    }
</style>