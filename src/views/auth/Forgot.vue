<template>
    <div>
        <v-row justify="center" align="center" class="mt-8 mb-5">
            <v-img contain width="100" height="30" :src="require('@/assets/logoaftim2.png')"></v-img>
        </v-row>

        <v-row justify="center" align="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-5':null">
            <v-col cols="12" md="4" lg="4" class="hidden-sm-and-down">
                <v-img contain width="100%" height="450" :src="require('@/assets/forgot.svg')"></v-img>
            </v-col>
            <v-col cols="12" md="6" sm="12">
                <v-card 
                    :width="$vuetify.breakpoint.smAndDown ? '100%':'80%'" 
                    height="400" elevation="5" class="pa-5"
                >
                    <div class="text-center my-5 font-weight-black subtitle-1">¿No puede iniciar sesión?</div>

                    <v-card-text>
                        <v-form v-model="valid" @submit.prevent="" v-if="!validcode">
                            <div class="font-weight-black body-2 mb-2" v-if="!send">
                                Le enviaremos un enlace de recuperación
                            </div>
                            <v-text-field
                                label="Correo electronico"
                                single-line
                                solo
                                append-icon="email"
                                dense
                                color="#005598"
                                v-model="email"
                                :disabled="loading"
                                type="email"
                                :rules="[required('Correo Electrónico'), emailFormat()]"
                            />
                            <v-text-field
                                v-if="send"
                                label="Codigo"
                                single-line
                                solo
                                append-icon="lock"
                                dense
                                color="#005598"
                                :disabled="loading"
                                v-model="codigo"
                                :rules="[required('Codigo')]"
                            />
                            <v-hover v-slot:default="{hover}">
                                <v-btn v-if="!send"
                                    block 
                                    class="text-capitalize mt-5"
                                    :disabled="!valid || loading" 
                                    color="#005598" 
                                    :dark="valid && !loading"
                                    :loading="loading"
                                    :elevation="hover ? 5:0"
                                    @click="sendMail"
                                >
                                   <div>Enviar enlace</div>
                                </v-btn>

                                <v-btn v-else
                                    block 
                                    class="text-capitalize mt-5"
                                    :disabled="!valid || loading" 
                                    color="#005598" 
                                    :dark="valid && !loading"
                                    :loading="loading"
                                    :elevation="hover ? 5:0"
                                    @click="validCode"
                                >
                                   Validar codigo
                                </v-btn>
                            </v-hover>
                        </v-form>

                        <v-form v-model="valid2" @submit.prevent="" v-if="validcode">
                            <div class="font-weight-black body-2 mb-2">
                                Ingrese nueva contraseña
                            </div>

                            <v-text-field
                                v-model="contraseña"
                                label="Contraseña"
                                single-line
                                :type="showPassword ? 'text' : 'password'"
                                :rules="[required('Contraseña'), minLength('Contraseña',8)]"
                                @click:append="showPassword = !showPassword"
                                :append-icon="showPassword ?  'visibility' : 'visibility_off'"
                                :prepend-inner-icon="showPassword ?  'lock_open' : 'lock'"
                                solo
                                color="#005598"
                                dense
                            />  

                            <v-text-field
                                v-model="contraseña2"
                                label="Repetir Contraseña"
                                single-line
                                type="password"
                                :rules="[required('Contraseña'),passwordConfirmationRule()]"
                                prepend-inner-icon="lock"
                                solo
                                color="#005598"
                                dense
                            />  

                            <v-btn
                                block 
                                class="text-capitalize mt-5"
                                :disabled="!valid2 || loading" 
                                color="#005598" 
                                :dark="valid2 && !loading"
                                :loading="loading"
                                elevation="0"
                                @click="reset"
                            >
                                Nueva contraseña
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!--v-footer fixed color="#f7f7f7">
            <SubFooter />
        </v-footer-->

        <Snackbar :color="color" :mensaje="mensaje" :icon="icon" :time="1000" />
    </div>
</template>

<script>
import router from '@/router';
//import SubFooter from '@/components/footer/SubFooter';
import validations from '@/validations/validations';
import Auth from '@/services/Auth';
import {mapActions} from 'vuex';
import Snackbar from '@/components/snackbars/Snackbar';

    export default {
        components:{
            //SubFooter,
            Snackbar
        },
        data() {
            return {
                ...validations,
                email:'',
                codigo:'',
                color:'',
                mensaje:'',
                icon:'',
                contraseña:'',
                contraseña2:'',
                send:false,
                valid:false,
                valid2:false,
                loading:false,
                validcode:false,
                showPassword:false,
            }
        },
        computed: {
            passwordConfirmationRule() {
                return () => (this.contraseña === this.contraseña2) || 'Las contraseñas no coinciden.';
            },
        },
        methods: {
            ...mapActions(['setSnackbar']),
            push(){ router.push('/login') },
            mensajeSnackbar(color,mensaje,icon){
                this.color = color;
                this.mensaje = mensaje;
                this.icon = icon;
                this.setSnackbar(true);
                this.loading = false;
            },
            sendMail(){
                this.loading = true;
                Auth().post("/sendmail",{data:{user:this.email}}).then(() => {
                    this.mensajeSnackbar("#388E3C","Codigo enviado exitosamente.","done");
                    this.send = true;
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar("#D32F2F","Ooops, Error al intentar enviar el codigo.","error");
                });
            },
            validCode(){
                this.loading = true;
                Auth().post("/validcode",{data:{user:this.email,hash:this.codigo}}).then(() => {
                    console.log(response);
                    this.mensajeSnackbar("#388E3C","Codigo validado exitosamente.","done");
                    this.validcode=true;
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar("#D32F2F","Ooops, Error al validar el codigo.","error");
                });
            },
            reset(){
                this.loading = true;
                Auth().post("/resetpassword",{data:{user:this.email,password:this.contraseña}}).then(() => {
                    this.mensajeSnackbar("#388E3C","Contraseña cambiada.","done");
                    setTimeout(() => {
                        this.push();
                    },1000);
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar("#D32F2F","Ooops, Error al resetear contraseña.","error");
                });
            }
        },
        head: {
            title() {
                return {
                    inner: "Restablecer contraseña",
                    separator: " ",
                    complement: " "
                };
            }
        }
    }
</script>