<template>
    <div>
        <v-toolbar color="#f7f7f7" elevation="0" class="px-12">
            <v-hover v-slot:default="{hover}">
                <v-btn fab :elevation="hover ? 2:0" @click="push">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </v-hover>
            <v-spacer></v-spacer>
        </v-toolbar>

        <v-row justify="center" align="center" class="mt-8 mb-5">
            <v-img contain width="100" height="50" :src="require('@/assets/logo2.png')"></v-img>
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
                                append-icon="mdi-at"
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
                                append-icon="mdi-lock"
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
                                :append-icon="showPassword ?  'mdi-eye' : 'mdi-eye-off'"
                                :prepend-inner-icon="showPassword ?  'mdi-lock-open-variant' : 'mdi-lock'"
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
                                prepend-inner-icon="mdi-lock"
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
    </div>
</template>

<script>
import router from '@/router';
import validations from '@/validations/validations';
import Auth from '@/services/Auth';

    export default {
        data() {
            return {
                ...validations,
                email:'',
                codigo:'',
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
            push(){ router.push('/login') },
            success(mensaje){
                this.$toasted.success(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "done",
                });
                this.loading = false;
            },
            error(mensaje){
                this.$toasted.error(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "error",
                });
                this.loading = false;
            },
            sendMail(){
                this.loading = true;
                Auth().post("/sendmail",{data:{user:this.email}}).then(() => {
                    this.success("Codigo enviado exitosamenten.");
                    this.send = true;
                }).catch(e => {
                    console.log(e);
                    this.error("Ooops, Error al intentar enviar el codigo.");
                });
            },
            validCode(){
                this.loading = true;
                Auth().post("/validcode",{data:{user:this.email,hash:this.codigo}}).then(() => {
                    this.success("Codigo validado exitosamente");
                    this.validcode=true;
                }).catch(e => {
                    console.log(e);
                    this.error("Ooops, Error al validar el codigo.");
                });
            },
            reset(){
                this.loading = true;
                Auth().post("/resetpassword",{data:{user:this.email,password:this.contraseña}}).then(() => {
                    this.success("Contraseña cambiada.");
                    setTimeout(() => {
                        this.push();
                    },1000);
                }).catch(e => {
                    console.log(e);
                    this.error("Ooops, Error al resetear contraseña.");
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