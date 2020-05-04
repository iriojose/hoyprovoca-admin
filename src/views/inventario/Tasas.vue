<template>
    <div v-if="$route.name == 'tasas'">
        <v-row justify="center" class="mx-2">
            <v-card width="400" height="400" class="pa-5">
                <v-card-title class="font-weight-black text-center mb-5">
                    Tasas de cambios Dolares/Bolivares
                </v-card-title>

                <v-form v-model="valid" class="my-5">
                    <v-text-field
                        label="Tasa"
                        solo
                        class="mb-5"
                        v-model="tasa.tasa"
                        type="number"
                        :disabled="loading"
                        color="#005598"
                        hint="Bolivares"
                        persistent-hint
                        dense
                        counter="20"
                        :rules="[required('Tasa'),positivo()]"
                    />

                    <v-btn 
                        :dark="valid"
                        :disabled="!valid"
                        :loading="loading"
                        color="#005598"
                        block
                        @click="post()"
                        class="text-capitalize font-weight-bold white--text"
                    >
                        Guardar
                    </v-btn>
                </v-form>
            </v-card>
        </v-row>
    </div>
</template>

<script>
import Cambio from '@/services/Cambio';
import {mapState} from 'vuex';
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                ...validations,
                tasa:{
                    adm_empresa_id:null,
                    moneda:'Dolares',
                    tasa:null,
                    principal:0,
                },
                valid:false,
                loading:false,
            }
        },
        mounted() {
            this.getCambio();
        },
        computed: {
            ...mapState(['user'])
        },
        methods: {
            success(mensaje){
                this.$toasted.success(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-check-outline",
                });
                this.loading = false;
            },
            error(mensaje){
                this.$toasted.error(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-alert-octagon",
                });
                this.loading = false;
            },
            getCambio(){
                Cambio().get(`/?adm_empresa_id=${this.user.data.adm_empresa_id}`).then((response) => {
                    if(response.data.data[0]){
                        this.tasa = Object.assign({},response.data.data[0]);
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
            post(){
                this.loading = true;
                if(this.tasa.adm_empresa_id){
                    this.updateCambio();
                }else{
                    this.tasa.id = this.user.data.adm_empresa_id;
                    this.createCambio();
                }
            },
            createCambio(){
                Cambio().get("/",{data:this.tasa}).then((response) => {
                    this.tasa = Object.assign({},response.data.data);
                    this.success("Tasa creada exitosamente");
                }).catch(e => {
                    console.log(e);
                    this.error("Error al intentar crear");
                });
            },
            updateCambio(){
                Cambio().post(`/${this.tasa.id}`,{data:this.tasa}).then(() => {
                    this.success("Tasa actualizada exitosamente");
                }).catch(e => {
                    console.log(e);
                    this.error("Error al intentar actualizar");
                });
            }
        },
    }
</script>