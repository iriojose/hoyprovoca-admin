<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Eliminar producto
                <v-spacer></v-spacer>
                <!-- boton de salir -->
                <v-scroll-x-transition>
                    <slot name="salir" v-if="showMessage && !loading"></slot>
                </v-scroll-x-transition>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <!-- mensajes -->
                <v-card elevation="0" height="50" class="mt-5">
                    <v-scroll-x-transition>
                        <v-alert border="left" colored-border elevation="2"  dense :type="type" v-show="showMessage">
                            {{mensaje}}
                        </v-alert>
                    </v-scroll-x-transition> 
                </v-card>
                
                <div class="text-center title font-weight-black py-5">
                    ¿Seguro que quiere eliminar este Producto? 
                </div>

                <v-row justify="space-around" class="py-5">
                    <v-btn 
                        elevation="3" color="#232323" 
                        class="text-capitalize white--text" 
                        @click="getFactured()" :loading="loading"
                        :disabled="$parent.eliminado"
                    >
                        Sí, seguro
                    </v-btn>
                    
                    <slot name="close"></slot>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import Conceptos from '@/services/Conceptos';

    export default {
        props:{
            dialog:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                type:'error',
                mensaje:'',
                showMessage:false,
                loading:false,
            }
        },
         watch:{
            dialog(){
                if (!this.dialog) setTimeout(() => {this.showMessage = false},400);
            }
        },
        methods:{
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
            },
            getFactured(){//se determina si el concepto ha sido facturado
                this.loading = true;
                Conceptos().get(`/${this.$parent.bandera.id}/issold`).then((response) => {
                    if(response.data.isSold){
                        this.respuesta("Este producto ha sido facturado, no se puede eliminar","error");
                    }else{
                        this.deleteConcepto();
                    }
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error de conección.","#D32F2F");
                });
            },
            deleteConcepto(){//elimina el concepto (solo si el concepto no ha sido facturado)
                Conceptos().delete(`/${this.$parent.bandera.id}`).then(() => {
                    this.$parent.eliminado = true;
                    this.respuesta("Producto eliminado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error de conección.","#D32F2F");
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .fondo{
        background: #1f3b63;
    }
</style>