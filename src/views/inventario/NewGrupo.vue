<template>
    <div v-if="$route.name == 'nuevogrupo'">
        <Breadcrumbs :items="items"/>

        <v-row justify="center" class="mx-2">
            <v-card width="500" height="500" class="pa-5">
                <v-form v-model="valid">
                    <v-img height="250" width="100%" contain :src="showImage" class="mb-5" />

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
                        v-model="data.nombre"
                        type="text"
                        :disabled="loading"
                        color="#005598"
                        hint="Nombre"
                        persistent-hint
                        dense
                        counter="20"
                        :rules="[required('Nombre'), maxLength('Nombre',20), minLength('Nombre',2)]"
                    />

                    <v-btn 
                        :dark="valid"
                        :disabled="!valid"
                        :loading="loading"
                        color="#005598"
                        block
                        @click="post()"
                        class="text-capitalize font-weight-bold white--text"
                    >
                        Guardar
                    </v-btn>
                </v-form>
            </v-card>
        </v-row>
    </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import Grupos from '@/services/Grupos';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';

    export default {
        components:{
            Breadcrumbs,
        },
        data() {
            return {
                ...validations,
                ...variables,
                valid:false,
                imagen:null,
                showImage:'',
                loading:false,
                id:null,
                data:{
                    nombre:'',
                    imagen:'default.png',
                    visualizar:0,
                    posicion:0
                },
                default:{
                    nombre:'',
                    imagen:'default.png',
                    visualizar:0,
                    posicion:0
                },
                items: [
                    { text: 'Grupos', disabled: false},
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
                this.getGrupo(this.id);
            }else{
                this.showImage=this.image+'default.png';
            }
        },
        destroyed(){
            window.localStorage.removeItem('editar');
        },
        methods: {
            success(mensaje){
                this.$toasted.success(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-check-outline",
                });
                this.loading = false;
            },
            error(mensaje){
                this.$toasted.error(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-alert-octagon",
                });
                this.loading = false;
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
            getGrupo(id){
                this.loading = true;
                Grupos().get(`/${id}`).then((response) => {
                    this.data = Object.assign({},response.data.data);
                    this.showImage=this.image+this.data.imagen;
                    this.items[1].text="Editar"
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            post(){
                if(this.id){
                    this.updateGrupos(this.id);
                }else{
                    this.postGrupos();
                }
            },
            postGrupos(){
                this.loading = true;
                Grupos().post("/",{data:this.data}).then((response) => {
                    if(this.imagen){
                        this.postImagen(response.data.data.id);
                        this.success("Grupo registrado exitosamente");
                    }else{
                        this.success("Grupo registrado exitosamente");
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.error("Ooops, Ocurrio un error.")
                });
            },
            updateGrupos(id){
                this.loading = true;
                Grupos().post(`/${id}`,{data:this.data}).then(() => {
                    if(this.imagen){
                        this.postImagen(id);
                        this.success("Grupo actualizado exitosamente");
                    }else{
                        this.success("Grupo actualizado exitosamente");
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.error("Ooops, Ocurrio un error.")
                });
            },
            postImagen(id){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/grupos/${id}`,formdata).then(() => {
                    this.success("Imagen subida exitosamente");
                    this.reset();
                }).catch(e =>  {
                    console.log(e);
                    this.error("Erro al subir la imagen");
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