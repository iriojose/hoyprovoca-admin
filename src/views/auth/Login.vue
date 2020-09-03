<template>
    <div>
        <v-app-bar app color="#fff" :elevation="$vuetify.breakpoint.smAndDown ? 1:0" :class="$vuetify.breakpoint.smAndDown ? null:'px-12'">  
            <v-spacer class="hidden-sm-and-up"></v-spacer>
            <v-avatar size="50">
                <v-img src="@/assets/2.png" />
            </v-avatar>
            <v-spacer></v-spacer>
            <v-btn class="text-capitalize font-weight-bold mx-2" text to="/register" v-if="!$vuetify.breakpoint.smAndDown">
                Registrate
                <v-icon class="mx-2">
                    mdi-text-box-minus
                </v-icon>
            </v-btn>
            <v-btn class="text-capitalize font-weight-bold mx-2" text to="/" v-if="!$vuetify.breakpoint.smAndDown">
                Inicio
                <v-icon class="mx-2">
                    mdi-home
                </v-icon>
            </v-btn>
        </v-app-bar>

        <v-card width="100%" elevation="0" color="transparent" class="margen">
            <v-card-text>
                <v-row justify="center">
                    <v-col cols="12" md="9" sm="12">
                        <v-card color="#fff" elevation="3" width="100%">
                            <v-row justify="center">
                                <v-col cols="12" md="6" class="hidden-sm-and-down fondo">
                                    <v-img width="100%" height="400" contain :src="require('@/assets/dashboard.svg')"
                                    ></v-img>
                                </v-col>
                                <v-col cols="12" md="6" sm="12" class="py-10 px-8">
                                    <div class="headline black--text font-weight-bold text-center mb-5">
                                        Inicia sesión ahora!
                                    </div>

                                    <v-card elevation="0" height="50">
                                        <v-fade-transition>
                                            <v-alert border="left" colored-border elevation="2"  dense :type="type" v-show="showMessage">
                                                {{mensaje}}
                                            </v-alert>
                                        </v-fade-transition>
                                    </v-card>

                                    <v-form v-model="valid" @submit.prevent="">
                                        <v-text-field
                                            filled
                                            rounded
                                            :disabled="loading"
                                            v-model="data.user"
                                            single-line
                                            dense
                                            color="#0f2441"
                                            :success-messages="success"
                                            :error-messages="errors"
                                            @input="getUser(data.user)"
                                            label="Ingrese correo electrónico"
                                        >
                                            <template v-slot:append>
                                                <v-fade-transition leave-absolute>
                                                    <v-progress-circular
                                                        v-if="loading2"
                                                        size="24"
                                                        color="#0f2441"
                                                        indeterminate
                                                    ></v-progress-circular>
                                                     <img v-else width="24" height="24" :src="require('@/assets/2.png')">
                                                </v-fade-transition>
                                            </template>
                                        </v-text-field>

                                        <v-text-field
                                            filled
                                            rounded
                                            dense
                                            :disabled="loading"
                                            v-model="data.password"
                                            single-line
                                            type="password"
                                            color="#0f2441"
                                            :rules="[required('Contraseña'),minLength('Contraseña',6)]"
                                            label="Contraseña"
                                        ></v-text-field>

                                        <v-btn
                                            rounded color="#2950c3"
                                            block
                                            :loading="loading" height="40"
                                            :disabled="valid && success !== '' ? false:true"
                                            @click="login()"
                                            class="text-capitalize caption white--text"
                                        >
                                            Iniciar sesión
                                        </v-btn>
                                    </v-form>

                                    <v-divider class="my-10"></v-divider>

                                    <div class="subtitle-2 text-center color" @click="forgot">¿Olvido su contraseña?</div> 
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import router from '@/router';
import validations from '@/validations/validations';
import Auth from '@/services/Auth';
import Usuario from '@/services/Usuario';
import {mapActions} from 'vuex';

    export default {
        data() {
            return {
                ...validations,
                mensaje:'',
                type:'error',
                showMessage:false,
                loading:false,
                loading2:false,
                valid:false,
                success:'',
                errors:[],
                data:{
                    user:'',
                    password:''
                },
            }
        },
        head:{
            title(){
                return {
                    inner:'Iniciar sesión',
                    separator:' ',
                    complement: ' '
                }
            }
        },
        methods: {
            ...mapActions(['logged','setModalBloqueado']),
        
            forgot(){
                router.push('/forgot');
            },
            home(){
                router.push('/');
            },
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
            },
            getUser(email){
                this.errors = [];
                this.success = '';
                if(email.length <= 0) return this.errors.push('Debe ingresar un email');
                // eslint-disable-next-line
                let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/ 
                if (!regex.test(email)) return this.errors.push(`Debe ingresar un email válido`);
                this.loading2 = true;
                Usuario().get(`/?email=${email}`).then((response) => {
                    this.loading2 = false;
                    if(!response.data.data) {
                        return this.errors.push('Este email no esta registrado');
                    }else{
                        this.success='Email verificado';
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
            login(){
                this.loading = true;
                this.showMessage = false;
                Auth().post("/login",{data:this.data}).then((response) =>{
                    if(response.data.data.bloqueado == 1){
                        this.setModalBloqueado(true);
                        this.loading = false;
                    }else if(response.data.data.perfil_id < 3){
                        this.logged(response.data);
                        this.respuesta("Bienvenido",'success');
                        setTimeout(() => {router.push('/dashboard');},500);
                    }else{
                        this.respuesta('Este no es un Administrador o un super usuario','error');
                    }
                }).catch(e => {
                    this.respuesta('Usuario y/o contraseña incorrecta.','error');
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .margen{
        margin-top:80px;
    }
    .color{
        color:#000;
        background:#fff;
    }
    .fondo{
        background:#eee;
    }
    .color:hover{
        cursor:pointer;
        text-decoration:underline;
        background:#fff;
    }
</style>