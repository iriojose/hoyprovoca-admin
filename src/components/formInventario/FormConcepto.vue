<template>
    <v-form v-model="valid" @submit.prevent="">
        <div class="pa-3">
            <v-btn 
                :loading="loading"
                color="#005598" 
                :dark="valid" 
                :disabled="!valid" 
                class="white--text caption mx-10"
                @click="postConceptos"
            >
                Guardar
            </v-btn>

            <v-stepper v-model="step" class="elevation-0">
                <v-stepper-header class="elevation-0">
                    <v-stepper-step editable step="1" color="#005598">Descripcion</v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step editable step="2" color="#005598">Costos</v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step editable step="3" color="#005598">Existencias</v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">
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
                                            accept="image/png, image/jpeg"
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
                                            :items="tipos"
                                            label="Tipo de concepto"
                                            outlined
                                            dense
                                            hide-selected
                                            hide-details
                                            color="#005598"
                                            @change="changeTipo($event)"
                                            :rules="[required('tipo de concepto')]"
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="8" sm="10">
                                <v-row>
                                    <v-col cols="12" md="4" sm="12">
                                        <v-text-field
                                            v-model="data.nombre"
                                            type="text"
                                            label="Nombre"
                                            :rules="[required('Nombre')]"
                                            dense
                                            outlined
                                            color="#005598"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                        <v-text-field
                                            v-model="data.codigo"
                                            type="text"
                                            label="Codigo"
                                            :rules="[required('Codigo')]"
                                            dense
                                            outlined
                                            color="#005598"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                        <v-text-field
                                            v-model="data.referencia"
                                            type="text"
                                            label="Referencia"
                                            :rules="[required('Referencia')]"
                                            dense
                                            outlined
                                            color="#005598"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                        <v-select
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
                                    <v-col cols="12" md="4" sm="12">
                                        <v-select
                                            :items="selectesSubgrupos"
                                            label="SubGrupos"
                                            outlined
                                            hide-selected
                                            dense
                                            hide-details
                                            :disabled="selectGrupo==''"
                                            :rules="[required('SubGrupo')]"
                                            color="#005598"
                                            @change="changeSubGrupo($event)"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                        <v-select
                                            :items="empresas"
                                            label="Empresas"
                                            outlined
                                            dense
                                            hide-selected
                                            hide-details
                                            color="#005598"
                                            @change="changeEmpresa($event)"
                                            :rules="[required('Empresa')]"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" md="10" sm="12" :offset="$vuetify.breakpoint.smAndDown ? null:1">
                                        <v-container fluid>
                                            <v-textarea
                                                clearable
                                                filled
                                                color="#005598"
                                                hide-details
                                                clear-icon="cancel"
                                                label="Descripción"
                                                v-model="data.descripcion"
                                            ></v-textarea>
                                        </v-container>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content step="2">
                        <v-row>
                            <v-col cols="12" sm="10" md="4">
                                <v-text-field
                                    v-model="data.precio_a"
                                    type="number"
                                    label="Precio A"
                                    :rules="[required('Precio A')]"
                                    dense
                                    outlined
                                    color="#005598"
                                />
                            </v-col>
                             <v-col cols="12" sm="10" md="4">
                                <v-text-field
                                    v-model="data.precio_b"
                                    type="number"
                                    label="Precio B"
                                    :rules="[required('Precio B')]"
                                    dense
                                    outlined
                                    color="#005598"
                                />
                            </v-col>
                             <v-col cols="12" sm="10" md="4">
                                <v-text-field
                                    v-model="data.precio_c"
                                    type="number"
                                    label="Precio C"
                                    :rules="[required('Precio C')]"
                                    dense
                                    outlined
                                    color="#005598"
                                />
                            </v-col>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content step="3">
                        <v-row>
                            <v-col>
                                
                            </v-col>
                        </v-row>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </div>

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
                Se ha registrado exitosamente.
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
                step:1,
                tabs:[
                    'Descripcion','Costos','Existencias'
                ],
                tab:null,
                imagen:null,
                loading:false,
                showImage:'http://192.168.0.253:81/api/images/default.png',
                selectGrupo:'',
                selectSubgrupo:'',
                selectesSubgrupos:[],
                valid:false,
                snackbar:false,
                error:null,
                grupos:[],
                subgrupos:[],
                empresas:[],
                tipos:[
                    {id:1,text:'Servicio',disabled:false},
                    {id:2,text:'Producto',disabled:false},
                    {id:4,text:'Compuesto',disabled:true},
                    {id:5,text:'Ensamblado',disabled:false}
                ],
                ...validations,
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
                data:{
                    "empresa_id": 0,
                    "codigo": "",
                    "referencia": "",
                    "nombre": "",
                    "descripcion": "",
                    "tipos_conceptos_id": 0,
                    "fecha_at": "2019-07-11T04",
                    "fecha_in": "2019-08-13T04",
                    "fecha_uc": "2019-08-12T04",
                    "grupos_id": 0,
                    "subgrupos_id": 0,
                    "precio_a": "",
                    "precio_b":"",
                    "precio_c":""
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
                this.loading=true;
                this.error=null;
                let data = this.data;

                let formdata = new FormData();
                formdata.append('image',this.imagen);
                formdata.append('data',JSON.stringify(data));

                Conceptos().post("/",formdata).then((response) => {
                    console.log(response);
                    this.data = {
                        "empresa_id": 0,
                        "codigo": "",
                        "referencia": "",
                        "nombre": "",
                        "descripcion": "",
                        "tipos_conceptos_id": 0,
                        "fecha_at": "2019-07-11T04",
                        "fecha_in": "2019-08-13T04",
                        "fecha_uc": "2019-08-12T04",
                        "grupos_id": 0,
                        "subgrupos_id": 0,
                        "precio_a": "",
                        "precio_b":"",
                        "precio_c":""
                    },
                    this.showImage='http://192.168.0.253:81/api/images/default.png',
                    this.snackbar=true;
                    this.loading=false;
                }).catch(e => {
                    this.loading=false;
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
                this.data.grupos_id = id[0].id;//pone el id en data
                this.selectesSubgrupos = this.subgrupos.filter(a => a.grupos_id == id[0].id);
            },
            changeTipo(evt){
                let valor = this.tipos.filter(a => a.text == evt);
                this.data.tipos_conceptos_id = valor[0].id;
            },
            changeEmpresa(evt){
                let valor = this.empresas.filter(a => a.nombre_comercial == evt);
                this.data.empresa_id = valor[0].id;
            },
            changeSubGrupo(evt){
                let valor = this.selectesSubgrupos.filter(a => a.nombre == evt );
                this.data.subgrupos_id = valor[0].id;
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