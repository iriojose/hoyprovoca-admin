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
                        hint="Nombre"
                        persistent-hint
                        v-model="data.nombre"
                        type="text"
                        ob
                        :disabled="loading2"
                        color="#005598"
                        dense
                        counter="20"
                        :rules="[required('Nombre'), maxLength('Nombre',20), minLength('Nombre',2)]"
                    />

                    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition">
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                v-on="on"
                                label="Grupo"
                                solo
                                hint="Grupo"
                                persistent-hint
                                v-model="grupo.nombre"
                                :disabled="loading2"
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
                                    :loading="loading2 && '#005598'" 
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
                        :loading="loading2"
                        color="#005598"
                        block
                        @click="post"
                        class="text-capitalize font-weight-bold white--text"
                    >
                        Guardar
                    </v-btn>
                </v-form>
            </v-card>
        </v-row>

        <ModalMensaje 
            :dialog="dialog2" :icon="icon"
            :color="color"
            :mensaje="mensaje"
            :loading="loading" 
            :error="errorPeticion"
        > 
            <template v-slot:nuevo>
                <v-hover v-slot:default="{hover}">
                    <v-btn 
                        :elevation="hover ? 3:1" :color="hover ? '#005598':null"
                        :dark="hover ? true:false" class="text-capitalize"
                        @click="dialog2 = false"
                    >
                        ¿Crear Subgrupo?
                    </v-btn>
                </v-hover>
            </template>
            <template v-slot:close>
                <v-hover v-slot:default="{hover}">
                    <v-btn 
                        :elevation="hover ? 3:1" :color="hover ? '#005598':null"
                        :dark="hover ? true:false" class="text-capitalize"
                        to="/subgrupos"
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
import ModalMensaje from '@/components/dialogs/ModalMensaje';
import SubGrupos from '@/services/SubGrupos';
import Grupos from '@/services/Grupos';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';

    export default {
        components:{
            Breadcrumbs,
            ModalMensaje
        },
        data() {
            return {
                //modal variables
                icon:'',
                mensaje:'',
                color:'',
                loading2:false,
                dialog2:false,
                errorPeticion:true,
                //variables del form
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
                default:{
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
            this.id = window.localStorage.getItem('editar');
            if(this.id){
                this.items[1].text="Editar"
                this.getSubgrupo(this.id);
            }else{
                this.showImage=this.image+'default.png';
            }
            this.getGrupos();
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
            post(){
                this.dialog2 = true;
                if(this.id){
                    this.items[1].text="Editar"
                    this.updateSubgrupos(this.id);
                }else{
                    this.postSubgrupos();
                }
            },
            postSubgrupos(){
                this.loading = true;
                SubGrupos().post("/",{data:this.data}).then((response) => {
                    if(this.imagen){
                        this.postImagen(response.data.data.id,"Subgrupo registrado exitosamente.");
                    }else{
                        this.success("Subgrupo registrado exitosamente.");
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.error("Ooops, Ocurrio un error");
                });
            },
            updateSubgrupos(id){
                this.loading = true;
                SubGrupos().post(`/${id}`,{data:this.data}).then(() => {
                    if(this.imagen){
                        this.postImagen(id,"Subgrupo actualizado exitosamente.");
                    }else{
                        this.success("Subgrupo actualizado exitosamente.");
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.error("Ooops, Ocurrio un error");
                });
            },
            getSubgrupo(id){
                this.loading2 = true;
                SubGrupos().get(`/${id}`).then((response) => {
                    this.data = Object.assign({},response.data.data);
                    this.showImage=this.image+this.data.imagen;
                    this.getGrupo(response.data.data.adm_grupos_id);
                }).catch(e => {
                    console.log(e);
                });
            },
            getGrupo(id){
                Grupos().get(`/${id}`).then((response) => {
                    this.grupo = Object.assign({},response.data.data);
                    this.loading2 = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            getGrupos(){
                this.loading2=true;
                Grupos().get(`/?limit=50&offset=${this.offset}`).then((response) => {
                    this.total=response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
                    this.loading2=false;
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            postImagen(id,mensaje){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/subgrupos/${id}`,formdata).then(() => {
                    this.success(mensaje);
                    this.reset();
                }).catch(e =>  {
                    console.log(e);
                    this.error(mensaje+','+"\n Pero hubo un error al subir la imagen");
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
                this.grupo.nombre = '';
            }
        },
    }
</script>