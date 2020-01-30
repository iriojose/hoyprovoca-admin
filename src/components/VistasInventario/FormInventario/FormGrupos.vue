<template>
    <v-card width="100%" class="pa-5">
        <v-card-title>
            {{title}}
        </v-card-title>
        <v-card-text>
            <v-form v-model="valid" @submit.prevent="">
                <v-row>
                    <v-col cols="12" md="12" sm="12">
                        <v-card width="100%" height="220" class="pa-2" elevation="0">
                            <v-img height="200" contain :src="showImage" />
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-file-input
                            :rules="rules"
                            accept="image/png, image/jpeg"
                            placeholder="Seleccionar imagen"
                            prepend-icon="mdi-camera"
                            label="Imagen Grupo"
                            dense
                            @change="procesoImg($event)"
                            color="#005598"
                            v-model="imagen"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-text-field
                            label="Nombre"
                            v-model="item.nombre"
                            type="text"
                            clearable
                            outlined
                            color="#005598"
                            dense
                            counter="20"
                            :rules="[required('Nombre'), maxLength('Nombre',20), minLength('Nombre',2)]"
                        />
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn 
                                :dark="valid" 
                                :disabled="!valid" 
                                class="white--text caption text-capitalize"
                                @click="save"
                            >
                                Enviar
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
import Grupos from '@/services/Grupos';
import {mapActions} from 'vuex';
import validations from '@/validations/validations';

    export default {
        props:{
            item:{
                type:Object,
                default: () => ({
                    nombre:'',
                    visualizar:1,
                    posicion:1,
                    imagen:'default.png',
                })
            },
            operacion:{
                type:Number,
                default:0
            },
            exito:{
                type:String,
                default:null
            },
            error:{
                type:String,
                default:null
            },
            dialog:{
                type:Boolean,
                default:false
            },
            grupos:{
                type:Array,
                default: () => ([])
            }
        },
        data() {
            return {
                valid:false,
                imagen:null,
                showImage:'http://107.152.36.120/api/images/default.png',
                ...validations,
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
            }
        },
        computed: {
            title(){
                return this.operacion == 1 ? 'Agregar':'Editar';
            }
        },
        methods:{
            ...mapActions(['setSnackbar']),

            //LLAMADAS A LA API
            postGrupos(){
                Grupos().post("/",{data:this.item}).then((response) => {
                    console.log(response);
                    this.exito = 'Se creo el grupo exitosamente.';
                    this.grupos.push(this.item);
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo crear el grupo';
                });
                this.setSnackbar(true);
                this.dialog=false;
            },
            updateGrupos(){
                Grupos().post(`/${this.item.id}`,{data:this.item}).then((response) => {
                    console.log(response);
                    this.exito = 'Se actualizo el grupo exitosamente'
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo actualizar el grupo.';
                });
                this.setSnackbar(true);
                this.dialog=false;
            },
            procesoImg(evt){
                this.showImage=null;
                if(evt){
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        this.showImage = e.target.result;
                        this.imagen = evt;
                    }
                    reader.readAsDataURL(evt);
                }
            },
            save(){
                this.error = null;
                this.exito=null;
                if(this.operacion == 1){
                    this.postGrupos();
                }else if(this.operacion == 2){
                    this.updateGrupos();
                }
            }
        }
    }
</script>
