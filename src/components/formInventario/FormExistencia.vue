<template>
   <div>
       <v-row>
           <v-col cols="12" md="3" sm="12">
               <v-form @submit.prevent="">
                   <v-card class="pa-5 ma-2" width="100%">
                       <v-card-title>
                           <div class="text-center title font-weight-black">Filtros</div>
                       </v-card-title>

                        <v-col cols="12" md="12" sm="12">
                            <v-text-field
                                label="Nombre del Concepto"
                                v-model="buscar"
                                type="text"
                                clearable
                                outlined
                                color="#005598"
                                dense
                                hide-details
                            />
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-text-field
                                label="Precio del Concepto"
                                v-model="precio"
                                type="number"
                                clearable
                                outlined
                                color="#005598"
                                dense
                                hide-details
                            />
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-text-field
                                label="Id empresa"
                                v-model="empresa"
                                type="number"
                                clearable
                                outlined
                                color="#005598"
                                dense
                                hide-details
                            />
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-btn 
                                block
                                color="#005598" 
                                width="100%" 
                                class="white--text caption"
                                @click="getConceptos"
                            >
                                Buscar
                            </v-btn>
                        </v-col>
                   </v-card>
                </v-form>    
           </v-col>
           <v-col cols="12" md="9" sm="12">
               <v-row justify="center" align="center">
                    <v-col cols="12" sm="12" md="12" >
                        <div class="text-center title font-weight-black">Resultados</div>
                    </v-col>
                    <v-col cols="12" md="3" sm="10" offset-sm="1" v-for="(resultado,i) in resultados" :key="i" class="ma-1 pa-2">
                        <v-card width="100%" height="200" elevation="5"> 

                        </v-card>
                    </v-col>
                </v-row>
           </v-col>
       </v-row>

       <v-snackbar v-model="snackbar" :color="error ? '#C62828':'#2E7D32'" right>
            <div v-if="error">
                <v-icon dark>
                    cancel
                </v-icon>
                {{error}}
            </div>
            <div v-else>
                <v-icon dark>
                    check_circle
                </v-icon>
                Se ha  exitosamente.
            </div>
        </v-snackbar>
   </div>
</template>

<script>
import Conceptos from '@/services/Conceptos';
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                loading:false,
                snackbar:false,
                error:null,
                resultados:[],
                buscar:null,
                precio:null,
                empresa:null,
                ...validations
            }
        },
        methods: {
            getConceptos(){
                let consulta = this.generadorDeConsulta();

                Conceptos().get(`/${consulta}`).then((response) => {
                    this.resultados = response.data.data;
                    console.log(response.data.data);
                }).catch(e => {
                    console.log(e);
                });
            },

            generadorDeConsulta(){
                let consulta = `?nombre=${this.buscar}`;

                if(this.precio !== null && this.empresa !== null && this.buscar !== null){
                    consulta = `?nombre=${this.buscar},precio_a=${this.precio},empresa_id=${this.empresa}`;
                }else if(this.precio !== null && this.empresa !== null){
                    consulta = `?precio_a=${this.precio},empresa_id=${this.empresa}`;
                }else if(this.empresa !== null && this.buscar !== null){
                    consulta = `?nombre=${this.buscar},empresa_id=${this.empresa}`;
                }else if(this.precio !== null && this.buscar !== null){
                    consulta = `?nombre=${this.buscar},precio_a=${this.precio}`;
                }else if(this.empresa !== null){
                    consulta = `?empresa_id=${this.empresa}`;
                }else if(this.precio !== null){
                    consulta = `?precio_a=${this.precio}`;
                };
                return consulta;
            }
        },        
    }
</script>