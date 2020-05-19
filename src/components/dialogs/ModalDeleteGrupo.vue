<template>
    <v-dialog v-model="dialog" width="450" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title>
                Eliminar Grupo
                <v-spacer></v-spacer>
                <v-scroll-x-transition>
                    <div class="mx-2" v-show="showMessage">Salir</div>
                </v-scroll-x-transition>
                <slot name="close" v-if="!loading"></slot>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <div v-if="!showMessage && !loading" class="text-center title font-weight-black py-5">
                    ¿Seguro que quiere eliminar este Grupo? 
                </div>

                <v-row justify="space-around" class="py-5" v-if="!showMessage && !loading" >
                    <v-btn elevation="3" color="#232323" class="text-capitalize white--text" @click="getConcepto()">
                        Sí, seguro
                    </v-btn>
                    
                    <slot name="close2"></slot>
                </v-row>

                <v-scroll-x-transition>
                    <LoaderRect class="py-12" v-show="loading" />
                </v-scroll-x-transition>
                    
                <v-scroll-x-transition>
                    <Message  v-show="showMessage" :mensaje="mensaje" :color="color" :icon="icon" />
                </v-scroll-x-transition>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import Message from '@/components/mensajes/Message';
import Conceptos from '@/services/Conceptos';
import Grupos from '@/services/Grupos';
import LoaderRect from '@/components/loaders/LoaderRect'

    export default {
        components:{
            Message,
            LoaderRect
        },
        props:{
            dialog:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                icon:'',
                color:'',
                mensaje:'',
                showMessage:false,
                loading:false,
            }
        },
        watch:{
            dialog(){
                if (!this.dialog) setTimeout(() => {this.showMessage = false},500);
            }
        },
        methods: {
            respuesta(icon,mensaje,color){
                this.icon = icon;
                this.color = color;
                this.mensaje = mensaje;
                this.loading = false;
                this.showMessage = true;
            },
            getConcepto(){//se determina si el grupo tiene conceptos indexados
                this.loading = true;
                Conceptos().get(`/?limit=1&adm_grupos_id=${this.$parent.bandera.id}`).then((response) => {
                    if(response.data.data){
                        this.respuesta("mdi-alert-octagon","No se puede eliminar este Grupo.","#D32F2F");
                    }else{
                        this.deleteGrupo();
                    }
                }).catch(e => {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
            deleteGrupo(){//elimina el grupo (solo si el grupo no tiene conceptos indexados)
                Grupos().delete(`/${this.$parent.bandera.id}`).then(() => {
                    this.$parent.eliminado = true;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Grupo eliminado.","#388E3C");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
        },
    }
</script>