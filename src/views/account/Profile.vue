<template>
    <div :class="$vuetify.breakpoint.smAndDown ? null:drawer ? 'left':null">
        <v-card elevation="0" width="100%">
            <v-card-text>
                <div class="font-weight-black text-center title mb-5">
                    Información de tu cuenta
                </div>
                <v-form v-model="valid" @submit.prevent="">
                    <v-row justify="center">
                        <v-col cols="12" md="6" sm="12" class="px-12">
                            <v-row justify="center" class="mb-10">
                                <v-avatar size="200">
                                    <v-img :src="image+user.data.imagen"></v-img>
                                </v-avatar>
                                <v-avatar @click="dialog = !dialog" 
                                    :class="$vuetify.breakpoint.smAndDown ? 'abs_center2':'abs_center'" 
                                    size="45" style="z-index:2;" color="#F5F5F5"
                                >
                                    <v-icon style="font-size:25px;">mdi-camera</v-icon>
                                </v-avatar>
                            </v-row>

                            <v-text-field
                                filled rounded disabled
                                v-model="data.email" single-line
                                dense color="#2950c3" 
                                label="Ingrese correo electrónico"
                                hint="Email" persistent-hint
                            ></v-text-field>

                            <v-select
                                dense filled single-line
                                rounded label="Nivel de usuario"
                                hint="Nivele de usuario" persistent-hint
                                color="#2950c3" disabled return-object :items="items"
                                item-text="nombre" v-model="nivel"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="6" sm="12" class="px-10">
                            <v-text-field
                                filled single-line
                                label="Nombre" dense
                                rounded hint="Nombre"
                                :rules="[required('Nombre')]"
                                v-model="data.nombre" persistent-hint
                                color="#2950c3" :disabled="loading"
                                @input="validEdit()"
                            ></v-text-field>

                            <v-text-field
                                filled single-line
                                label="Apellido" dense
                                rounded hint="Apellido"
                                :rules="[required('Apellido')]"
                                v-model="data.apellido" persistent-hint
                                color="#2950c3" :disabled="loading"
                                @input="validEdit()"
                            ></v-text-field>

                            <v-text-field
                                filled rounded persistent-hint
                                dense :disabled="loading" v-model="data.login" single-line
                                type="text" color="#0f2441" @input="validEdit()"
                                :rules="[required('Nombre de usuario'),minLength('Nombre de usuario',4)]"
                                label="Nombre de usuario" hint="Usuario" 
                            ></v-text-field>

                            <v-text-field
                                filled single-line
                                label="Telefono" dense
                                rounded hint="format: 0000-000-0000"
                                @input="changeNumber()"
                                :rules="[required('Telefono'),minLength('Telefono',13),maxLength('Telefono',13)]"
                                v-model="data.telefono" persistent-hint
                                color="#2950c3" :disabled="loading"
                            ></v-text-field>

                            <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        dense v-model="data.fecha_nac" :disabled="loading"
                                        label="Cumpleaños" color="#2950c3" append-icon="event" 
                                        filled v-on="on" rounded hint="Formato YYYY/MM/DD" 
                                        persistent-hint single-line @input="validEdit()"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="data.fecha_nac" landscape show-current  header-color="#2950c3" color="#2950c3"  locale="es"/>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-card elevation="0" height="50">
                    <v-fade-transition>
                        <v-alert border="left" colored-border elevation="2"  dense :type="type" v-show="showMessage">
                            {{mensaje}}
                        </v-alert>
                    </v-fade-transition> 
                </v-card>
                <v-spacer></v-spacer>
                <v-btn 
                    color="#2950c3" class="text-capitalize white--text" 
                    @click="updateUsuario()" :loading="loading"
                    :disabled="valid && editable ? false:true"
                >
                    Editar
                </v-btn>
            </v-card-actions>

            <!-- modal para editar imagen de usuario -->
            <CambiarImagen :dialog="dialog">
                <template v-slot:close>
                    <v-btn tile color="#232323" text @click="dialog = false">
                        Cancelar
                    </v-btn>
                </template>
                <template v-slot:salir>
                    <v-btn fab small color="#fff" @click="dialog = false">
                        <v-icon color="#232323">mdi-close</v-icon>
                    </v-btn>
                </template>
            </CambiarImagen>
        </v-card>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Usuario from '@/services/Usuario';
import variables from '@/services/variables_globales';
import validations from '@/validations/validations';
import CambiarImagen from '@/components/dialogs/CambiarImagen';

    export default {
        components:{
            CambiarImagen
        },
        data() {
            return {
                ...validations,
                ...variables,
                dialog:false,
                loading:false,
                editable:false,
                valid:false,
                mensaje:'',
                type:'error',
                showMessage:false,
                data:{
                    imagen:'default.png'
                },
                nivel:{},
                items:[
                    {id:1,nombre:"Administrador"},
                    {id:2,nombre:"Super Usuario"},
                    {id:3,nombre:"Cliente"}
                ],
            }
        },
        head: {
            title() {
                return {
                    inner: "Admin",
                    separator:'|',
                    complement:'Perfil'
                };
            }
        },
        computed:{
            ...mapState(['user','drawer']),
        },
        mounted() {
            this.init();
        },
        methods: {
            ...mapActions(['setData']),

            init(){
                this.data = Object.assign({},this.user.data);
                this.data.fecha_nac = this.data.fecha_nac.substr(0,10); 
                this.items.filter(a => a.id == this.data.perfil_id ? this.nivel = a:null);
            },
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
            },
            changeNumber(){
                this.validEdit();
                if(this.data.telefono.length == 4){
                    this.data.telefono+='-';
                }else if(this.data.telefono.length == 8){
                    this.data.telefono+='-';
                }
            },
            validEdit(){
                this.editable = true;
            },
            updateUsuario(){
                delete this.data.usuario_at;
                this.showMessage = false;
                this.loading = true;
                Usuario().post(`/${this.data.id}`,{data:this.data}).then(() => {
                    this.editable = false;
                    this.setData(this.data);
                    this.respuesta("Datos actualizados exitosamente.",'success');
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al intentar actualizar",'error');
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    .left{
        margin-left:250px;
    }
    .abs_center2{
        position: absolute !important;
        top: 24%;
        left: 46%;
        transform:translate(2em,1em);
        z-index:3 !important;
    }
    .abs_center{
        position: absolute !important;
        top: 38%;
        left: 25%;
        transform:translate(2em,1em);
        z-index:3 !important;
    }
    .abs_center:hover{
        cursor: pointer;
        background: #ededed!important;
    }
    .abs_center2:hover{
        cursor: pointer;
        background: #ededed!important;
    }
</style>