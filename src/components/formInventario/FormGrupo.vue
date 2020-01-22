<template>
    <v-form v-model="valid" @submit.prevent="">
        <v-container>
            <v-row justify="center" align="center">
                <v-col cols="12" md="6" sm="12">
                    <v-file-input
                        :rules="rules"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Seleccionar imagen"
                        prepend-icon="mdi-camera"
                        label="Imagen Grupo"
                        dense
                        @change="procesoImg($event)"
                        color="#005598"
                        v-model="imagen"
                    ></v-file-input>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                    <v-text-field
                        label="Nombre"
                        v-model="data.nombre"
                        type="text"
                        clearable
                        outlined
                        color="#005598"
                        dense
                        counter="20"
                        :rules="[required('Nombre'), maxLength('Nombre',20), minLength('Nombre',2)]"
                    />
                </v-col>
                <v-col cols="12" md="12" sm="12" justify-self="center" align-self="center" class="fill-height">
                    <v-img width="500" height="200" contain v-if="showImage" :src="showImage" />
                </v-col>
                <v-col cols="12" md="2" sm="2" :offset="$vuetify.breakpoint.smAndDown ? 0:8">
                    <v-btn 
                        color="#005598" 
                        width="100%" 
                        :dark="valid" 
                        :disabled="!valid" 
                        class="white--text caption"
                        @click="postGrupos"
                    >
                        Enviar
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>

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
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                valid:false,
                snackbar:false,
                error:null,
                imagen:null,
                showImage:null,
                ...validations,
                rules: [
                    value => !value || value.size < 2000000 || 'Debe pesar menos de 2 MB!',
                ],
                data:{
                    nombre:'',
                    visualizar:1,
                    posicion:1,
                    imagen:"default"
                }
            }
        },
        methods: {
            postGrupos(){
                this.error=null;

                Grupos().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                    this.snackbar=true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar=true;
                    this.error="Ocurrio un error.";
                });
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
            }
        },    
    }
</script>