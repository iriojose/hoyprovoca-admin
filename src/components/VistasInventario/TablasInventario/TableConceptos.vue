<template>
    <v-container>
        <v-toolbar flat color="#fff">
            <v-btn color="#005598" dark class="mb-2 text-capitalize caption" @click="dialog=!dialog">
                Nuevo
                <v-icon dark class="ml-2">
                    add_circle
                </v-icon>
            </v-btn>
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
                    <v-icon @click="close">
                        cancel
                    </v-icon>
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
                            </v-btn>
                        </v-col>
                        <v-stepper non-linear class="elevation-0">
                            <v-stepper-header>
                                <v-stepper-step editable step="1" color="#005598">Datos</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step editable step="2" color="#005598">Precios</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step step="3" editable color="#005598">Existencias</v-stepper-step>
                            </v-stepper-header>
                        </v-stepper>
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
                                            :items="tipos"
                                            label="Tipo de concepto"
                                            hide-details
                                            hide-selected
                                            dense
                                            color="#005598"
                                            outlined
                                            :rules="[required('Tipo')]"
                                            @change="changeTipo($event)"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="12" sm="12">
                                        <v-select 
                                            :items="empresas"
                                            label="Empresa"
                                            hide-details
                                            hide-selected
                                            dense
                                            color="#005598"
                                            outlined
                                            :rules="[required('Empresa')]"
                                            @change="changeEmpresa($event)"
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
                                            :items="grupos"
                                            label="Grupo"
                                            hide-details
                                            hide-selected
                                            dense
                                            color="#005598"
                                            outlined
                                            :rules="[required('Grupo')]"
                                            @change="changeGrupo($event)"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                        <v-select 
                                            :items="subgruposSelect"
                                            label="Subgrupo"
                                            hide-details
                                            hide-selected
                                            :disabled="subgruposSelect.length > 0 ? false:true"
                                            dense
                                            color="#005598"
                                            outlined
                                            :rules="[required('Subgrupo')]"
                                            @change="changeSubGrupo($event)"
                                        />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <Snackbar :error="error" :exito="exito" />
    </v-container>
</template>

<script>
import MovimientoDeposito from '@/services/Movimiento_deposito';
import Conceptos from '@/services/Conceptos';
import Empresa from '@/services/Empresa';
import Grupos from '@/services/Grupos';
import SubGrupos from '@/services/SubGrupos';
import Snackbar from '@/components/helpers/Snackbar';
import validations from '@/validations/validations';
import {mapActions} from 'vuex';

    export default {
        components:{
            Snackbar
        },
        data() {
            return {
                disabled:true,
                valid:false,
                dialog:false,
                loading:false,
                error:null,
                exito:null,
                search:'',
                showImage:'http://192.168.0.253:81/api/images/default.png',
                imagen:null,
                editIndex: -1,
                conceptos:[],
                grupos:[],
                subgruposSelect:[],
                subgrupos:[],
                empresas:[],
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
                editItem:{
                    "empresa_id": 0,
                    "codigo": "",
                    "referencia": "",
                    "nombre": "",
                    "descripcion": "",
                    "existencia_minima": "00.00",
                    "existencia_maxima": "00.00",
                    "tipos_conceptos_id": 0,
                    "ubicacion_id": 0,
                    "costo": null,
                    "fecha_at": "2019-07-11T04",
                    "fecha_in": "2019-08-13T04",
                    "fecha_uc": "2019-08-12T04",
                    "grupos_id": 0,
                    "subgrupos_id": 0,
                    "precio_a": "00.00",
                    "precio_dolar": "00.00",
                    "utilidad": null,
                    "utilidad_a": "00.00",
                    "utilidad_dolar": "0",
                    "costo_dolar": "00.00",
                    "visible_pv": 1,
                    "visible_web": null,
                    "iva": 1,
                },
                defaultItem:{
                    "empresa_id": 0,
                    "codigo": "",
                    "referencia": "",
                    "nombre": "",
                    "descripcion": "",
                    "existencia_minima": "00.00",
                    "existencia_maxima": "00.00",
                    "tipos_conceptos_id": 0,
                    "ubicacion_id": 0,
                    "costo": null,
                    "fecha_at": "2019-07-11T04",
                    "fecha_in": "2019-08-13T04",
                    "fecha_uc": "2019-08-12T04",
                    "grupos_id": 0,
                    "subgrupos_id": 0,
                    "precio_a": "00.00",
                    "precio_dolar": "00.00",
                    "utilidad": null,
                    "utilidad_a": "00.00",
                    "utilidad_dolar": "0",
                    "costo_dolar": "00.00",
                    "visible_pv": 1,
                    "visible_web": null,
                    "iva": 1,
                }
            }
        },
        mounted() {
            this.getConceptos();
            this.getGrupos();
            this.getSubgrupos();
            this.getEmpresa();
        },
        computed: {
            title(){
                return this.editIndex == -1 ? 'Agregar':'Editar';
            }
        },
        methods: {
            ...mapActions(['setSnackbar']),
        
            getConceptos(){
                Conceptos().get("/").then((response) => {
                    this.conceptos = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            postMovimientoDeposito(id){
                let data ={
                    depositos_id:1,
                    conceptos_id:id,
                    existencia:0
                }
                MovimientoDeposito().post("/",{data:data}).then((response) => {
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                })
            },
            getEmpresa(){
                Empresa().get("/").then((response)  => {
                    this.empresas = response.data.data;
                    for (let i = 0; i < this.empresas.length; i++) {
                        this.empresas[i].text = this.empresas[i].nombre_comercial;
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos = response.data.data;
                    for (let i = 0; i < this.grupos.length; i++) {
                        this.grupos[i].text = this.grupos[i].nombre;
                    }
                }).catch(e => {
                    console.log(e);
                })
            },
            getSubgrupos(){
                SubGrupos().get("/").then((response) => {
                    this.subgrupos = response.data.data
                    for (let i = 0; i < this.subgrupos.length; i++) {
                       this.subgrupos[i].text = this.subgrupos[i].nombre;
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteConceptos(item){
                Conceptos().delete(`/${item.id}`).then((response)  => {
                    console.log(response);
                    this.exito = "Se elimino el concepto exitosamente.";
                    this.setSnackbar(true);
                    const index = this.conceptos.indexOf(item);
                    this.conceptos.splice(index,1);
                }).catch(e  => {
                    console.log(e);
                    this.error = "No se pudo eliminar este concepto";
                    this.setSnackbar(true);
                });
            },
            postConceptos(item){
                let formdata = new FormData();
                formdata.append('image',this.imagen);
                formdata.append('data',JSON.stringify(item));

                Conceptos().post("/",formdata).then((response) => {
                    console.log(response.data.data);
                    this.exito = "Se creo exitosamente";
                    this.setSnackbar(true);
                    this.conceptos.push(response.data.data);
                    this.close();
                    if(response.data.data.tipos_conceptos_id !== 1){
                        this.postMovimientoDeposito(response.data.data.id);
                    }
                }).catch(e => {
                    console.log(e);
                    this.error = "No se pudo crear este concepto";
                    this.setSnackbar(true);
                    this.loading = false;
                });
            },
            updateConceptos(item){
                delete item.imagen;
                let formdata = new FormData();
                formdata.append('image',this.imagen);
                formdata.append('data',JSON.stringify(item));

                Conceptos().post("/",formdata).then((response) => {
                    this.exito = "Se actualizo exitosamente";
                    this.setSnackbar(true);
                    Object.assign(this.conceptos[this.editIndex],item);
                    this.editIndex = -1;
                    this.close();
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                    this.error = "No se pudo actualizar este concepto";
                    this.setSnackbar(true);
                    this.loading = false;
                });
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar este Concepto?') && this.deleteConceptos(item);
            },
            editedItem(item){
                this.error = null;
                this.exito = null;
                this.dialog = true;
                this.editIndex = this.conceptos.indexOf(item);
                this.editItem = Object.assign({},item);
                this.showImage ='http://192.168.0.253:81/api/images/'+this.editItem.imagen;
            },
            close(){
                this.dialog = false;
                setTimeout(() => {
                    this.editIndex = -1;
                    this.editItem = Object.assign({},this.defaultItem);
                    this.showImage='http://192.168.0.253:81/api/images/default.png';
                },300);
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
            procesoImg(evt){
                if(evt){
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        this.showImage = e.target.result;
                        this.imagen = evt;
                    }
                    reader.readAsDataURL(evt);
                }else{
                    this.showImage='http://192.168.0.253:81/api/images/'+this.editItem.imagen;
                }
            },
            changeGrupo(evt){
                this.subgruposSelect = [];
                for (let i = 0; i < this.grupos.length; i++){
                    if(this.grupos[i].text == evt){
                        this.editItem.grupos_id = this.grupos[i].id;
                        for (let e = 0; e < this.subgrupos.length; e++) {
                            if(this.subgrupos[e].grupos_id == this.grupos[i].id){
                                this.subgruposSelect.push(this.subgrupos[e]);
                            }
                        }
                    }
                }
            },
            changeSubGrupo(evt){
                for (let i = 0; i < this.subgruposSelect.length; i++) {
                    if(this.subgruposSelect[i].text == evt){
                        this.editItem.subgrupos_id = this.subgruposSelect[i].id;
                    }
                }
            },
            changeTipo(evt){
                for (let i = 0; i < this.tipos.length; i++) {
                    if(this.tipos[i].text == evt){
                        this.editItem.tipos_conceptos_id = this.tipos[i].id
                    }
                }
            },
            changeEmpresa(evt){
                for (let i = 0; i < this.empresas.length; i++) {
                    if(this.empresas[i].text == evt){
                        this.editItem.empresa_id=this.empresas[i].id;
                    }
                }
            }
        },
    }
</script>

<style scope>
    .color{
        background: #eee;
    }
</style>