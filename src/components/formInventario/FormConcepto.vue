<template>
    <v-form v-model="valid" @submit.prevent="">
        <v-row>
            <v-col cols="12" md="3" sm="12" class="px-8">
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
                    <v-col cols="12" md="12" sm="12">
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

            <v-col cols="12" md="8" sm="12">
                <v-row>
                    <v-col cols="12" md="4" sm="10">
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
                    <v-col cols="12" md="4" sm="10">
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
                    <v-col cols="12" md="4" sm="10">
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
                    
                    <v-col cols="12" md="8" sm="12" :offset="$vuetify.breakpoint.smAndDown ? null:2">
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
                    <v-col class="px-2" cols="12" md="2" sm="2" :offset="$vuetify.breakpoint.smAndDown ? 0:8">
                        <v-btn 
                            :loading="loading"
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
                imagen:null,
                loading:false,
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
                tipos:[
                    {id:2,text:'Producto'},
                    {id:3,text:'Servicio'},
                    {id:5,text:'Ensamblado'}
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
                    "talla": null,
                    "color": null,
                    "descuento": null,
                    "serial_estatico": 0,
                    "serial_dinamico": 0,
                    "existencia_minima": "20.000",
                    "existencia_maxima": "500.000",
                    "tipos_conceptos_id": 0,
                    "ubicacion_id": 1,
                    "costo": null,
                    "ultimo_costo": null,
                    "costo_mayor": null,
                    "costo_promedio": null,
                    "fecha_at": Date(),
                    "fecha_in": Date(),
                    "fecha_uc": Date(),
                    "grupos_id": 0,
                    "subgrupos_id": 0,
                    "presentacion": null,
                    "unidades_id": 3,
                    "fecha_hora": null,
                    "marcas_id": null,
                    "estado": 1,
                    "pvp": null,
                    "precio_a": "0",
                    "precio_b": "0",
                    "precio_c": "0",
                    "precio_dolar": "0",
                    "utilidad": null,
                    "utilidad_a": "0",
                    "utilidad_b": "0",
                    "utilidad_c": "0",
                    "utilidad_dolar": "0",
                    "costo_dolar": "0.00",
                    "precio_variable": 0,
                    "retiene": 0,
                    "farm_principio_activo_id": null,
                    "costo_adicional": "0.00",
                    "costo_adicional2": "0.00",
                    "cant_ensamblado": "0.00",
                    "licor": 0,
                    "porcentaje": null,
                    "visible_pv": 1,
                    "visible_web": null,
                    "rest_areas_id": null,
                    "setcortesia": 0,
                    "exento": null,
                    "merma": 1,
                    "existencia_c": null,
                    "obviar_ajuste": 1,
                    "iva": 1,
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
                console.log(this.data);

                this.error=null;
                Conceptos().post("/",{data:this.data}).then((response) => {
                    console.log(response);
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