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
                        @click="postGrupos()"
                        class="text-capitalize font-weight-bold white--text"
                    >
                        Guardar
                    </v-btn>
                </v-form>
            </v-card>
        </v-row>

        <Snackbar :icon="icon" :color="color" :mensaje="mensaje"/>
    </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import Grupos from '@/services/Grupos';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';
import Snackbar from '@/components/snackbars/Snackbar';
import {mapActions} from 'vuex';

    export default {
        components:{
            Breadcrumbs,
            Snackbar
        },
        data() {
            return {
                ...validations,
                ...variables,
                valid:false,
                imagen:null,
                showImage:'',
                loading:false,
                icon:'',
                color:'',
                mensaje:'',
                data:{
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
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
            }
        },
        mounted() {
            this.showImage=this.image+'default.png'
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
            postGrupos(){
                this.loading = true;
                Grupos().post("/",{data:this.data}).then((response) => {
                    if(this.imagen){
                        this.postImagen(response.data.data.id);
                    }else{
                        this.mensajeSnackbar('#388E3C','mdi-check-outline','Grupo registrado exitosamente.');
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Ooops, ocurrio un error.');
                });
            },
            postImagen(id){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/grupos/${id}`,formdata).then(() => {
                    this.mensajeSnackbar('#388E3C','mdi-check-outline','Grupo registrado exitosamente.');
                    this.reset();
                }).catch(e =>  {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Ooops, ocurrio un error.');
                });
            },  
            reset(){
                this.showImage=this.image+'default.png';
                this.imagen=null;
                this.data.nombre='';
            }
        },
    }
</script>