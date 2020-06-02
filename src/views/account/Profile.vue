<template>
    <v-card class="fixHeight" style="padding: 25px 45px 0 45px;background:#fdfdfd;" min-height="570px">
        <div class="font-weight-black title mb-5" style="padding-top:10px;text-align:center;">Información de tu cuenta</div>
        <v-row style="position:relative;">
            <v-col cols="12" md="6">
                <v-list>
                    <v-list-item style="position:relative;">
                        <v-list-item-avatar class="border" size="170" style="margin:0 auto;">
                            <croppa 
                                ref="avatar"
                                placeholder="" 
                                disable-click-to-choose 
                                disable-scroll-to-zoom 
                                disable-pinch-to-zoom 
                                remove-button-color="black" 
                                show-loading class="bg-center" 
                                :width="115" 
                                :height="115" 
                                v-model="fotoAux" 
                                canvas-color="transparent"
                                @new-image-drawn="onNewImage()" 
                                :style="(user.data.imagen === 'default.png' && !fotoChanged? fotoChanged ? 'background:url('+foto+');'  : 'background:url('+require('@/assets/user.jpg')+');' :  fotoChanged ? 'background:url('+foto+');' : 'background:url('+image+user.data.imagen+');')"
                            >
                            </croppa>
                        </v-list-item-avatar>
                        <v-avatar  @click.stop.prevent ="!fotoChanged ? uploadFoto() : restoreFoto() " class="abs_center" size="45" style="z-index:2;" color="#F5F5F5">
                            <v-icon style="font-size:25px;">{{ !fotoChanged ? 'mdi-camera' : 'close' }}</v-icon>
                        </v-avatar>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="12" md="6">
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            dense
                            label="Nombre(s)"
                            placeholder="Ej: Admin"
                            outlined
                            v-model="data.nombre"
                            type="text"
                            prepend-icon="person"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            dense
                            label="Apellidos(s)"
                            placeholder="Ej: Super"
                            outlined
                            v-model="data.apellido"
                            type="text"
                            prepend-icon="person"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row justify="center" align="center" class="mt-3" style="padding-top:15px;">
            <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    label="Nueva Contraseña"
                    placeholder="********"
                    outlined
                    v-model="password"
                    type="password"
                    prepend-icon="lock"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    label="Confirmar Contraseña"
                    placeholder="********"
                    outlined
                    v-model="passwordC"
                    type="password"
                    prepend-icon="lock"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-text-field
                    dense
                    label="Teléfono"
                    placeholder="Ej: 414-0404040"
                    outlined
                    prefix="+58 "
                    v-model="telefono"
                    type="text"
                    prepend-icon="phone_iphone"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-menu :close-on-content-click="false" transition="scale-transition" max-width="100%" offset-overflow>
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            dense
                            v-model="date"
                            label="Cumpleaños"
                            placeholder="Formato YYYY/MM/DD."
                            color="#005598"
                            prepend-icon="event"
                            outlined
                            v-on="on"
                        ></v-text-field>
                    </template>

                    <v-date-picker v-model="date" landscape show-current  header-color="#005598" color="#005598"  locale="es"/>
                </v-menu>
            </v-col>    
            <v-col cols="12" md="12" sm="12">
                <transition name="fade">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="#005598" dark :loading="loading" @click="updateUsuario(user.data.id)" class="text-capitalize body-2 fixPos" :disabled="!change">
                             Actualizar datos
                        </v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                 </transition>
            </v-col>
        </v-row>

    </v-card>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Usuario from '@/services/Usuario';
import Auth from '@/services/Auth';
import Images from '@/services/Images';
import w from '@/services/variables_globales';
import _ from 'lodash';

export default {
    components:{
    },
    data() {
        return {
            ...w,
            fotoAux:{},
            loading:false,
            change:false,
            passwordC:'',
            data:{},
            telefono:null,
            password:'',
            date: new Date().toISOString().substr(0, 10),
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
        ...mapState(['user','fotoChanged','foto','fotoFile']),
    },
    watch: {
        fotoChanged: function(){
            !this.fotoChanged ? this.fotoAux.remove() : NaN;
            this.change = this.fotoChanged;
        },
        data:{
            handler(){
                if(!this.fotoChanged && this.data.nombre === this.user.data.nombre && this.data.apellido === this.user.data.apellido && this.data.email === this.user.data.email && this.data.login === this.user.data.login){
                    this.change = false;
                }else{
                    this.change = true;
                }
            },
            deep:true
        },    
    },methods:{
        ...mapActions(['setFoto','setFotoChanged','setFotoFile']),
        async updateUsuario(id){
            let newUserData = {};
            this.loading = true;
            typeof this.date !== 'undefined' && this.date !== '' ? newUserData.fecha_nac = this.date : NaN;
            this.data.nombre !== this.user.data.nombre ? newUserData.nombre = this.data.nombre : NaN;
            this.data.apellido !== this.user.data.apellido ? newUserData.apellido = this.data.apellido : NaN;
            this.password === "" ? NaN 
            : this.password === this. passwordC ?
                Auth().post('/resetpassword',{data:{user:this.user.data.login,password: this.password}}) 
                : this.$toasted.error("Las contraseñas no coinciden.", { 
                        theme: "bubble", 
                        position: "bottom-right", 
                        duration : 2000,
                        icon : 'error_outline'
                });
            if(this.fotoFile !== null){
                let formdata = new FormData();
                formdata.append('image',this.fotoFile);
                let fotoLocal = await Images().post(`/usuario/${this.user.data.id}/`,formdata);
                newUserData.imagen = fotoLocal.data.filename;
                this.data.imagen =  fotoLocal.data.filename;
                this.setFotoFile(null);
                this.setFoto(this.user.data.imagen);
                this.setFotoChanged(false);
                this.$toasted.info("Foto de perfil actualizada.", { 
                    theme: "bubble", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : 'done_all'
                });
            }
            if(!_.isEqual(this.data,this.user.data) || this.telefono !== "" || typeof this.date !== 'undefined'){
                Usuario().post(`/${id}`,{data:{...newUserData}}).then(async () => {
                    let updatedUser = await Usuario().get('/'+id);
                    this.user.data = {...updatedUser.data.data};
                    this.change = false;
                    this.$toasted.info("Información Actualizada", { 
                        theme: "bubble", 
                        position: "bottom-right", 
                        duration : 2000,
                        icon : 'done_all'
                    });
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                    this.$toasted.error("Ha ocurrido un error inesperado.", { 
                        theme: "bubble", 
                        position: "bottom-right", 
                        duration : 2000,
                        icon : 'error_outline'
                    });
                    this.loading = false;
                });
            }
        },
        restoreFoto(){
            this.fotoAux.remove();
            this.setFotoChanged(false);
            this.setFoto(this.user.data.imagen);
            this.setFotoFile(null);
        },
        uploadFoto(){
            this.fotoAux.chooseFile();
        },
        onNewImage(){
            this.setFotoFile(this.fotoAux.getChosenFile());
            this.setFotoChanged(true);
            this.setFoto(this.fotoAux.generateDataUrl());
        },
    },
    mounted() {
        this.data = Object.assign({},this.user.data);
        this.date = this.data.fecha_nac.substr(0, 10);            
    },
}
</script>

<style lang="scss">
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition-duration: .3s;
        transition-property: all;
        transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
        overflow: hidden;
    }
    
    .slide-left-enter,
    .slide-right-leave-active {
        opacity: 0;
        transform: translate(2em, 0);
    }
    
    .slide-left-leave-active,
    .slide-right-enter {
        opacity: 0;
        transform: translate(-2em, 0);
    }
    .fixHeight{
        @media (max-width:958px){
            margin-top:-25px!important;
            max-height: 100%!important;
        }
    }
    .fixPos{
         @media (max-width:958px){
            transform: translateY(-25px);
        }
    }

    .bg-center{
        background-position:center center!important;
        width: 170px;
        height: 170px;
        z-index:5!important;
        background-size: 180px !important;
    }

    .bg-center svg,canvas{
        display: none!important;
    }

    .border{
         border: 2px solid #F5F5F5;
    }
    .abs_center{
        position: absolute!important;
        top: 60%;
        left: 50%;
        transform:translate(2em,1em);
        z-index:6!important;
    }
    .abs_center:hover{
        cursor: pointer;
        background: #ededed!important;
    }
</style>