<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title>
                Nuevo Cargo
                <v-spacer></v-spacer>
                <slot name="close"></slot>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="!showMessage">
                <v-form v-model="valid">
                    <v-row justify="center">
                        <v-col cols="12" sm="12" md="12" class="mt-5">
                            <v-text-field
                                dense
                                label="cantidad"
                                hint="Numero positivos mayores a 0"
                                outlined
                                filled
                                color="#232323"
                                type="text"
                                v-model="data.cantidad"
                                :rules="[required('Cantidad'), positivo('Cantidad')]"
                            ></v-text-field>

                            <v-dialog v-model="dialog2" width="400" transition="dialog-bottom-transition">
                                <template v-slot:activator="{ on }" >
                                    <v-text-field
                                        v-on="on"
                                        label="Concepto"
                                        outlined
                                        filled
                                        hint="Concepto"
                                        persistent-hint
                                        v-model="concepto.nombre"
                                        :disabled="loading"
                                        color="#232323"
                                        dense
                                        class="mt-5"
                                        :rules="[required('Grupo')]"
                                    />
                                </template>
                                <v-card width="100%" class="pa-2">
                                    <v-card-actions>
                                        <v-btn 
                                            @click="getConceptos(user.data.adm_empresa_id)" 
                                            dark 
                                            class="mb-2 mx-2 text-capitalize caption" 
                                            color="#005598"
                                            :disabled="conceptos.length == total || loading ? true:false"
                                        >
                                            Ver más 
                                            <v-icon dark class="ml-2">mdi-chevron-right-box</v-icon>
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-text-field
                                            v-model="search"
                                            label="Buscar"
                                            single-line
                                            append-icon="mdi-magnify"
                                            type="text"
                                            color="#005598"
                                            hide-details
                                            dense
                                        />
                                    </v-card-actions>
                                    <v-card-text>
                                        <v-data-table
                                            :loading="loading && '#005598'" 
                                            loading-text="Loading... Please wait" 
                                            :headers="headers" 
                                            :items="conceptos"  
                                            :search="search"
                                            @click:row="changeConcepto($event)"
                                        >
                                            <template v-slot:item.imagen="{item}">
                                                <v-avatar size="50">
                                                    <v-img :src="image+item.imagen"></v-img>
                                                </v-avatar>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                        </v-col>

                        <v-btn 
                            block color="#232323" 
                            class="white--text text-capitalize" @click="postCargos"
                            :disabled="!valid"
                            :loading="loading"
                        >
                            Guardar
                        </v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-text v-else>
                <Message :color="color" :mensaje="mensaje" :icon="icon"></Message>
                <v-row justify="space-around" class="pt-5">
                    <div>
                        <v-btn tile @click="reset" color="#232323" 
                            class="white--text caption text-capitalize mx-2"
                            :disabled="error"
                        >
                            ¿ Crear otro Cargo ?
                        </v-btn>
                    </div>
                    <div><slot name="close2"></slot></div>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import Cargos from '@/services/Cargos';
import Empresa from '@/services/Empresa';
import Message from '@/components/mensajes/Message';
import variables from '@/services/variables_globales';
import validations from '@/validations/validations';
import {mapState} from 'vuex';

    export default {
        components:{
            Message
        },  
        props:{
            dialog:{
                type:Boolean,
                default:false
            },
        },
        data(){
            return {
                ...variables,
                ...validations,
                color:'',
                icon:'',
                mensaje:'',
                total:0,
                offset:0,
                error:false,
                showMessage:false,
                dialog2:false,
                loading:false,
                valid:false,
                search:'',
                data:{
                    cantidad:null,
                    adm_conceptos_id:null,
                    usuario_id:null,
                    adm_depositos_id: 1,
                    adm_empresa_id:null
                },
                concepto:{
                    nombre:''
                },
                conceptos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen',align:'center'},
                    { text: 'Nombre',sortable: true, value:'nombre'},
                ],
            }
        },
        mounted() {
            this.data.usuario_id = this.user.data.id;
            this.data.adm_empresa_id = this.user.data.adm_empresa_id;
            this.getConceptos(this.user.data.adm_empresa_id);
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
            }
        },
        computed:{
            ...mapState(['user'])
        },
        methods: {
            getConceptos(id){
                this.loading = true;
                Empresa().get(`/${id}/conceptos/?fields=id,imagen,nombre&limit=50&offset=${this.offset}&order=desc`).then((response) => {
                    response.data.data.filter(a => this.conceptos.push(a));
                    this.offset+=50;
                    this.total= response.data.totalCount;
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            postCargos(){
                this.loading = true;
                Cargos().post("/",{data:this.data}).then(() => {
                    this.loading = false;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Cargo creado.","#388E3C");
                }).catch(e => {
                    console.log(e);
                    this.error = true;
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
            changeConcepto(evt){
                this.data.adm_conceptos_id = evt.id;
                this.concepto = evt;
                this.dialog2 = false;
            },
            respuesta(icon,mensaje,color){
                this.color = color;
                this.icon = icon;
                this.mensaje = mensaje;
                this.showMessage = true;
            },
            reset(){
                this.error = false;
                this.showMessage = false;
                this.data.adm_conceptos_id = null;
                this.data.cantidad = null;
                this.concepto = { nombre:''};
            }
        },
    }
</script>
