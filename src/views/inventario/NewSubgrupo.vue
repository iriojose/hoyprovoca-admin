<template>
    <div v-if="$route.name == 'nuevosubgrupo'">
        <Breadcrumbs :items="items"/>

        <v-row justify="center" class="mx-2">
            <v-card width="500" height="550" class="pa-5">
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
                        ob
                        :disabled="loading"
                        color="#005598"
                        dense
                        counter="20"
                        :rules="[required('Nombre'), maxLength('Nombre',20), minLength('Nombre',2)]"
                    />

                    <v-dialog v-model="dialog" width="400">
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                v-on="on"
                                label="Grupo"
                                solo
                                v-model="grupo.nombre"
                                :disabled="loading"
                                color="#005598"
                                dense
                                :rules="[required('Grupo')]"
                            />
                        </template>
                        <v-card width="100%" class="pa-2">
                            <v-card-actions>
                                <v-btn 
                                    @click="getGrupos()" 
                                    dark 
                                    class="mb-2 mx-2 text-capitalize caption" 
                                    color="#005598"
                                    :disabled="grupos.length == total || loading ? true:false"
                                >
                                    Ver más 
                                    <v-icon dark class="ml-2">mdi-chevron-right-box</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-text-field
                                    v-model="search"
                                    label="Buscar"
                                    single-line
                                    append-icon="mdi-magnify"
                                    type="text"
                                    color="#005598"
                                    hide-details
                                    dense
                                />
                            </v-card-actions>
                            <v-card-text>
                                <v-data-table
                                    :loading="loading && '#005598'" 
                                    loading-text="Loading... Please wait" 
                                    :headers="headers" 
                                    :items="grupos"  
                                    :search="search"
                                    @click:row="select($event)"
                                >
                                    <template v-slot:item.imagen="{item}">
                                        <v-avatar size="50">
                                            <v-img :src="image+item.imagen"></v-img>
                                        </v-avatar>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-card>
                    </v-dialog>

                    <v-btn 
                        :dark="valid"
                        :disabled="!valid"
                        :loading="loading"
                        color="#005598"
                        block
                        @click="postSubgrupos()"
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
import SubGrupos from '@/services/SubGrupos';
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
                dialog:false,
                imagen:null,
                showImage:'',
                offset:0,
                total:0,
                search:'',
                loading:false,
                icon:'',
                color:'',
                mensaje:'',
                grupo:{
                    nombre:''
                },
                grupos:[],
                rules: [
                    value => !value || value.size < 3000000 || 'Debe pesar menos de 3 MB!',
                ],
                data:{
                    nombre:'',
                    adm_grupos_id:null,
                    imagen:'default.png',
                    visualizar:0,
                    posicion:0
                },
                items: [
                    { text: 'Subgrupos', disabled: false},
                    { text: 'Nuevo', disabled: true },
                ],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                ],
            }
        },
        mounted() {
            this.showImage=this.image+'default.png'
            this.getGrupos();
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
            select(item){
                this.grupo = Object.assign({},item);
                this.data.adm_grupos_id = item.id;
                this.dialog = false;
            },
            postSubgrupos(){
                this.loading = true;
                SubGrupos().post("/",{data:this.data}).then((response) => {
                    if(this.imagen){
                        this.postImagen(response.data.data.id);
                    }else{
                        this.mensajeSnackbar('#388E3C','mdi-check-outline','Subgrupo registrado exitosamente.');
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
            getGrupos(){
                this.loading=true;
                Grupos().get(`/?limit=50&offset=${this.offset}`).then((response) => {
                    this.total=response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
                    this.loading=false;
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            postImagen(id){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/subgrupos/${id}`,formdata).then(() => {
                    this.mensajeSnackbar('#388E3C','mdi-check-outline','Subgrupo registrado exitosamente.');
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
                this.data.adm_grupos_id = null;
                this.grupo.nombre='';
            }
        },
    }
</script>

<style lang="scss" scoped>
    .pointer{
        cursor:pointer;
    }
</style>