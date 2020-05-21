<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title>
                Nuevo Producto
                <v-spacer></v-spacer>
                <v-scroll-x-transition>
                    <div class="mx-2" v-show="showMessage || !loadingImagen ? true:false">Salir</div>
                </v-scroll-x-transition>
                <slot name="close" v-if="!loading && !loadingImagen ? true:false"></slot>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form v-model="valid" class="pt-8" v-if="!loading && !showMessage" @submit.prevent="">
                    <v-row justify="center">
                        <v-text-field
                            outlined
                            filled
                            color="#232323"
                            hint="Nomber"
                            persistent-hint
                            :rules="[required('Nombre')]"
                            v-model="data.nombre"
                            label="Nombre"
                            dense
                        ></v-text-field>

                        <v-text-field
                            outlined
                            filled
                            color="#232323"
                            hint="Codigo"
                            persistent-hint
                            :rules="[required('Codigo')]"
                            v-model="data.codigo"
                            label="Codigo"
                            dense
                        ></v-text-field>

                        <v-text-field
                            outlined
                            filled
                            color="#232323"
                            hint="Referencia"
                            persistent-hint
                            :rules="[required('Referencia')]"
                            v-model="data.referencia"
                            label="Referencia"
                            dense
                        ></v-text-field>

                        <v-text-field
                            label="Precio"
                            outlined
                            filled
                            type="number"
                            v-model="data.precio_a"
                            hint="Bs."
                            @input="changeBolivar"
                            persistent-hint
                            color="#232323"
                            dense
                            :rules="[required('Precio'),positivo('Precio')]"
                        />
                        
                        <v-text-field
                            label="Precio dolar"
                            outlined
                            filled
                            type="number"
                            v-model="data.precio_dolar"
                            hint="$."
                            @input="changeDolar"
                            persistent-hint
                            color="#232323"
                            dense
                            :rules="[required('Precio dolar'),positivo('Precio dolar')]"
                        />

                        <v-dialog v-model="dialog2" width="400" transition="dialog-bottom-transition">
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-on="on"
                                    label="Grupo"
                                    outlined
                                    filled
                                    v-model="grupo.nombre"
                                    :disabled="loading"
                                    color="#232323"
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
                                            :disabled="grupos.length == total || loading2 ? true:false"
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
                                        @click:row="changeGrupo($event)"
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

                        <v-dialog v-model="dialog3" width="400" transition="dialog-bottom-transition">
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-on="on"
                                    label="Subgrupo"
                                    outlined
                                    filled
                                    v-model="subgrupo.nombre"
                                    :disabled="grupo.nombre == '' ? true:false"
                                    color="#232323"
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
                                            :disabled="subgrupos.length == total || loading2 ? true:false"
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
                                        :items="subgrupos"  
                                        :search="search2"
                                        @click:row="changeSubgrupo($event)"
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

                        <v-textarea
                            label="Descripcion"
                            v-model="data.descripcion"
                            color="#232323"
                            outlined
                            filled
                            dense
                            :rules="[required('Descripcion')]"
                        ></v-textarea>

                        <v-btn 
                            class="mt-5 text-capitalize white--text" 
                            block @click="postConcepto" color="#232323" :disabled="!valid"
                        >
                            Guardar
                        </v-btn>
                    </v-row>
                </v-form>
                <v-row justify="center">
                    <LoaderRect v-if="loading" class="py-12" />
                </v-row>
            </v-card-text>
            <v-scroll-x-transition>
                <v-card-text v-show="showMessage">
                    <v-scroll-x-transition>
                        <Message v-show="showMessage" :icon="icon" :mensaje="mensaje" :color="color" />
                    </v-scroll-x-transition> 

                    <div v-show="$parent.creado" class="text-center font-weight-black mb-4">
                        ¿ Agregar imagen al producto creado ?
                    </div>

                    <FilePond  
                        v-if="$parent.creado"
                        ref="pond"
                        label-idle="Drop image here..."
                        labelFileAdded = "Archivo Añadido"
                        :server="{process}"
                        :onaddfilestart="initProcess"
                    />
                </v-card-text>
            </v-scroll-x-transition>
        </v-card>
    </v-dialog>
</template>

<script>
import Message from '@/components/mensajes/Message';
import Images from '@/services/Images';
import Cambio from '@/services/Cambio';
import Grupos from '@/services/Grupos';
//import SubGrupos from '@/services/SubGrupos';
import validations from '@/validations/validations';
import LoaderRect from '@/components/loaders/LoaderRect';
import Conceptos from '@/services/Conceptos';
import variables from '@/services/variables_globales';
import {mapState} from 'vuex';

    export default {
        components:{
            Message,
            LoaderRect
        },
        props:{
            dialog:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                ...variables,
                ...validations,
                valid:false,
                loading:false,
                loadingImagen:false,
                icon:'',
                color:'',
                mensaje:'',
                showMessage:false,
                tasa:null,
                data:{
                    nombre:'',
                    codigo:'',
                    referencia:'',
                    descripcion:'',
                    adm_grupos_id:null,
                    adm_subgrupos_id:null,
                    adm_empresa_id:null,
                    adm_tipos_conceptos_id:2,
                    precio_a:null,
                    precio_dolar:null
                },
                //para el modal de grupos
                grupo:{
                    nombre:''
                },
                total:0,
                offset:0,
                loading2:false,
                dialog2:false,
                search:'',
                grupos:[],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre'},
                ],
                //para el modal de subgrupos
                subgrupo:{
                    nombre:''
                },
                total2:0,
                offset2:0,
                dialog3:false,
                search2:'',
                subgrupos:[],
            }
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
            }
        },
        computed: {
            ...mapState(['user'])
        },
        mounted(){
            this.getCambio();
            this.getGrupos();
            this.data.adm_empresa_id = this.user.data.adm_empresa_id;
        },
        methods: {
            respuesta(icon,mensaje,color){
                this.icon = icon;
                this.color = color;
                this.mensaje = mensaje;
                this.loading = false;
                this.loadingImagen = false;
                this.showMessage = true;
            },
            reset(){
                this.showMessage = false;
                this.data.nombre = '';
                this.data.descripcion = '';
                this.data.codigo = '';
                this.data.referencia = '';
                this.data.precio_a = null;
                this.data.precio_dolar = null;
                this.grupo.nombre = '';
                this.subgrupo.nombre = '';

            },
            postConcepto(){
                this.loading = true;
                Conceptos().post("/",{data:this.data}).then((response) => {
                    this.$parent.creado = true;
                    this.$parent.bandera = response.data.data;
                    this.$parent.bandera.grupo = this.grupo;
                    this.$parent.bandera.subgrupo = this.subgrupo;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Producto creado.","#388E3C");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                });
            },
            initProcess(){
                this.loadingImagen = true;
            },
            process(fieldName, file, metadata, load, error, progress) {
                progress(true, 0, 1);
                let formdata = new FormData();
                formdata.append('image',file);

                Images().post(`/main/conceptos/${this.$parent.bandera.id}`,formdata).then((response) => {
                    this.$parent.bandera.imagen = response.data.filename;
                    this.respuesta("mdi-checkbox-marked-circle-outline","Imagen añadida.","#388E3C");
                }).catch(e =>  {
                    console.log(e);
                    this.respuesta("mdi-alert-octagon","Ocurrio un error.","#D32F2F");
                }); 
            },
            getCambio(){
                Cambio().get(`/?adm_empresa_id=${this.user.data.adm_empresa_id}`).then((response) => {
                    this.tasa = response.data.data[0].tasa;
                }).catch(e => {
                    console.log(e);
                });
            },
            changeBolivar(){
                this.data.precio_dolar = this.data.precio_a / this.tasa;
                this.data.precio_dolar = this.data.precio_dolar.toFixed(2);
            },
            changeDolar(){
                this.data.precio_a = this.tasa * this.data.precio_dolar
                this.data.precio_a = this.data.precio_a.toFixed(2);
            },
            getGrupos(){
                this.loading2 = true;
                Grupos().get(`/?limit=50&offset=${this.offset}&order=desc`).then((response) => {
                    this.total=response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
                    this.loading2=false;
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            getSubgrupos(){
                this.loading2 = true;
                Grupos().get(`/${this.grupo.id}/subgrupos`).then((response) => {
                    console.log(response);
                    if (response.data.data){
                        this.total2 = response.data.totalCount;
                        response.data.data.filter(a => this.subgrupos.push(a));
                        this.loading2=false;
                        this.offset2+=50;
                    }else { 
                        this.loading2 = false;
                    }
                }).catch(e =>{
                    console.log(e);
                })
            },
            changeGrupo(evt){
                this.subgrupo.nombre = '';
                this.data.adm_subgrupos_id = null;

                this.data.adm_grupos_id = evt.id;
                this.grupo = evt;
                this.dialog2 = false;
                this.getSubgrupos();
            },
            changeSubgrupo(evt){
                this.subgrupo = Object.assign({},evt);
                this.data.adm_subgrupos_id = evt.id;
                this.dialog3 = false;
            }
        },
    }
</script>