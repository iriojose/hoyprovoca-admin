<template>
    <v-form v-model="valid" @submit.prevent="">
        <v-container>
            <v-row>
                <v-col cols="12" md="3" sm="12">
                    <v-hover v-slot:default="{hover}">
                        <v-avatar size="150" class="elevatio-5">
                            <v-img :src="imagen" :class="hover ? 'elevation-10':'elevation-2'">
                                <v-row class="fill-height" align="center" justify="center">
                                    <template v-if="hover">
                                        <v-btn fab color="blue darken-5" @click="modal= !modal" elevation="3">
                                            <v-icon color="#fff">add_circle</v-icon>
                                        </v-btn>
                                    </template>
                                </v-row>
                            </v-img>
                        </v-avatar>
                    </v-hover>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                    <v-select
                        v-model="selectGrupo"
                        :items="grupos"
                        label="Grupos"
                        outlined
                        dense
                        hide-selected
                        hide-details
                        color="#005598"
                        @change="refactorSubgrupo($event)"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                    <v-select
                        v-model="selectSubgrupo"
                        :items="selectesSubgrupos"
                        label="SubGrupos"
                        outlined
                        hide-selected
                        dense
                        hide-details
                        :disabled="selectGrupo==''"
                        color="#005598"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12">
                    <v-select
                        v-model="empresa_id"
                        :items="empresas"
                        label="Empresas"
                        outlined
                        hide-selected
                        hide-details
                        dense
                        color="#005598"
                    ></v-select>
                </v-col>
            </v-row>
        </v-container>

        <v-dialog v-model="modal" width="400" close-delay>
            <v-card>
                <v-card-title class="headline grey lighten-4">
                    Editar foto  <v-spacer />
                    <v-btn icon color="#005598" text @click="modal = !modal">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-divider/>

                <v-card-text class="mt-5">     
                    <v-row>
                        <v-col cols="12" md="8" sm="12" :offset="$vuetify.breakpoint.smAndDown ? null:2">
                            <!-- plugins para recortar la imagen -->
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
                        <v-col cols="12" md="8" sm="12" :offset="$vuetify.breakpoint.smAndDown ? null:2">
                            <!-- slider para hacer zoom -->
                            <v-slider
                                track-color="#eee"
                                class="mt-8"
                                id="#slider"
                                v-model="sliderVal"
                                append-icon="panorama"
                                prepend-icon="photo"
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

                <v-card-actions class="mx-5">
                    <v-spacer/>
                    <v-btn text @click="modal = !modal" elevation="0" class="blue--text">
                        Cancelar
                    </v-btn>
                    <v-hover v-slot:default="{hover}">
                        <v-btn 
                            :color="hover ? '#005598':'#005598'" 
                            :elevation="hover ? '5':'1'" 
                            dark 
                            class="px-4"
                            @click="editImage()"
                        >
                            Guardar
                        </v-btn>
                    </v-hover>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script>
import Grupos from '@/services/Grupos';
import SubGrupos from '@/services/SubGrupos';
import Conceptos from '@/services/Conceptos';
import Empresa from '@/services/Empresa';
import validations from '@/validations/validations';

    export default {
        data() {
            return {
                selectGrupo:'',
                selectSubgrupo:'',
                selectesSubgrupos:[],
                valid:false,
                snackbar:false,
                error:null,
                grupos:[],
                subgrupos:[],
                empresas:[],
                ...validations,
                data:{
                    empresa_id:5,
                    subgrupos_id:1,
                    grupos_id:1,
                },

                modal:false,
                imagen: "https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-icono-de-perfil-de-avatar-predeterminado-para-hombre-marcador-de-posici%C3%B3n-de-foto-gris-vector-de-ilustr.jpg?ver=6",
                myCroppa:{},
                sliderVal:0,
                sliderMin:0,
                sliderMax:0,
            }
        },
        mounted() {
            this.getGrupos();
            this.getSubGrupos();
            this.getEmpresa();
        },
        methods: {
            getEmpresa(){
                Empresa().get("/").then((response) => {
                    this.empresas=response.data.data;
                    this.empresas = this.refactorVariable(this.empresas);
                }).catch(e => {
                    console.log(e);
                }); 
            },
            getGrupos(){
                Grupos().get("/").then((response) => {
                    this.grupos=response.data.data;
                    this.grupos=this.refactorVariable(this.grupos);
                    console.log(this.grupos);
                }).catch(e => {
                    console.log(e);
                });
            },
            getSubGrupos(){
                SubGrupos().get("/").then((response) => {
                    this.subgrupos=response.data.data;
                    this.subgrupos=this.refactorVariable(this.subgrupos);
                    console.log(this.subgrupos);
                }).catch(e => {
                    console.log(e);
                });
            },
            postConceptos(){
                this.error=null;
                Conceptos().post("/",{data:this.data}).then((response) => {
                    console.log(response);
                    this.snackbar=true;
                }).catch(e => {
                    console.log(e);
                    this.snackbar=true;
                    this.error="Ocurrio un error.";
                });
            },
            
            refactorVariable(array){//crea una propiedad text para que se pueda leer en los select
                array.filter(value => value.text=value.nombre);
                return array;
            },
            refactorSubgrupo(evt){//agrupa los subgrupos que pertenecen a un grupo
                this.selectGrupo=evt;
                let id = this.grupos.filter(a => a.nombre == evt);
                this.selectesSubgrupos = this.subgrupos.filter(a => a.grupos_id == id[0].id);
            },

            //EVENTOS DEL VUE CROPPA
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
                    return;
                }else{
                    this.imagen=url;
                    this.modal=false;
                }
            },
        },
    }
</script>