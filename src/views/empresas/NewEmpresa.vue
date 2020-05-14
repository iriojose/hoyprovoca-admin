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
                                hint="Nombre comercial"
                                persistent-hint
                                dense
                                :rules="[required('Nombre')]"
                            />
                            <v-text-field
                                label="Rif"
                                solo
                                hint="J-00000000-0"
                                persistent-hint
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
                                        hint="ejemplo@gmail.com"
                                        persistent-hint
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
                                        hint="0000-000-0000"
                                        persistent-hint
                                        @input="change"
                                        type="text"
                                        :rules="[required('Telefono'), minLength('Telefono',13),maxLength('Telefono',13)]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Direccion"
                                        solo
                                        hint="Direccion fisica"
                                        persistent-hint
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
                                        hint="http://"
                                        persistent-hint
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
                                        hint="http://"
                                        persistent-hint
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
                                        hint="@ejemplo"
                                        persistent-hint
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


        <ModalMensaje 
            :dialog="dialog" 
            :icon="icon"
            :color="color"
            :mensaje="mensaje"
            :loading="loading" 
            :error="errorPeticion"
        > 
            <template v-slot:nuevo>
                <v-hover v-slot:default="{hover}">
                    <v-btn 
                        :elevation="hover ? 3:1"
                        dark class="text-capitalize white--text"
                        @click="dialog = false"
                    >
                        ¿Crear una Empresa?
                    </v-btn>
                </v-hover>
            </template>
            <template v-slot:close>
                <v-hover v-slot:default="{hover}">
                    <v-btn 
                        :elevation="hover ? 3:1"
                        :dark="hover ? true:false" class="text-capitalize"
                        to="/empresas"
                    >
                        No, volver
                    </v-btn>
                </v-hover>
            </template>
        </ModalMensaje>
    </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';
import Empresa from '@/services/Empresa';
import ModalMensaje from '@/components/dialogs/ModalMensaje';

    export default {
        components:{
            Breadcrumbs,
            ModalMensaje
        },
        data() {
            return {
                ...validations,
                ...variables,
                icon:'',
                mensaje:'',
                color:'',
                errorPeticion:true,
                dialog:false,

                id:null,
                imagen:null,
                showImage:'',
                valid:false,
                loading:false,
                data:{
                    telefono1:'',
                    direccion:'',
                    nombre_comercial:'',
                    correo_electronico:'',
                    pag_web:null,
                    facebook:null,
                    instagram:null,
                    fecha_registro:new Date().toISOString().substr(0,10),
                },
                default:{
                    telefono1:'',
                    direccion:'',
                    nombre_comercial:'',
                    correo_electronico:'',
                    pag_web:null,
                    facebook:null,
                    instagram:null,
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
            success(mensaje){
                this.icon = 'mdi-checkbox-marked-circle-outline';
                this.mensaje = mensaje;
                this.color = '#388E3C';
                this.loading = false;
            },
            error(mensaje){
                this.icon = 'mdi-alert-octagon';
                this.mensaje = mensaje;
                this.color = '#D32F2F';
                this.errorPeticion = false;
                this.loading = false;
            },
            change(){
                if(this.data.telefono1.length == 4){
                    this.data.telefono1+='-';
                }else if(this.data.telefono1.length == 8){
                    this.data.telefono1+='-';
                }
            },
            getEmpresa(){
                this.loading = true;
                Empresa().get(`/${this.id}`).then((response) => {
                    this.data = Object.assign({},response.data.data);
                    this.showImage=this.image+this.data.imagen;
                    this.items[1].text="Editar"
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            post(){
                this.dialog = true;
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
                        this.postImagen(response.data.data.id,'Empresa registrada exitosamente.');
                    }else{
                        this.success('Empresa registrada exitosamente.');
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.error('Ooops, ocurrio un error.');
                });
            },
            updateEmpresa(id){
                this.loading = true;
                delete this.data.fecha_registro;
                Empresa().post(`/${id}`,{data:this.data}).then(() => {
                    if(this.imagen){
                        this.postImagen(id,'Empresa actualizada exitosamente.');
                    }else{
                        this.success('Empresa actualizada exitosamente.');
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.error('Ooops, ocurrio un error.');
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
                    this.showImage=this.image+this.data.imagen;
                }
            },
            postImagen(id,mensaje){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/empresa/${id}`,formdata).then(() => {
                    this.success(mensaje);
                    this.reset();
                }).catch(e =>  {
                    console.log(e);
                    this.error(mensaje+"\n Pero hubo un error al subir la imagen");
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