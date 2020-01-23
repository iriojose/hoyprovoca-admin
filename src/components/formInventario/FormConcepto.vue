<template>
    <v-form v-model="valid" @submit.prevent="">
        <v-row>
            <v-col cols="12" md="4" sm="12" class="px-8">
                <v-row justify="center" align="center">
                    <v-col cols="12" md="12" sm="12">
                        <v-card width="100%" height="220" class="pa-2">
                            <v-img height="200" contain v-if="showImage" :src="showImage" />
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-file-input
                            :rules="rules"
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Seleccionar imagen"
                            prepend-icon="mdi-camera"
                            label="Imagen Concepto"
                            dense
                            @change="procesoImg($event)"
                            color="#005598"
                            v-model="imagen"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-select
                            v-model="selectGrupo"
                            :items="grupos"
                            label="Grupos"
                            outlined
                            dense
                            hide-selected
                            hide-details
                            color="#005598"
                            :rules="[required('Grupo')]"
                            @change="refactorSubgrupo($event)"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-select
                            v-model="selectSubgrupo"
                            :items="selectesSubgrupos"
                            label="SubGrupos"
                            outlined
                            hide-selected
                            dense
                            hide-details
                            :disabled="selectGrupo==''"
                            :rules="[required('SubGrupo')]"
                            color="#005598"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-select
                            :items="empresas"
                            label="Empresas"
                            outlined
                            dense
                            hide-selected
                            hide-details
                            color="#005598"
                            :rules="[required('Empresa')]"
                        ></v-select>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="8" sm="12">
                <v-row>
                    <v-col cols="12" md="4" sm="12">
                        <v-text-field
                            type="text"
                            dense
                            outlined
                            color="#005598"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="8" sm="12">
                        <v-container fluid>
                            <v-textarea
                                clearable
                                filled
                                color="#005598"
                                hide-details
                                clear-icon="cancel"
                                label="Descripción"
                            ></v-textarea>
                        </v-container>
                    </v-col>
                    <v-col class="px-2" cols="12" md="2" sm="2" :offset="$vuetify.breakpoint.smAndDown ? 0:8">
                        <v-btn 
                            color="#005598" 
                            width="100%" 
                            :dark="valid" 
                            :disabled="!valid" 
                            class="white--text caption"
                            @click="postConceptos"
                        >
                            Enviar
                        </v-btn>
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
                Se ha logueado exitosamente.
            </div>
        </v-snackbar>
    </v-form>
</template>

<script>
import Grupos from '@/services/Grupos';
import SubGrupos from '@/services/SubGrupos';
import Conceptos from '@/services/Conceptos';
import Empresa from '@/services/Empresa';
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                imagen:null,
                showImage:null,
                selectGrupo:'',
                selectSubgrupo:'',
                selectesSubgrupos:[],
                valid:false,
                snackbar:false,
                error:null,
                grupos:[],
                subgrupos:[],
                empresas:[],
                ...validations,
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
                data:{
                    empresa_id:null,
                    subgrupos_id:1,
                    grupos_id:1,
                },
                
            }
        },
        mounted() {
            this.getGrupos();
            this.getSubGrupos();
            this.getEmpresa();
        },
        methods: {
            getEmpresa(){
                Empresa().get("/").then((response) => {
                    this.empresas=response.data.data;
                    this.empresas=this.refactorVariableEmpresa(this.empresas);
                }).catch(e => {
                    console.log(e);
                }); 
            },
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos=response.data.data;
                    this.grupos=this.refactorVariable(this.grupos);
                }).catch(e => {
                    console.log(e);
                });
            },
            getSubGrupos(){
                SubGrupos().get("/").then((response) => {
                    this.subgrupos=response.data.data;
                    this.subgrupos=this.refactorVariable(this.subgrupos);
                }).catch(e => {
                    console.log(e);
                });
            },
            postConceptos(){
                this.error=null;
                Conceptos().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                    this.snackbar=true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar=true;
                    this.error="Ocurrio un error.";
                });
            },
            
            refactorVariableEmpresa(array){//crea una propiedad text para que se pueda leer en los select
                array.filter(value => value.text=value.nombre_comercial);
                return array;
            },
            refactorVariable(array){//crea una propiedad text para que se pueda leer en los select
                array.filter(value => value.text=value.nombre);
                return array;
            },
            refactorSubgrupo(evt){//agrupa los subgrupos que pertenecen a un grupo
                this.selectGrupo=evt;
                let id = this.grupos.filter(a => a.nombre == evt);
                this.selectesSubgrupos = this.subgrupos.filter(a => a.grupos_id == id[0].id);
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
        },
    }
</script>