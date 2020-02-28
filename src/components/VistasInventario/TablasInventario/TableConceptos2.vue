<template>
    <v-container>
        <v-toolbar flat color="#fff">
            <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="dialog=!dialog">
                Nuevo
                <v-icon dark class="ml-2">add_circle</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                label="Buscar"
                single-line
                append-icon="search"
                type="text"
                color="#005598"
                hide-details
                dense
            />
        </v-toolbar>
        <v-data-table 
            :headers="headers" 
            :items="conceptos" 
            class="elevation-0" 
            :search="search"
            :loading="loading && '#005598'" 
            loading-text="Loading... please wait" 
            no-results-text="No se encontraron resultados..."
            no-data-text="No se encontraron resultados..."
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editedItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" fullscreen>
            <v-card>
                <v-card-title class="color">
                    {{title}}
                    <v-spacer></v-spacer>
                    <v-icon @click="dialog=!dialog">cancel</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form v-model="valid" @submit.prevent="">
                        <v-col cols="12" md="12" sm="12">
                            <v-btn 
                                @click="save(editItem)"
                                :loading="loading"
                                class="white--text caption text-capitalize"
                                :disabled="!valid"
                                :dark="valid"
                                color="#005598"
                            >
                                Enviar
                                <template v-slot:loader>
                                    <span class="custom-loader">
                                        <v-icon light>cached</v-icon>
                                    </span>
                                </template> 
                            </v-btn>
                        </v-col>
                        <v-stepper non-linear class="elevation-0">
                            <v-stepper-header class="elevation-0">
                                <v-stepper-step editable step="1" color="#005598">Datos</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step editable step="2" color="#005598">Precios</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step step="3" editable color="#005598">Existencias</v-stepper-step>
                            </v-stepper-header>

                            <v-stepper-items class="elevation-0">
                                <!-- Datos basicos del conceptos -->
                                <v-stepper-content step="1">
                                    <v-row>
                                        <v-col cols="12" md="3" sm="12">
                                            <v-row justify="center" align="center">
                                                <v-col cols="12" md="12" sm="12">
                                                    <v-card width="100%" height="170" class="pa-2" elevation="0">
                                                        <v-img height="150" width="100%" contain v-if="showImage" :src="showImage" />
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
                                                        v-model="selectTipo"
                                                        :items="tipos"
                                                        label="Tipo de concepto"
                                                        hide-selected
                                                        dense
                                                        return-object
                                                        color="#005598"
                                                        chips
                                                        hide-details
                                                        small-chips
                                                        outlined
                                                        :rules="[requiredObject('Tipo')]"
                                                        @change="changeTipo($event)"
                                                    />
                                                </v-col>
                                                <v-col cols="12" md="12" sm="12">
                                                    <v-select 
                                                        dense
                                                        :items="empresas"
                                                        color="#005598"
                                                        item-text="nombre_comercial"
                                                        v-model="selectEmpresa"
                                                        return-object
                                                        label="Empresa"
                                                        chips
                                                        hide-details
                                                        small-chips
                                                        @change="changeEmpresa($event)"
                                                        hide-selected
                                                        outlined
                                                        :rules="[requiredObject('Empresa')]"
                                                    />
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" md="9" sm="12">
                                            <v-row>
                                                <v-col cols="12" md="4" sm="12">
                                                    <v-text-field 
                                                        v-model="editItem.nombre"
                                                        label="Nombre"
                                                        color="#005598"
                                                        type="text"
                                                        outlined
                                                        dense
                                                        :rules="[required('Nombre')]"
                                                    />
                                                </v-col>
                                                <v-col cols="12" md="4" sm="12">
                                                    <v-text-field 
                                                        v-model="editItem.codigo"
                                                        label="Codigo"
                                                        color="#005598"
                                                        type="text"
                                                        outlined
                                                        dense
                                                        :rules="[required('Codigo')]"
                                                    />
                                                </v-col>
                                                <v-col cols="12" md="4" sm="12">
                                                    <v-text-field 
                                                        v-model="editItem.referencia"
                                                        label="Referencia"
                                                        color="#005598"
                                                        type="text"
                                                        outlined
                                                        dense
                                                        :rules="[required('Referencia')]"
                                                    />
                                                </v-col>
                                                <v-col cols="12" md="4" sm="12">
                                                    <v-select 
                                                        v-model="selectGrupo"
                                                        :items="grupos"
                                                        label="Grupo"
                                                        hide-details
                                                        hide-selected
                                                        dense
                                                        return-object
                                                        item-text="nombre"
                                                        color="#005598"
                                                        outlined
                                                        chips
                                                        small-chips
                                                        :rules="[requiredObject('Grupo')]"
                                                        @change="changeGrupo($event)"
                                                    />
                                                </v-col>
                                                <v-col cols="12" md="4" sm="12">
                                                    <v-select 
                                                        v-model="selectSubgrupo"
                                                        :items="subgruposSelect"
                                                        label="Subgrupo"
                                                        hide-details
                                                        hide-selected
                                                        :disabled="subgruposSelect.length > 0 ? false:true"
                                                        dense
                                                        return-object
                                                        item-text="nombre"
                                                        color="#005598"
                                                        chips
                                                        small-chips
                                                        outlined
                                                        :rules="[requiredObject('Subgrupo')]"
                                                        @change="changeSubGrupo($event)"
                                                    />
                                                </v-col>
                                                <v-col cols="12" md="4" sm="12">
                                                    <v-select 
                                                        dense
                                                        :items="marcas"
                                                        color="#005598"
                                                        item-text="nombre"
                                                        v-model="selectMarca"
                                                        return-object
                                                        label="Marca"
                                                        chips
                                                        small-chips
                                                        hide-details
                                                        @input="changeMarca($event)"
                                                        hide-selected
                                                        outlined
                                                        :rules="[requiredObject('Marca')]"
                                                />
                                                </v-col>
                                                <v-col cols="12" md="8" :offset="$vuetify.breakpoint.smAndDown ? null:2" sm="12">
                                                    <v-textarea 
                                                        dense
                                                        label="Descripción"
                                                        filled
                                                        v-model="editItem.descripcion"
                                                        outlined
                                                        color="#005598"
                                                        :rules="[required('Descripción')]"
                                                    />
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-stepper-content>

                                <!-- Costos del concepto-->
                                <v-stepper-content step="2">
                                    <v-row justify="center" align="center">
                                        <v-col cols="12" md="6" sm="12">
                                            <v-text-field 
                                                dense
                                                color="#005598"
                                                v-model="editItem.precio_a"
                                                label="Precio"
                                                type="number"
                                                outlined
                                                :rules="[required('Precio')]"
                                                single-line
                                                @change="changePrecio($event)"
                                            />
                                        </v-col>
                                        <v-col cols="12" md="6" sm="12">
                                            <v-text-field 
                                                dense
                                                color="#005598"
                                                v-model="editItem.precio_dolar"
                                                label="Precio dolar"
                                                type="number"
                                                outlined
                                                disabled
                                            />
                                        </v-col>
                                        <v-col cols="12" md="6" sm="12">
                                            <v-text-field 
                                                dense
                                                color="#005598"
                                                v-model="editItem.costo_mayor"
                                                label="Costo"
                                                type="number"
                                                outlined
                                                :rules="[required('Costo')]"
                                            />
                                        </v-col>
                                        <v-col cols="12" md="6" sm="12">
                                            <v-text-field 
                                                dense
                                                color="#005598"
                                                prefix="%"
                                                v-model="editItem.utilidad_a"
                                                label="Utilidad"
                                                type="number"
                                                outlined
                                                :rules="[required('Utilidad')]"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-stepper-content>

                                <!-- Existencia minima y maxima -->
                                <v-stepper-content step="3">
                                    <v-row justify="center" align="center">
                                        <v-col cols="12" md="6" sm="12">
                                            <v-text-field 
                                                dense
                                                color="#005598"
                                                v-model="editItem.existencia_minima"
                                                label="Existencia Minima"
                                                type="number"
                                                outlined
                                            />
                                        </v-col>
                                        <v-col cols="12" md="6" sm="12">
                                            <v-text-field 
                                                dense
                                                color="#005598"
                                                v-model="editItem.existencia_maxima"
                                                label="Existencia Maxima"
                                                type="number"
                                                outlined
                                            />
                                        </v-col>
                                    </v-row>
                                </v-stepper-content>
                            </v-stepper-items>
                        </v-stepper>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <Snackbar :error="error" :exito="exito" />
    </v-container>
</template>

<script>
import Conceptos from '@/services/Conceptos';
import Grupos from '@/services/Grupos';
import SubGrupos from '@/services/SubGrupos';
import Empresa from '@/services/Empresa';
import validations from '@/validations/validations';
import Snackbar from '@/components/helpers/Snackbar';
import {mapActions} from 'vuex';
import Marcas from '@/services/Marcas';
import url from '@/services/ruta';
import MovimientoDeposito from '@/services/Movimiento_deposito';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                //selects
                selectTipo:null,
                selectEmpresa:null,
                selectGrupo:null,
                selectSubgrupo:null,
                selectMarca:null,
                //data global
                search:'',
                error:null,
                exito:null,
                ruta:null,
                valid:false,
                disabled:false,
                dialog:false,
                loading:true,
                showImage:null,
                imagen:null,
                editIndex: -1,
                //arrays
                conceptos:[],
                grupos:[],
                subgrupos:[],
                subgruposSelect:[],
                empresas:[],
                marcas:[],
                ...validations,
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Codigo', value: 'codigo' },
                    { text: 'Referencia', value: 'referencia' },
                    { text: 'Nombre',sortable: true, value: 'nombre' },
                    { text: 'Precio', value: 'precio_a' },
                    { text: 'Utilidad', value: 'utilidad_a' },
                    { text: 'Costo', value: 'costo_mayor' },
                    { text: 'Imagen', value: 'imagen' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
                tipos:[
                    {id:1,text:'Servicio'},
                    {id:2,text:'Producto'},
                    {id:4,text:'Compuesto',disabled:true},
                    {id:5,text:'Emsamblado',disabled:true}
                ],
                //objeto del concepto a crear/modificar
                editItem:{
                    "empresa_id": 0,
                    "codigo": "",
                    "referencia": "",
                    "nombre": "",
                    "descripcion": "",
                    "existencia_minima": 0,
                    "existencia_maxima": 0,
                    "tipos_conceptos_id": 0,
                    "ubicacion_id": 0,
                    "costo": null,
                    "costo_mayor":null,
                    "fecha_at": "2019-07-11T04",
                    "fecha_in": "2019-08-13T04",
                    "fecha_uc": "2019-08-12T04",
                    "grupos_id": null,
                    "subgrupos_id": null,
                    "marcas_id":null,
                    "precio_a": null,
                    "imagen":"default.png",
                    "precio_dolar": null,
                    "utilidad": null,
                    "utilidad_a": null,
                    "utilidad_dolar": "0",
                    "costo_dolar": "0.00",
                    "visible_pv": 1,
                    "visible_web": 1,
                    "iva": 1,
                },
                defaultItem:{
                   "empresa_id": 0,
                    "codigo": "",
                    "referencia": "",
                    "nombre": "",
                    "descripcion": "",
                    "existencia_minima": 0,
                    "existencia_maxima": 0,
                    "tipos_conceptos_id": 0,
                    "ubicacion_id": 0,
                    "costo": null,
                    "costo_mayor":null,
                    "fecha_at": "2019-07-11T04",
                    "fecha_in": "2019-08-13T04",
                    "fecha_uc": "2019-08-12T04",
                    "grupos_id": null,
                    "subgrupos_id": null,
                    "marcas_id":null,
                    "precio_a": null,
                    "precio_dolar": null,
                    "utilidad": null,
                    "utilidad_a": null,
                    "utilidad_dolar": "0",
                    "costo_dolar": "0.00",
                    "visible_pv": 1,
                    "visible_web": 1,
                    "iva": 1,
                }
            }
        },
        mounted() {
            this.ruta=url;
            this.showImage=this.ruta+'default.png';
            this.getConceptos();
            this.getGrupos();
            this.getSubgrupos();
            this.getEmpresa();
            this.getMarcas();
        },
        computed: {
            title(){
                return this.editIndex == -1 ? 'Agregar':'Editar';
            }
        },
        watch: {
            dialog(){
                if(!this.dialog){
                    this.loading=false;
                    this.nulos();
                    setTimeout(() => {
                        this.editIndex = -1;
                        this.editItem = Object.assign({},this.defaultItem);
                        this.showImage=this.ruta+'default.png';
                    },300);
                }
            }
        },
        methods: {
            ...mapActions(['setSnackbar']),

            //llamadas get hacia la api
            getConceptos(){//trae conceptos
                Conceptos().get("/").then((response) => {
                    this.conceptos = response.data.data;
                    this.loading = false;//luego de cargar los conceptos
                }).catch(e =>{
                    console.log(e);
                    this.loading = false;
                });
            },
            getMarcas(){//trae marcas
                Marcas().get("/").then((response) => {
                    this.marcas = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            getEmpresa(){//trae a las empresas
                Empresa().get("/").then((response)  => {
                    this.empresas = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            getGrupos(){//trae grupos
                Grupos().get("/").then((response) => {
                    this.grupos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            getSubgrupos(){//trae subgrupos
                SubGrupos().get("/").then((response) => {
                    this.subgrupos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            //llamadas post a la api
            postMovimientoDeposito(id){//se crea el movimiento de deposito luego de crearse el concepto (no apto para servicio)
                let data ={depositos_id:1, conceptos_id:id, existencia:0}
                MovimientoDeposito().post("/",{data:data}).then((response) => {
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                });
            },
            postConceptos(item){//crea el concepto
                let formdata = new FormData();
                formdata.append('image',this.imagen);
                formdata.append('data',JSON.stringify(item));

                Conceptos().post("/",formdata).then((response) => {
                    this.conceptos.push(response.data.data);
                    //response.data.data.tipos_conceptos_id !== 1 ? this.postMovimientoDeposito(response.data.data.id):null;
                    this.dialog=false;
                    this.exito = "Se creo exitosamente.";
                    this.setSnackbar(true);
                }).catch(()=> {
                    this.dialog=false;
                    this.error = "No se pudo crear este concepto.";
                    this.setSnackbar(true);
                    
                });
            },
            updateConceptos(item){//actualiza el concepto seleccionado
                //delete item.imagen;
                //let formdata = new FormData();
                //formdata.append('image',this.imagen);
                //formdata.append('data',JSON.stringify(item));
                //se usara cuando se agregue imagen a el update

                Conceptos().post("/",{data:item}).then(() => {
                    Object.assign(this.conceptos[this.editIndex],item);
                    this.editIndex = -1;
                    this.dialog=false;
                    this.exito = "Se actualizo exitosamente";
                    this.setSnackbar(true);
                }).catch(() => {
                    this.dialog=false;
                    this.error = "No se pudo actualizar este concepto";
                    this.setSnackbar(true);
                });
            },
            deleteConceptos(item){//elimina el concepto
                Conceptos().delete(`/${item.id}`).then(() => {
                    const index = this.conceptos.indexOf(item);
                    this.conceptos.splice(index,1);
                    this.exito = "Se elimino el concepto exitosamente.";
                    this.setSnackbar(true);
                }).catch(e  => {
                    console.log(e);
                    this.error = "No se pudo eliminar este concepto";
                    this.setSnackbar(true);
                });
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar este Producto?') && this.deleteConceptos(item);
            },
            editedItem(item){
                this.editIndex = this.conceptos.indexOf(item);
                this.editItem = Object.assign({},item);
                this.showImage=this.ruta+this.editItem.imagen;
                this.changes();
                this.dialog=true;
            },
            save(item){
                this.loading = true;
                this.error = null;
                this.exito = null;
                if(this.editIndex > -1){
                    this.updateConceptos(item);
                }else{
                    this.postConceptos(item);
                }
            },
            changeGrupo(evt){
                this.subgruposSelect = [];
                this.grupos.filter(a=> a.id==evt.id ? this.editItem.grupos_id=a.id:null);
                this.subgrupos.filter(a=> a.grupos_id==this.editItem.grupos_id ? this.subgruposSelect.push(a):null);
            },
            changeSubGrupo(evt){
                this.subgruposSelect.filter(a=> a.id==evt.id ? this.editItem.subgrupos_id=a.id:null);
            },
            changeMarca(evt){
                this.marcas.filter(a=> a.id==evt.id ? this.editItem.marcas_id=a.id:null);
            },
            changeTipo(evt){
                this.tipos.filter(a=> a.id==evt.id ? this.editItem.tipos_conceptos_id=a.id:null);
            },
            changeEmpresa(evt){
                this.empresas.filter(a=> a.id==evt.id ? this.editItem.empresa_id=a.id:null);
            },
            changePrecio(evt){
                this.editItem.precio_dolar = Number.parseFloat(evt)/75000;
            },
            changes(){
                this.empresas.filter(a=> a.id==this.editItem.empresa_id ? this.selectEmpresa=a:null);
                this.tipos.filter(a=> a.id==this.editItem.tipos_conceptos_id ? this.selectTipo=a:null);
                this.grupos.filter(a=> a.id==this.editItem.grupos_id ? this.selectGrupo=a:null);
                this.subgrupos.filter(a=> a.id==this.editItem.subgrupos_id ? this.selectSubgrupo=a:null);
                this.marcas.filter(a=> a.id==this.editItem.marcas_id ? this.selectMarca=a:null);
                this.subgruposSelect = [];
                this.subgrupos.filter(a=> a.grupos_id==this.editItem.grupos_id ? this.subgruposSelect.push(a):null);
            },
            procesoImg(evt){
                if(evt){
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        this.showImage = e.target.result;
                        this.imagen = evt;
                    }
                    reader.readAsDataURL(evt);
                }else{
                    this.imagen = null;
                    this.showImage=this.ruta+'default.png';
                }
            },
            nulos(){
                this.selectTipo=null;
                this.selectEmpresa=null;
                this.selectGrupo=null;
                this.selectSubgrupo=null;
                this.selectMarca=null;
            }
        },
    }
</script>

<style scope>
    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }
    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>