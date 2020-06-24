<template>
    <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-card-title class="white--text font-weight-bold fondo">
                Editar Producto
                <v-spacer></v-spacer>
                <!-- boton de salir -->
                <v-scroll-x-transition>
                    <slot name="salir" v-if="showMessage && !loading"></slot>
                </v-scroll-x-transition>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <!-- mensajes -->
                <v-card elevation="0" height="50" class="mt-5">
                    <v-scroll-x-transition>
                        <v-alert border="left" colored-border elevation="2"  dense :type="type" v-show="showMessage">
                            {{mensaje}}
                        </v-alert>
                    </v-scroll-x-transition> 
                </v-card>

                <!-- formulario-->
                <v-form v-model="valid" @submit.prevent="" class="my-5">
                    <v-stepper v-model="e1" class="elevation-0" non-linear>
                        <v-stepper-header class="elevation-0">
                            <v-stepper-step color="#2950c3" step="1" editable></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step color="#2950c3" step="2" editable></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step color="#2950c3" step="3" editable></v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step color="#2950c3" step="4" editable></v-stepper-step>
                        </v-stepper-header>

                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <!--imagen-->
                                <v-row justify="center">
                                    <v-avatar tile size="200" v-if="!cambiarImagen">
                                        <v-img :src="image+$parent.bandera.imagen"></v-img>
                                    </v-avatar>
                                </v-row>
                                <!-- boton -->
                                <v-row justify="center" class="mt-2">
                                    <v-btn fab color="#1f3b63" small @click="cambiarImagen = !cambiarImagen" :disabled="loading">
                                        <v-icon v-if="!cambiarImagen" color="#fff">mdi-border-color</v-icon>
                                        <v-icon v-else color="#fff">mdi-chevron-left</v-icon>
                                    </v-btn>
                                </v-row>

                                <!-- Agregar imagen -->
                                <v-scroll-x-transition>
                                    <div v-show="cambiarImagen" class="text-center font-weight-black my-4">
                                        Actualizar imagen
                                    </div>
                                </v-scroll-x-transition>

                                <v-scroll-x-transition>
                                    <FilePond  
                                        v-show="cambiarImagen"
                                        ref="pond"
                                        label-idle="Drop image here..."
                                        labelFileAdded = "Archivo Añadido"
                                        :server="{process}"
                                        :onaddfilestart="initProcess"
                                    />
                                </v-scroll-x-transition>
                            </v-stepper-content>

                            <v-stepper-content step="2">
                                <v-text-field
                                    filled single-line
                                    label="Nombre" dense
                                    rounded hint="Nombre"
                                    :rules="[required('Nombre')]"
                                    v-model="$parent.bandera.nombre" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Codigo" dense
                                    rounded hint="Codigo"
                                    :rules="[required('Codigo')]"
                                    v-model="$parent.bandera.codigo" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-text-field
                                    filled single-line
                                    label="Referencia" dense
                                    rounded hint="Referencia"
                                    :rules="[required('Referencia')]"
                                    v-model="$parent.bandera.referencia" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                ></v-text-field>

                                <v-textarea
                                    filled single-line
                                    label="Descripción" dense
                                    rounded hint="Descripción"
                                    :rules="[required('Descripción')]"
                                    v-model="$parent.bandera.descripcion" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                >
                                </v-textarea>
                            </v-stepper-content>

                            <v-stepper-content step="3">

                                <!--Select para grupo -->
                                <v-select
                                    dense filled single-line
                                    rounded label="Grupo"
                                    hint="Categorías de productos" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    :rules="[requiredObject('Grupo')]" return-object
                                    @change="changeGrupo($event)" :items="grupos"
                                    item-text="nombre" v-model="grupo"
                                >
                                    <template v-slot:append-item>
                                        <v-row justify="center">
                                            <v-btn 
                                                @click="getGrupos()" tile 
                                                color="#232323" :loading="loading2"
                                                :disabled="bloqueado"
                                                class="white--text text-capitalize font-weight-bold"
                                            >Ver más</v-btn>
                                        </v-row>
                                    </template>
                                    <template slot="item" slot-scope="{ item }">
                                        <v-avatar size="40" class="mr-5">
                                            <v-img :src="image+item.imagen"></v-img>
                                        </v-avatar>  
                                        {{ item.nombre }} 
                                    </template>
                                    <template v-slot:selection="{item}">
                                        <v-avatar size="30" class="mr-5">
                                            <v-img :src="image+item.imagen"></v-img>
                                        </v-avatar>  
                                        <span>{{ item.nombre }}</span>
                                    </template>
                                </v-select>

                                <!--Select para subgrupo -->
                                <v-select
                                    dense filled single-line
                                    rounded label="Subgrupo"
                                    hint="Sub Categorías de productos" persistent-hint
                                    color="#2950c3" :disabled="loading && grupo == null ? true:false"
                                    return-object @change="changeSubgrupo($event)" :items="subgrupos"
                                    item-text="nombre" v-model="subgrupo"
                                >
                                    <template slot="item" slot-scope="{ item }">
                                        <v-avatar size="40" class="mr-5">
                                            <v-img :src="image+item.imagen"></v-img>
                                        </v-avatar>  
                                        {{ item.nombre }} 
                                    </template>
                                    <template v-slot:selection="{item}">
                                        <v-avatar size="30" class="mr-5">
                                            <v-img :src="image+item.imagen"></v-img>
                                        </v-avatar>  
                                        <span>{{ item.nombre }}</span>
                                    </template>
                                </v-select>
                            </v-stepper-content>

                            <v-stepper-content step="4">

                                <v-text-field
                                    filled single-line
                                    label="Precio" dense
                                    rounded hint="Bs."
                                    :rules="[required('Precio'),positivo('Precio')]"
                                    v-model="$parent.bandera.precio_a" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    @input="changeBolivar"
                                ></v-text-field>
                            
                                <v-text-field
                                    filled single-line
                                    label="Precio" dense
                                    rounded hint="$"
                                    :rules="[required('Precio dolar'),positivo('Precio dolar')]"
                                    v-model="$parent.bandera.precio_dolar" persistent-hint
                                    color="#2950c3" :disabled="loading"
                                    @input="changeDolar"
                                ></v-text-field>

                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-form>
            </v-card-text>

            <!-- botones de acciones -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <slot name="close" v-if="!loading"></slot>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="editConcepto" :loading="loading"
                    :disabled="!valid"
                >
                    Editar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Images from '@/services/Images';
import Grupos from "@/services/Grupos";
import Conceptos from '@/services/Conceptos';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Cambio from '@/services/Cambio';
import accounting from 'accounting';

    export default {
        props:{
            dialog:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                tasa:null,
                e1:1,
                ...variables,
                ...validations,
                type:'error',
                showMessage:false,
                cambiarImagen:false,
                mensaje:'',
                valid:false,
                loading:false,
                loading2:false,
                //para el select de grupos
                grupos:[],
                grupo:null,
                total:0,
                offset:0,
                //para el select subgrupos
                subgrupos:[],
                subgrupo:null
            }
        },
        watch: {
            dialog(){
                if(!this.dialog) this.reset();
                else this.init();
            }
        },
        computed:{
            bloqueado(){//bloquea el boton de ver mas segun la condicion
                if(this.grupos.length >= this.total) return true;
                else return false;
            }
        },
        mounted() {
            this.init();
            this.getGrupos();
            this.getCambio();
        },
        methods:{
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
            },
            init(){
                this.grupo = this.$parent.bandera.grupo;
                this.subgrupo =  this.$parent.bandera.subgrupo;
            },
            editConcepto(){
                let auxGrupo = this.$parent.bandera.grupo;
                let auxSubgrupo = this.$parent.bandera.subgrupo;
                let auxExistencia = this.$parent.bandera.existencias;
                delete this.$parent.bandera.grupo;
                delete this.$parent.bandera.subgrupo;
                delete this.$parent.bandera.existencias;
                delete this.$parent.bandera.precio_bs;
                delete this.$parent.bandera.precio_do;
                this.loading = true;
                Conceptos().post(`/${this.$parent.bandera.id}`,{data:this.$parent.bandera}).then(() => {
                    this.$parent.editado = true;
                    this.$parent.bandera.grupo = auxGrupo;
                    this.$parent.bandera.subgrupo = auxSubgrupo;
                    this.$parent.bandera.existencias = auxExistencia;
                    this.$parent.bandera.precio_bs = accounting.formatMoney(+this.$parent.bandera.precio_a,{symbol:"Bs ",thousand:'.',decimal:','});
                    this.$parent.bandera.precio_do = accounting.formatMoney(+this.$parent.bandera.precio_dolar,{symbol:"$",thousand:',',decimal:'.'})
                    this.respuesta("Producto actualizado exitosamente.","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al actualizar el Producto.","error");
                });
            },
            reset(){
                this.showMessage = false;
                this.cambiarImagen = false;
                this.e1 = 1;
            },
            changeBolivar(){
                this.$parent.bandera.precio_dolar = this.$parent.bandera.precio_a / this.tasa;
                this.$parent.bandera.precio_dolar = this.$parent.bandera.precio_dolar.toFixed(2);
            },
            changeDolar(){
                this.$parent.bandera.precio_a = this.tasa * this.$parent.bandera.precio_dolar
                this.$parent.bandera.precio_a = this.$parent.bandera.precio_a.toFixed(2);
            },
            changeGrupo(evt){
                this.grupo = evt;
                this.$parent.bandera.adm_grupos_id = evt.id;
                this.subgrupo = null;
                this.$parent.bandera.adm_subgrupos_id = null;
                this.subgrupos = evt.subgrupos;
            },
            changeSubgrupo(evt){
                this.subgrupo = evt;
                this.$parent.bandera.adm_subgrupos_id = evt.id;
            },
            getGrupos(){
                Grupos().get(`/?offset=${this.offset}&order=desc&fields=subgrupos`).then((response) => {
                    this.total=response.data.totalCount;
                    response.data.data.filter(a => this.grupos.push(a));
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            getCambio(){
                Cambio().get(`/`).then((response) => {
                    this.tasa = response.data.data[0].tasa;
                });
            },
            initProcess(){
                this.loading = true;
            },
            //metadata, load, error, progress,fieldName, 
            process(fieldName, file, metadata, load, error,abort) {
                let formdata = new FormData();
                formdata.append('image',file);
                abort();
                
                Images().post(`/main/conceptos/${this.$parent.bandera.id}`,formdata).then((response) => {
                    this.$parent.bandera.imagen = response.data.filename;
                    this.$parent.editado = true;
                    this.respuesta("Imagen actualizada.","success");
                    setTimeout(() => {this.cambiarImagen = false},500);
                    load("Imagen añadida");
                }).catch(e =>  {
                    console.log(e);
                    this.respuesta("Error al subir la imagen.","error");
                    error("Erro al subir la imagen");
                }); 
            },
        }
    }
</script>

<style lang="scss" scoped>
    .fondo{
        background: #1f3b63;
    }
</style>