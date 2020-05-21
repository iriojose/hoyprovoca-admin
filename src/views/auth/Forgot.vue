<template>
    <v-card width="100%" height="1000" elevation="0" color="#2950c3">
        <v-card-text>
            <v-row justify="center" class="py-10">
                <v-card width="900" height="420" :class="$vuetify.breakpoint.smAndDown ? 'mx-4':null">
                    <v-row justify="center">
                        <v-col cols="12" md="6" class="hidden-sm-and-down">
                            <v-img width="100%" height="400" contain :src="require('@/assets/forgot.svg')"></v-img>
                        </v-col>
                        <v-col cols="12" md="6" sm="12" class="pa-12">
                            <div class="headline text-center mb-5">¿Olvido su contraseña?</div>
                            
                            <v-fade-transition>
                                <v-alert :type="type" v-show="showMessage">
                                    {{mensaje}}
                                </v-alert>
                            </v-fade-transition> 

                            <v-form v-model="valid" @submit.prevent="" v-if="!send">
                                <v-text-field
                                    filled
                                    rounded
                                    :disabled="loading"
                                    v-model="email"
                                    single-line
                                    color="#2950c3"
                                    :rules="[required('Correo electrónico'),emailFormat()]"
                                    label="Ingrese correo electrónico"
                                ></v-text-field>

                                <v-btn
                                    rounded
                                    color="#2950c3"
                                    block
                                    :disabled="!valid"
                                    :loading="loading"
                                    height="40"
                                    @click="sendMail"
                                    class="text-capitalize caption white--text"
                                >
                                    Enviar email
                                </v-btn>
                            </v-form>

                            <v-scroll-x-transition>
                                <v-form v-model="valid2" @submit.prevent="" v-show="send && !validCode">
                                    <v-text-field
                                        filled
                                        rounded
                                        :disabled="loading"
                                        v-model="codigo"
                                        single-line
                                        color="#2950c3"
                                        :rules="[required('Codigo'),minLength('Codigo',6)]"
                                        label="Codigo"
                                    ></v-text-field>

                                    <v-btn
                                        rounded
                                        color="#2950c3"
                                        block
                                        :disabled="!valid2"
                                        :loading="loading"
                                        height="40"
                                        @click="validc"
                                        class="text-capitalize caption white--text"
                                    >
                                        Validar codigo
                                    </v-btn>
                                </v-form>
                            </v-scroll-x-transition>
                                
                            <v-scroll-x-transition>
                                <v-form v-model="valid3" @submit.prevent="" v-show="send && validCode">
                                    <v-text-field
                                        filled
                                        rounded
                                        :disabled="loading"
                                        v-model="contraseña"
                                        single-line
                                        type="password"
                                        color="#2950c3"
                                        :rules="[required('Contraseña'),minLength('Contraseña',6)]"
                                        label="Nueva contraseña"
                                    ></v-text-field>

                                    <v-text-field
                                        filled
                                        rounded
                                        :disabled="loading"
                                        v-model="contraseña2"
                                        single-line
                                        type="password"
                                        color="#2950c3"
                                        :rules="[required('Confirmar contraseña'),passwordConfirmationRule()]"
                                        label="Confirmar contraseña"
                                    ></v-text-field>

                                    <v-btn
                                        rounded
                                        color="#2950c3"
                                        block
                                        :disabled="!valid3"
                                        :loading="loading"
                                        height="40"
                                        @click="reset"
                                        class="text-capitalize caption white--text"
                                    >
                                        Resetear contraseña
                                    </v-btn>
                                </v-form>
                            </v-scroll-x-transition>

                            <v-divider class="my-10"></v-divider>

                            <div class="subtitle-2 text-center color" @click="login">¿Ya tienes una cuenta? ¡Iniciar sesión!</div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import router from '@/router';
import validations from '@/validations/validations';
import Auth from '@/services/Auth';

    export default {
        data() {
            return {
                ...validations,
                valid:false,
                valid2:false,
                valid3:false,
                email:'',
                codigo:'',
                contraseña:'',
                contraseña2:'',
                mensaje:'',
                type:'error',
                loading:false,
                showMessage:false,
                send:false,
                validCode:false,
            }
        },
        computed: {
            passwordConfirmationRule() {
                return () => (this.contraseña === this.contraseña2) || 'Las contraseñas no coinciden.';
            },
        },
        methods:{
            login(){
                router.push('/login');
            },
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
                setTimeout(() => {this.showMessage = false}, 2000);
            },
            sendMail(){
                this.loading = true;
                Auth().post("/sendmail",{data:{user:this.email}}).then(() => {
                    this.respuesta("Codigo enviado.","success");
                    this.send = true;
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error el enviar el codigo","error");
                });
            },
            validc(){
                this.loading = true;
                Auth().post("/validcode",{data:{user:this.email,hash:this.codigo}}).then(() => {
                    this.respuesta("Codigo valido","success");
                    this.validCode=true;
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error el enviar el codigo","error");
                });
            },
            reset(){
                this.loading = true;
                Auth().post("/resetpassword",{data:{user:this.email,password:this.contraseña}}).then(() => {
                    this.respuesta("Contraseña cambiada.","success");
                    setTimeout(() => {
                        this.login();
                    },1000);
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al resetear la contraseña.","error");
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .color{
        color:#2950c3
    }
    .color:hover{
        cursor:pointer;
        text-decoration:underline;
    }
</style>