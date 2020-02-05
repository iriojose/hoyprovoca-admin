<template>
    <div>
        <v-card width="100%" class="px-4 py-2" elevation="0" color="#eee">
            <v-row justify="center" align="center">
                <v-col cols="12" sm="8" lg="4" md="6" v-for="(opcion,i) in opciones" :key="i" @click="openDialog(i+1)">
                   <v-tooltip right>
                        <template v-slot:activator="{ on }">
                            <v-hover v-slot:default="{hover}">
                                <v-card width="100%" height="150" v-on="on" :color="opcion.color" :elevation="hover ? 10:3">
                                    <v-row justify="center" align="center" class="fill-height">
                                        <v-col cols="12" sm="6" md="6">
                                                <div class="text-center white--text font-weight-bold">{{opcion.text}}</div>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-icon dark size="70">
                                                {{opcion.icon}}
                                            </v-icon>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-hover>
                        </template>
                        <span>{{opcion.text}}</span>
                   </v-tooltip>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
            <v-card>
                <v-card-title class="color">
                    <v-btn icon @click="dialog = false">
                        <v-icon color="#005598" x-large>
                            keyboard_arrow_left
                        </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                        <div class="title font-weight-bold" v-show="opc==1">Grupos</div>
                        <div class="title font-weight-bold" v-show="opc==2">SubGrupos</div>
                        <div class="title font-weight-bold" v-show="opc==3">Productos</div>
                        <div class="title font-weight-bold" v-show="opc==4">Existencias</div>
                        <div class="title font-weight-bold" v-show="opc==5">Empresas</div>
                        <div class="title font-weight-bold" v-show="opc==6">Marcas</div>
                        <div class="title font-weight-bold" v-show="opc==7">Unidades</div>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <TablePrueba v-if="opc==1"/>
                    <TableSubGrupos v-else-if="opc==2"/>
                    <TableConceptos v-else-if="opc==3"/>
                    <TableExistencias v-else-if="opc==4"/>
                    <TableEmpresa v-else-if="opc==5"/>
                    <TableMarcas v-else-if="opc==6"/>
                    <TableUnidades v-else-if="opc==7"/>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import TablePrueba from '@/components/VistasInventario/TablasInventario/TablePrueba';
import TableSubGrupos from '@/components/VistasInventario/TablasInventario/TableSubGrupos';
import TableEmpresa from '@/components/VistasInventario/TablasInventario/TableEmpresa';
import TableConceptos from '@/components/VistasInventario/TablasInventario/TableConceptos';
import TableExistencias from '@/components/VistasInventario/TablasInventario/TableExistencias';
import TableMarcas from '@/components/VistasInventario/TablasInventario/TableMarcas';
import TableUnidades from '@/components/VistasInventario/TablasInventario/TableUnidades';

    export default {
        components:{
            TablePrueba,
            TableSubGrupos,
            TableEmpresa,
            TableConceptos,
            TableExistencias,
            TableMarcas,
            TableUnidades
        },
        data() {
            return {
                dialog:false,
                opc:0,
                opciones:[
                    {text:'Grupos',icon:'group',color:'#7B1FA2'},
                    {text:'SubGrupos',icon:'group_work',color:'#C2185B'},
                    {text:'Productos',icon:'fastfood',color:'#D32F2F'},
                    {text:'Existencias',icon:'hourglass_empty',color:'#1976D2'},
                    {text:'Empresas',icon:'business',color:'#303F9F'},
                    {text:'Marcas',icon:'grade',color:'#00796B'},
                    {text:'Unidades',icon:'grain',color:'#388E3C'}
                ]
            }
        },
        methods: {
            openDialog(opc){
                this.opc=opc;
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