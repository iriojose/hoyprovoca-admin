<template>
    <div :class="$vuetify.breakpoint.smAndDown ? 'sombra mx-2':'sombra'">
        <v-card elevation="0" width="100%">
            <v-card-title class="color title font-weight-bold">
                Tasa actual de dolar
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="my-10">
                <v-row justify="center">
                    <v-list flat v-if="!loading">
                        <v-list-item two-line>
                            <v-list-item-avatar size="50">
                                <v-img :src="require('@/assets/tasa.png')"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold">{{bolivar}}</v-list-item-title>
                                <v-list-item-subtitle class="font-weight-bold">Bolivares</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-progress-circular
                        v-else
                        color="blue-grey"
                        :width="4"
                        indeterminate
                        size="100"
                    ></v-progress-circular>
                </v-row>
            </v-card-text>

            <v-card-actions v-if="user.data.adm_empresa_id == null || user.data.adm_empresa_id == 0">
                <v-spacer></v-spacer>
                <v-btn elevation="0" fab small @click="dialogEditar = !dialogEditar">
                    <v-icon>mdi-chevron-up</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- modal para editar tasa -->
        <EditarTasa :dialog="dialogEditar">
            <template v-slot:close>
                <v-btn tile color="#232323" text @click="dialogEditar = false">
                    Cancelar
                </v-btn>
            </template>
            <template v-slot:salir>
                <v-btn fab small color="#fff" @click="dialogEditar = false">
                    <v-icon color="#232323">mdi-close</v-icon>
                </v-btn>
            </template>
        </EditarTasa>
    </div>
</template>

<script>
import Cambio from '@/services/Cambio';
import accounting from 'accounting';
import EditarTasa from '@/components/modals/EditarTasa';
import {mapState} from 'vuex';

    export default {
        components:{
            EditarTasa
        },
        data() {
            return {
                dialogEditar:false,
                editado:false,
                bolivar:null,
                dolar:1,
                loading:false,
                bandera:{
                    tasa:""
                },
            }
        },
        watch: {
            dialogEditar(){
                if(!this.dialogEditar){
                    if(this.editado){
                        this.bolivar = accounting.formatMoney(+this.bandera.tasa,{symbol:"Bs ",thousand:'.',decimal:','});
                        this.editado = false;
                    }
                }
            }
        },
        mounted() {
            this.getCambio();
        },
        computed: {
            ...mapState(['user'])
        },
        methods: {
            getCambio(){
                this.loading = true;
                Cambio().get(`/`).then((response) => {
                    this.bandera = response.data.data[0];
                    this.bolivar = accounting.formatMoney(+response.data.data[0].tasa,{symbol:"Bs ",thousand:'.',decimal:','});
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                });
            },
        },
    }
</script>

<style lang="scss" scope>
    .sombra{
        /*box-shadow: 0px 0px 35px 80px (173, 185, 201, 0.8) !important;*/
        box-shadow: 0px 0px 35px 5px rgba(173, 185, 201,0.2);
    }
    .color{
        color:#232323;
    }
</style>