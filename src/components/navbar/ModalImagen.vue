<template>
    <v-dialog v-model="dialog" width="500" transition="dialog-bottom-transition">
        <v-card>
            <v-card-title>
                {{user.data.nombre+' '+user.data.apellido}}
                <v-spacer></v-spacer>
                <v-hover v-slot:default="{hover}">
                    <v-btn small fab :elevation="hover ? 2:0" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-hover>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-row justify="center" class="pa-5" align="center">
                    <v-col cols="12" md="6" sm="12">
                        <croppa 
                            v-model="myCroppa"
                            :width="250"
                            :height="250"
                            :canvas-color="'#eee'"
                            prevent-white-space
                            :placeholder="'Selecciona una imagen'"
                            :placeholder-font-size="20"
                            @new-image-drawn="onNewImage()"
                            @zoom="onZoom()"
                            @init="onInit()"
                            initial-image="https://zhanziyang.github.io/vue-croppa/static/500.jpeg"
                        ></croppa>
                    </v-col>
                        
                    <v-col cols="12" md="12" sm="12">
                        <v-slider
                            track-color="#eee"
                            class="mt-8"
                            id="#slider"
                            v-model="sliderVal"
                            append-icon="mdi-camera-control"
                            prepend-icon="mdi-camera"
                            thumb-label
                            color="teal"
                            @input="onSliderChange($event)"
                            :min="sliderMin" 
                            :max="sliderMax" 
                            step="0.001" 
                        ></v-slider>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-hover v-slot:default="{hover}">
                    <v-btn 
                        color="#005598" 
                        dark block 
                        :elevation="hover ? 2:0" 
                        @click="editImage"
                    >
                        Actualizar
                    </v-btn>
                </v-hover>
            </v-card-actions>
        </v-card>

        <Snackbar :icon="icon" :color="color" :mensaje="mensaje"/>
    </v-dialog>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';
import Snackbar from '@/components/snackbars/Snackbar';

    export default {
        components:{
            Snackbar
        },
        data(){
            return{
                ...variables,
                imagen:null,
                myCroppa:{},
                sliderVal:0,
                sliderMin:0,
                sliderMax:0,
                icon:'',
                mensaje:'',
                color:'',
                loading:false,
            }
        },  
        computed:{
            ...mapState(['modalImagen','user']),

            dialog:{
                get(){ return this.modalImagen },
                set(val){ this.setModalImagen(val)}
            }
        },
        methods: {
            ...mapActions(['setModalImagen','user','setSnackbar']),

            mensajeSnackbar(color,icon,mensaje){
                this.color=color;
                this.icon =icon;
                this.mensaje = mensaje;
                this.setSnackbar(true);
                this.loading = false;
            },
            postImagen(){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/usuario/${this.user.data.id}`,formdata).then(() => {
                    this.mensajeSnackbar('#388E3C','mdi-check-outline','Imagen actualizada exitosamente.');
                }).catch(e =>  {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Error al subir la imagen.');
                });
            },  
            
            close(){
                this.setModalImagen(false);
            },
            onNewImage() {
                this.sliderVal = this.myCroppa.scaleRatio;
                this.sliderMin = this.myCroppa.scaleRatio / 2;
                this.sliderMax = this.myCroppa.scaleRatio * 2;
            },
            //al mover el slide se desencadena este evento
            onSliderChange(evt) {
                var increment = evt;
                this.myCroppa.scaleRatio = + increment;
            },
            //zoom a la imagen
            onZoom() {
                this.sliderVal = this.myCroppa.scaleRatio;
            },
            //le pone el fondo circular
            onInit() {
                this.myCroppa.addClipPlugin(function (ctx, x, y, w, h) {
                    ctx.beginPath()
                    ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
                    ctx.closePath()
                });
            },
            //edita la imagen
            editImage(){
                let url = this.myCroppa.generateDataUrl();
                if(!url){//requiere una imagen
                    alert('No imagen');
                    return
                }else{
                    this.postImagen();
                }
            },
        },
    }
</script>