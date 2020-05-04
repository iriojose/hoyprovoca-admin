<template>
    <v-dialog v-model="dialog" width="500" transition="dialog-bottom-transition">
        <v-card>
            <v-card-title>
                {{user.data.nombre+' '+user.data.apellido}}
                <v-spacer></v-spacer>
                <v-btn small fab @click="close" elevation="0">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-row justify="center" class="pa-5" align="center">
                    <v-img height="250" width="100%" contain :src="showImage" class="mb-5" />

                    <v-form v-model="valid">
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
                    </v-form>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-hover v-slot:default="{hover}">
                    <v-btn 
                        color="#005598" 
                        block 
                        :elevation="hover ? 2:0" 
                        :dark="valid"
                        :disabled="!valid"
                        :loading="loading"
                        @click="postImagen"
                    >
                        Actualizar
                    </v-btn>
                </v-hover>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';

    export default {
        data(){
            return{
                ...variables,
                imagen:null,
                showImage:'',
                icon:'',
                mensaje:'',
                color:'',
                loading:false,
                valid:false,
                rules: [
                    value => !value || value.size < 3000000 || 'Debe pesar menos de 3 MB!',
                ],
            }
        },  
        computed:{
            ...mapState(['modalImagen','user']),
            dialog:{
                get(){ return this.modalImagen },
                set(val){ this.setModalImagen(val)}
            }
        },
        mounted() {
            this.showImage = this.image+this.user.data.imagen;
        },
        methods: {
            ...mapActions(['setModalImagen']),

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
            postImagen(){
                this.loading = true;
                let formdata = new FormData();
                formdata.append('image',this.imagen);
                Images().post(`/main/usuario/${this.user.data.id}`,formdata).then((response) => {
                    this.user.data.imagen = response.data.filename;
                    this.success('Imagen actualizada exitosamente.');
                    this.close();
                }).catch(e =>  {
                    console.log(e);
                    this.error('Error al actualizar imagen.');
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
                    this.showImage=this.image+this.user.data.imagen;
                }
            },
            close(){
                this.setModalImagen(false);
            },
            
        },
    }
</script>