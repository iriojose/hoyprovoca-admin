<template>
    <div v-if="$route.name == 'nuevoproducto'">
        <Breadcrumbs :items="items"/>
        
        <v-row justify="center" class="mx-2">
            <v-card width="100%" class="pa-5">
                 <v-form v-model="valid">
                    <v-row justify="center">
                        <v-col cols="12" md="4" sm="12">
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

                            <v-dialog v-model="dialog1" width="400" transition="dialog-bottom-transition">
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-on="on"
                                        label="Grupo"
                                        solo
                                        v-model="grupo.nombre"
                                        :disabled="loading"
                                        hint="Grupo"
                                        persistent-hint
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
                                            :disabled="grupos.length == total1 || loading ? true:false"
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

                            <v-dialog v-model="dialog2" width="400" transition="dialog-bottom-transition">
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-on="on"
                                        label="Subgrupo"
                                        solo
                                        hint="Subgrupo"
                                        persistent-hint
                                        v-model="subgrupo.nombre"
                                        :disabled="grupo.nombre == '' ? true:false"
                                        color="#005598"
                                        dense
                                        :rules="[required('Subgrupo')]"
                                    />
                                </template>
                                <v-card width="100%" class="pa-2">
                                    <v-card-actions>
                                        <v-btn 
                                            @click="getSubgrupos()" 
                                            dark 
                                            class="mb-2 mx-2 text-capitalize caption" 
                                            color="#005598"
                                            :disabled="subgrupos.length == total2 || loading ? true:false"
                                        >
                                            Ver más 
                                            <v-icon dark class="ml-2">mdi-chevron-right-box</v-icon>
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-text-field
                                            v-model="search2"
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
                                            :items="subgrupos"  
                                            :search="search2"
                                            @click:row="select2($event)"
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

                            <v-select 
                                v-model="tipos[0]"
                                :items="tipos"
                                return-object
                                label="Tipo de Producto"
                                solo
                                hide-selected
                                dense
                                color="#005598"
                                @change="selectTipo($event)"
                            />
                        </v-col>

                        <v-col cols="12" md="8" sm="12">
                            <v-row justify="center">
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Nombre"
                                        solo
                                        hint="Nombre"
                                        persistent-hint
                                        v-model="data.nombre"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                        :rules="[required('Nombre')]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Codigo"
                                        solo
                                        hint="0000001"
                                        persistent-hint
                                        v-model="data.codigo"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                        :rules="[required('Codigo')]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Referencia"
                                        solo
                                        v-model="data.referencia"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                        :rules="[required('Referencia')]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Precio"
                                        solo
                                        type="number"
                                        v-model="data.precio_a"
                                        :disabled="loading"
                                        hint="Bs."
                                        persistent-hint
                                        color="#005598"
                                        dense
                                        :rules="[required('Precio')]"
                                    />
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-textarea
                                        label="Descripcion"
                                        v-model="data.descripcion"
                                        :disabled="loading"
                                        color="#005598"
                                        solo
                                        dense
                                        :rules="[required('Descripcion')]"
                                    ></v-textarea>
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
import Conceptos from '@/services/Conceptos';
import Grupos from '@/services/Grupos';
import SubGrupos from '@/services/SubGrupos';
import Movimiento_deposito from '@/services/Movimiento_deposito';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';
import Snackbar from '@/components/snackbars/Snackbar';
import {mapState,mapActions} from 'vuex';

    export default {
        components:{
            Breadcrumbs,
            Snackbar
        },
        data() {
            return {
                grupo:{
                    nombre:''
                },
                subgrupo:{
                    nombre:''
                },
                tipo:{},
                offset:0,
                offset2:0,
                total1:0,
                total2:0,
                grupos:[],
                subgrupos:[],
                dialog1:false,
                dialog2:false,
                search:'',
                search2:'',

                ...variables,
                ...validations,
                icon:'',
                mensaje:'',
                color:'',
                showImage:'',
                imagen:null,
                loading:false,
                valid:false,
                id:null,
                data:{
                    imagen:'default.png',
                    nombre:'',
                    codigo:'',
                    referencia:'',
                    descripcion:'',
                    adm_grupos_id:0,
                    adm_subgrupos_id:0,
                    adm_empresa_id:0,
                    adm_tipos_conceptos_id:2,
                    precio_a:0,
                },
                default:{
                    nombre:'',
                    codigo:'',
                    referencia:'',
                    descripcion:'',
                    precio_a:0,
                    adm_grupos_id:0,
                    adm_subgrupos_id:0,
                    adm_empresa_id:0,
                    adm_tipos_conceptos_id:2,
                    imagen:'default.png'
                },
                movimiento:{
                    adm_conceptos_id: 0,
                    adm_depositos_id: 1,
                    existencia: 0
                },
                items: [
                    { text: 'Productos', disabled: false},
                    { text: 'Nuevo', disabled: true },
                ],
                rules: [
                    value => !value || value.size < 3000000 || 'Debe pesar menos de 3 MB!',
                ],
                tipos: [
                    { text: 'Producto', id:2},
                    { text: 'Servicio', id:1, disabled:true},
                ],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                ],
            }
        },
        computed: {
            ...mapState(['user'])
        },
        mounted() {
            this.setSnackbar(false);
            this.data.adm_empresa_id = this.user.data.adm_empresa_id;

            this.id = window.localStorage.getItem('editar');
            if(this.id){
                this.items[1].text="Editar"
                this.getConcepto(this.id);
            }else{
                this.showImage=this.image+'default.png';
            }

            this.getGrupos();
        },
        destroyed(){
            window.localStorage.removeItem('editar');
        },
        methods:{
            ...mapActions(['setSnackbar']),

            mensajeSnackbar(color,icon,mensaje){
                this.color=color;
                this.icon =icon;
                this.mensaje = mensaje;
                this.setSnackbar(true);
                this.loading = false;
            },
            //metodos para traer el grupo y subgrupo al inicio
            getConcepto(id){
                this.loading = true;
                Conceptos().get(`/${id}`).then((response) => {
                    this.data = Object.assign({},response.data.data);
                    this.showImage=this.image+this.data.imagen;
                    this.getGrupo(this.data.adm_grupos_id);
                }).catch(e => {
                    console.log(e);
                });
            },
            getGrupo(id){
                Grupos().get(`/${id}`).then((response) => {
                    this.grupo = Object.assign({},response.data.data);
                    this.loading = false;
                    this.getSubgrupo(this.data.adm_subgrupos_id);
                }).catch(e => {
                    console.log(e);
                });
            },
            getSubgrupo(id){
                SubGrupos().get(`/${id}`).then((response) => {
                    this.subgrupo = Object.assign({},response.data.data);
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            
            //metodos para seleccionar grupos
            getGrupos(){
                this.loading=true;
                Grupos().get(`/?limit=50&offset=${this.offset}`).then((response) => {
                    this.total1=response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
                    this.loading=false;
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            select(item){
                this.subgrupo.nombre = '';
                this.data.adm_subgrupos_id = null;

                this.grupo = Object.assign({},item);
                this.data.adm_grupos_id = item.id;
                this.dialog1 = false;
                this.getSubgrupos(item.id);
            },
            getSubgrupos(id){
                Grupos().get(`/${id}/subgrupos/?limit=50&offset=${this.offset2}`).then((response) => {
                    this.total2=response.data.totalCount;
                    response.data.data.filter(a => this.subgrupos.push(a));
                    this.loading=false;
                    this.offset2+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            select2(item){
                this.subgrupo = Object.assign({},item);
                this.data.adm_subgrupos_id = item.id;
                this.dialog2 = false;
            },
            selectTipo(item){
                this.data.adm_tipos_conceptos_id = item.id;
            },

            //metodos de imagenes
            postImagen(id){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/conceptos/${id}`,formdata).then(() => {
                    this.mensajeSnackbar('#388E3C','mdi-check-outline','Producto registrado exitosamente.');
                    this.reset();
                }).catch(e =>  {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Error al subir la imagen.');
                    this.reset();
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
            //metodos de update y create
            post(){
                if(this.id){
                    this.updateConceptos(this.id);
                }else{
                    this.postConceptos();
                }
            },
            postConceptos(){
                this.loading = true;
                Conceptos().post("/",{data:this.data}).then((response) => {
                    if(this.imagen){
                        this.postImagen(response.data.data.id);
                    }else{
                        this.mensajeSnackbar('#388E3C','mdi-check-outline','Producto registrado exitosamente.');
                        this.reset();
                    }
                    this.postMovimiento(response.data.data.id);
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Ooops, ocurrio un error.');
                });
            },
            updateConceptoss(id){
                this.loading = true;
                Conceptos().post(`/${id}`,{data:this.data}).then(() => {
                    if(this.imagen){
                        this.postImagen(id);
                    }else{
                        this.mensajeSnackbar('#388E3C','mdi-check-outline','Producto actualizado exitosamente.');
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Ooops, ocurrio un error.');
                });
            },
            postMovimiento(id){
                this.movimiento.adm_conceptos_id = id;
                Movimiento_deposito().post("/",{data:this.movimiento}).then(() => {
                }).catch(e => {
                    console.log(e);
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
                this.subgrupo.nombre = '';
            }
        }
    }
</script>
