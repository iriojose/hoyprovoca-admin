<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Eliminar SubGrupo
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
                    ¿Seguro que quiere eliminar este SubGrupo? 
                </div>

                <v-row justify="space-around" class="py-5">
                    <v-btn 
                        elevation="3" color="#232323" 
                        class="text-capitalize white--text" 
                        @click="getConcepto()" :loading="loading"
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
import SubGrupos from '@/services/SubGrupos';

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
                //setTimeout(() => {this.showMessage = false}, 2000);
            },
            getConcepto(){//se determina si el subgrupo tiene conceptos indexados
                this.loading = true;
                this.showMessage = false;
                Conceptos().get(`/?limit=1&adm_subgrupos_id=${this.$parent.bandera.id}`).then((response) => {
                    if(response.data.data) this.respuesta("No se puede eliminar este SubGrupo.","error");   
                    else this.deleteSubgrupo();
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error de conección.","#D32F2F");
                });
            },
            deleteSubgrupo(){//elimina el grupo (solo si el subgrupo no tiene conceptos indexados)
                SubGrupos().delete(`/${this.$parent.bandera.id}`).then(() => {
                    this.$parent.eliminado = true;
                    this.respuesta("SubGrupo eliminado exitosamente.","success");
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