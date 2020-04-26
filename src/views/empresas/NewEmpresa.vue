<template>
    <div v-if="$route.name == 'nuevoempresa'">
        <Breadcrumbs :items="items"/>

        <v-row justify="center" class="mx-2">
            <v-card width="100%" class="pa-5">
                <v-form v-model="valid">
                    <v-row justify="center">
                        <v-col cols="12" md="4" sm="12" align-self="center">
                            <v-img height="150" width="100%" contain :src="showImage" class="mb-5" />

                            <v-file-input
                                :rules="rules"
                                accept="image/png, image/jpeg"
                                placeholder="Seleccionar imagen"
                                append-icon="mdi-camera"
                                label="Imagen Grupo"
                                dense
                                solo
                                :disabled="loading"
                                @change="procesoImg($event)"
                                color="#005598"
                                v-model="imagen"
                            ></v-file-input>

                            <v-text-field
                                label="Nombre"
                                solo
                                v-model="data.nombre_comercial"
                                :disabled="loading"
                                color="#005598"
                                dense
                                :rules="[required('Nombre')]"
                            />
                            <v-text-field
                                label="Rif"
                                solo
                                v-model="data.rif"
                                :disabled="loading || id !==null "
                                color="#005598"
                                dense
                                :rules="[required('Rif')]"
                            />
                        </v-col>
                        <v-col cols="12" md="8" sm="12">
                            <v-row justify="center">
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Correo electrónico"
                                        solo
                                        v-model="data.correo_electronico"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                        :rules="[required('Correo electronico'),emailFormat()]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Telefono"
                                        solo
                                        v-model="data.telefono1"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                        type="number"
                                        :rules="[required('Telefono')]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Direccion"
                                        solo
                                        v-model="data.direccion"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                        :rules="[required('Direccion')]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Pagina web"
                                        solo
                                        v-model="data.pag_web"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Facebook"
                                        solo
                                        v-model="data.facebook"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Instagram"
                                        solo
                                        v-model="data.instagram"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-btn 
                                        :dark="valid"
                                        :disabled="!valid"
                                        :loading="loading"
                                        color="#005598"
                                        block
                                        @click="post"
                                        class="text-capitalize font-weight-bold white--text"
                                    >
                                        Guardar
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>
        </v-row>

        <Snackbar :icon="icon" :color="color" :mensaje="mensaje"/>
    </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import Snackbar from '@/components/snackbars/Snackbar';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';
import {mapActions} from 'vuex';
import Empresa from '@/services/Empresa';

    export default {
        components:{
            Breadcrumbs,
            Snackbar
        },
        data() {
            return {
                ...validations,
                ...variables,
                id:null,
                imagen:null,
                showImage:'',
                valid:false,
                loading:false,
                icon:'',
                color:'',
                mensaje:'',
                data:{
                    telefono1:'',
                    direccion:'',
                    nombre_comercial:'',
                    correo_electronico:'',
                    logo:'default.png',
                    pag_web:'',
                    facebook:'',
                    instagram:'',
                    fecha_registro:new Date().toISOString().substr(0,10),
                },
                default:{
                    telefono1:'',
                    direccion:'',
                    nombre_comercial:'',
                    correo_electronico:'',
                    logo:'default.png',
                    pag_web:'',
                    facebook:'',
                    instagram:'',
                    fecha_registro:new Date().toISOString().substr(0,10),
                },
                items: [
                    { text: 'Empresas', disabled: false},
                    { text: 'Nuevo', disabled: true },
                ],
                rules: [
                    value => !value || value.size < 3000000 || 'Debe pesar menos de 3 MB!',
                ],
            }
        },
        mounted() {
            this.setSnackbar(false);
            this.id = window.localStorage.getItem('editar');
            if(this.id){
                this.getEmpresa(this.id);
            }else{
                this.showImage=this.image+'default.png';
            }
        },
        destroyed(){
            window.localStorage.removeItem('editar');
        },
        methods: {
            ...mapActions(['setSnackbar']),

            mensajeSnackbar(color,icon,mensaje){
                this.color=color;
                this.icon =icon;
                this.mensaje = mensaje;
                this.setSnackbar(true);
                this.loading = false;
            },
            getEmpresa(){
                this.loading = true;
                Empresa().get(`/${this.id}`).then((response) => {
                    this.data = Object.assign({},response.data.data);
                    this.showImage=this.image+this.data.logo;
                    this.items[1].text="Editar"
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            post(){
                if(this.id){
                    this.updateEmpresa(this.id);
                }else{
                    this.postEmpresa();
                }
            },
            postEmpresa(){
                this.loading = true;
                Empresa().post("/",{data:this.data}).then((response) => {
                    if(this.imagen){
                        this.postImagen(response.data.data.id);
                    }else{
                        this.mensajeSnackbar('#388E3C','mdi-check-outline','Empresa registrada exitosamente.');
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Ooops, ocurrio un error.');
                });
            },
            updateEmpresa(id){
                this.loading = true;
                Empresa().post(`/${id}`,{data:this.data}).then(() => {
                    if(this.imagen){
                        this.postImagen(id);
                    }else{
                        this.mensajeSnackbar('#388E3C','mdi-check-outline','Empresa actualizada exitosamente.');
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Ooops, ocurrio un error.');
                });
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
                    this.showImage=this.image+this.data.logo;
                }
            },
            postImagen(id){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/empresa/${id}`,formdata).then(() => {
                    this.mensajeSnackbar('#388E3C','mdi-check-outline','Grupo registrado exitosamente.');
                    this.reset();
                }).catch(e =>  {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Error al subir la imagen.');
                    this.reset();
                });
            }, 
            reset(){
                this.data = Object.assign({},this.default);
                window.localStorage.removeItem('editar');
                this.showImage=this.image+'default.png';
                this.imagen=null;
                this.items[1].text="Nuevo"
                this.id = null;
            } 
        },
    }
</script>