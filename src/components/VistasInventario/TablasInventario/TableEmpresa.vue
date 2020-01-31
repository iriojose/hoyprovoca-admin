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
            :items="empresas"
            class="elevation-0"
            :search="search"
        >
            <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editedItem(item)">edit</v-icon>
                <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" width="900" @MouseEvent="close">
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
                    <v-form v-model="valid" @submit.prevent="" class="px-5">
                        <v-row>
                            <v-col cols="12" md="4" sm="12">
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
                                            label="Logo"
                                            dense
                                            @change="procesoImg($event)"
                                            color="#005598"
                                            v-model="imagen"
                                        ></v-file-input>
                                    </v-col>
                                    <v-col cols="12" md="12" sm="12">
                                        <v-text-field
                                            label="Rif"
                                            v-model="editItem.rif"
                                            type="text"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            counter="20"
                                            :rules="[required('Rif'), maxLength('Rif',20), minLength('Rif',2)]"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="12" sm="12">
                                        <v-text-field
                                            label="Nombre"
                                            v-model="editItem.nombre_comercial"
                                            type="text"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            counter="40"
                                            :rules="[required('Nombre'), maxLength('Nombre',20), minLength('Nombre',2)]"
                                        />
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="8" sm="12">
                                <v-row>
                                    <v-col cols="12" md="6" sm="12">
                                        <v-text-field
                                            label="Razón social"
                                            v-model="editItem.razon_social"
                                            type="text"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            counter="40"
                                            :rules="[required('Razón social'), maxLength('Razón social',40), minLength('Razón social',2)]"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6" sm="12">
                                        <v-text-field
                                            label="Dirección"
                                            v-model="editItem.direccion"
                                            type="text"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            counter="40"
                                            :rules="[required('Razón social'), maxLength('Razón social',40), minLength('Razón social',2)]"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6" sm="12">
                                        <v-text-field
                                            label="Email"
                                            v-model="editItem.correo_electronico"
                                            type="text"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            :rules="[required('Email'), emailFormat()]"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6" sm="12">
                                        <v-text-field
                                            label="Pagina web"
                                            v-model="editItem.pag_web"
                                            type="text"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            :rules="[urlFormat()]"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6" sm="12">
                                        <v-text-field
                                            label="Pagina web"
                                            v-model="editItem.facebook"
                                            type="text"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            :rules="[urlFormat()]"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6" sm="12">
                                        <v-text-field
                                            label="Twitter"
                                            v-model="editItem.twitter"
                                            type="text"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            :rules="[urlFormat()]"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6" sm="12">
                                        <v-text-field
                                            label="Instagram"
                                            v-model="editItem.instagram"
                                            type="text"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            :rules="[urlFormat()]"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6" sm="12">
                                        <v-text-field
                                            label="Telefono"
                                            v-model="editItem.telefono1"
                                            type="number"
                                            clearable
                                            outlined
                                            color="#005598"
                                            dense
                                            counter="11"
                                            :rules="[required('Telefono'),maxLength('Telefono',11)]"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="12" sm="12">
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn 
                                                :dark="valid" 
                                                :disabled="!valid" 
                                                :loading="loading"
                                                class="white--text caption text-capitalize"
                                                @click="save(editItem)"
                                            >
                                                Enviar
                                            </v-btn>
                                        </v-card-actions>
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
import validations from '@/validations/validations';
import Empresa from '@/services/Empresa';
import {mapActions} from 'vuex';
import Snackbar from '@/components/helpers/Snackbar';

    export default {
        components:{
            Snackbar
        },
        data(){
            return {
                search:'',
                valid:false,
                loading:false,
                exito:null,
                error:null,
                empresas:[],
                dialog:false,
                editIndex:-1,
                showImage:'http://192.168.0.253:81/api/images/default.png',
                imagen:null,
                ...validations,
                headers: [
                    { text: 'Id',align: 'left',sortable: true,value:'id',},
                    { text: 'Rif',sortable: true, value: 'rif' },
                    { text: 'Razon social', value: 'razon_social' },
                    { text: 'Nombre', value: 'nombre_comercial' },
                    { text: 'Direccion', value: 'direccion' },
                    { text: 'Email', value: 'correo_electronico' },
                    { text: 'Telefono', value: 'telefono1' },
                    { text: 'Acciones', value: 'action', sortable: false },
                ],
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
                editItem:{
                    rif:'',
                    razon_social:'',
                    nombre_comercial:'',
                    fecha_registro:'2019-02-22T03',
                    direccion:'',
                    telefono1:'',
                    telefono2:'',
                    pag_web:'',
                    facebook:'',
                    twitter:'',
                    instagram:'',
                    logo:'default.png',
                    correo_electronico:'',
                    serial_disk:'',
                    nota:''
                },
                defaultItem:{
                    rif:'',
                    razon_social:'',
                    nombre_comercial:'',
                    fecha_registro:'2019-02-22T03',
                    direccion:'',
                    telefono1:'',
                    telefono2:'',
                    pag_web:'',
                    facebook:'',
                    twitter:'',
                    instagram:'',
                    logo:'default.png',
                    correo_electronico:'',
                    serial_disk:'',
                    nota:''
                }
            }
        },
        mounted() {
            this.getEmpresas();
        },
        computed: {
            title(){
                return this.editIndex == -1 ? 'Agregar':'Editar';
            }
        },
        methods: {
            ...mapActions(['setSnackbar']),

            getEmpresas(){
                Empresa().get("/").then((response) => {
                    this.empresas = response.data.data;
                }).catch(e => {
                    console.log(e);
                });
            },
            deleteEmpresa(item){
                Empresa().delete(`/${item.id}`).then((response) => {
                    console.log(response);
                    this.exito = 'Se elimino la empresa exitosamente.';
                    const index = this.empresas.indexOf(item);
                    this.empresas.splice(index,1);
                    this.setSnackbar(true);
                }).catch(e => {
                    console.log(e);
                    this.error = 'No se pudo eliminar esta empresa.';
                    this.setSnackbar(true);
                });
            },
            postEmpresas(item){
                Empresa().post("/",{data:item}).then((response) =>  {
                    console.log(response);
                    this.empresas.push(item);
                    this.exito = "Se creo la empresa exitosamente";
                    this.setSnackbar(true);
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = "No se pudo crear la Empresa";
                    this.setSnackbar(true);
                    this.loading =false;
                });
            },
            updateEmpresas(item){
                item.fecha_registro = '2019-02-22T03';
                Empresa().post(`/${item.id}`,{data:item}).then((response) => {
                    console.log(response);
                    Object.assign(this.empresas[this.editIndex],item);
                    this.editIndex = -1;
                    this.exito = "Se actualizo "+ item.nombre_comercial +" exitosamente";
                    this.setSnackbar(true);
                    this.close();
                }).catch(e => {
                    console.log(e);
                    this.error = "No se pudo Actualizar "+ item.nombre_comercial;
                    this.setSnackbar(true);
                    this.loading = false;
                });
            },
            deleteItem(item){
                this.error = null;
                this.exito = null;
                confirm('¿Esta seguro de eliminar esta empresa?') && this.deleteEmpresa(item);
            },
            save(item){
                this.loading = true;
                this.error = null;
                this.exito = null;
                
                if(this.editIndex > -1){
                    this.updateEmpresas(item);
                }else{
                    this.postEmpresas(item);
                }
            },
            editedItem(item){
                this.error = null;
                this.exito = null;
                this.dialog = true;
                this.editIndex = this.empresas.indexOf(item);
                this.editItem = Object.assign({},item);
            },
            close(){
                this.dialog = false;
                setTimeout(() => {
                    this.editIndex = -1;
                    this.editItem = Object.assign({},this.defaultItem);
                    this.showImage='http://192.168.0.253:81/api/images/default.png';
                },300);
            },
            procesoImg(evt){
                this.showImage = null;
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

<style scope>
    .color{
        background: #eee;
    }
</style>