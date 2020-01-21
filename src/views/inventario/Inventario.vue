<template>
    <div>
        <v-card width="100%" height="500" class="pa-4">
            <v-row>
                <v-col cols="12" sm="12" lg="4" md="6" v-for="(opcion,i) in opciones" :key="i" @click="openDialog(i+1)">
                   <v-tooltip right>
                        <template v-slot:activator="{ on }">
                           <v-card width="100%" height="100" v-on="on">
                                <div class="text-center">{{opcion.icon}}</div>
                            </v-card>
                        </template>
                        <span>{{opcion.text}}</span>
                   </v-tooltip>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog v-model="dialog" fullscreen>
            <v-card-title class="color">
               <v-btn icon @click="dialog = false">
                    <v-icon color="#005598" x-large>
                        keyboard_arrow_left
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card>
                <FormGrupo v-if="opc==1"/>
                <!-- <FormSubGrupo v-else-if="opc==2"/> -->
                <FormConcepto v-else-if="opc==3"/>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import FormGrupo from '@/components/formInventario/FormGrupo';
//import FormSubGrupo from '@/components/formInventario/FormSubGrupo';
import FormConcepto from '@/components/formInventario/FormConcepto';

    export default {
        components:{
            FormGrupo,
            //FormSubGrupo,
            FormConcepto
        },
        data() {
            return {
                dialog:false,
                opc:0,
                opciones:[
                    {text:'Crear Grupo',icon:'grupos',color:''},
                    {text:'Crear Subgrupo',icon:'subgrupos',color:''},
                    {text:'Agregar conceptos',icon:'conceptos',color:''},
                    {text:'Manejo de Existencias',icon:'existencias',color:''},
                ]
            }
        },
        methods: {
            openDialog(opc){
                this.opc=opc;
                console.log(opc);
                this.dialog=true;
            }
        },
    }
</script>

<style scoped>
    .color{
        background: #f5f5f5;
    }
</style>