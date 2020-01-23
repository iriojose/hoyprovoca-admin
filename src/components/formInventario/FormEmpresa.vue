<template>
    <v-form v-model="valid" @submit.prevent="">
        <v-row justify="center" align="center">
            <v-col cols="12" md="4" sm="12">
                <v-card elevation="5" class="pa-5" width="100%" height="500">
                    <v-row>
                        <v-col cols="12" md="12" sm="12">
                            <v-text-field
                                type="text"
                                color="#005598"
                                placeholder="http://somossistemas.com"
                                v-model="data.pag_web"
                                label="Pagina Web"
                                dense
                                outlined
                                clearable
                                :rules="[required('Pagina Web'),urlFormat()]"
                            >
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-btn 
                                block
                                color="#005598" 
                                width="100%" 
                                :dark="valid" 
                                :disabled="!valid" 
                                class="white--text caption"
                                @click="postEmpresa"
                            >
                                Enviar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import Empresa from '@/services/Empresa';
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                error:null,
                valid:false,
                imagen:null,
                showImage:null,
                snackbar:false,
                ...validations,
                data:{
                    rif:'',
                    razon_social:'',
                    nombre_comercial:'',
                    fecha_registro:Date(),
                    direccion:'',
                    telefono1:'',
                    telefono2:'',
                    telefono3:'',
                    pag_web:'',
                    correo_electronico:'',
                    correo_electronico2:'',
                    twitter:'',
                    instagram:'',
                    nota:'',
                    logo:'',
                    licencia_licores:0,
                    modelo:4,
                    serial_disk:''
                }
            }
        },
        methods: {
            postEmpresa(){
                Empresa().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                });
            }
        },
    }
</script>