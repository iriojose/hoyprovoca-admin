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
                            
                            <v-card elevation="0" height="50">
                                <v-fade-transition>
                                    <v-alert dense :type="type" v-show="showMessage">
                                        {{mensaje}}
                                    </v-alert>
                                </v-fade-transition> 
                            </v-card>

                            <v-form v-model="valid" @submit.prevent="" v-if="!send">
                                <v-text-field
                                    filled
                                    rounded
                                    :disabled="loading"
                                    v-model="email"
                                    single-line
                                    color="#2950c3"
                                    :success-messages="success"
                                    :error-messages="errors"
                                    @input="getUser(email)"
                                    label="Ingrese correo electrónico"
                                >
                                    <template v-slot:append>
                                        <v-fade-transition leave-absolute>
                                            <v-progress-circular
                                                v-if="loading2"
                                                size="24"
                                                color="info"
                                                indeterminate
                                            ></v-progress-circular>
                                            <img v-else width="24" height="24" :src="require('@/assets/logo 3.png')">
                                        </v-fade-transition>
                                    </template>
                                </v-text-field>

                                <v-btn
                                    rounded
                                    color="#2950c3"
                                    block
                                    :disabled="success == '' ? true:false "
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
import Usuario from '@/services/Usuario';

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
                loading2:false,
                showMessage:false,
                send:false,
                success:'',
                errors:[],
                validCode:false,
            }
        },
        computed: {
            passwordConfirmationRule() {
                return () => (this.contraseña === this.contraseña2) || 'Las contraseñas no coinciden.';
            },
        },
        head:{
            title(){
                return {
                    inner:'Forgot',
                    separator:' ',
                    complement: ' '
                }
            }
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
            async sendMail(){
                this.loading = true;
                await Auth().post("/sendmail",{data:{user:this.email}}).then(() => {
                    this.respuesta("Codigo enviado.","success");
                    this.send = true;
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error el enviar el codigo","error");
                });
            },
            async validc(){
                this.loading = true;
                await Auth().post("/validcode",{data:{user:this.email,hash:this.codigo}}).then(() => {
                    this.respuesta("Codigo valido","success");
                    this.validCode=true;
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error el enviar el codigo","error");
                });
            },
            async reset(){
                this.loading = true;
                await Auth().post("/resetpassword",{data:{user:this.email,password:this.contraseña}}).then(() => {
                    this.respuesta("Contraseña cambiada.","success");
                    setTimeout(() => {
                        this.login();
                    },1000);
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error al resetear la contraseña.","error");
                });
            },
            async getUser(email){
                this.errors = [];
                this.success = '';

                if(email.length <= 0) return this.errors.push('Debe ingresar un email');

                // eslint-disable-next-line
                let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/ 
                if (!regex.test(this.email)) return this.errors.push(`Debe ingresar un email válido`);

                this.loading2 = true;
                await Usuario().get(`/?email=${email}`).then((response) => {
                    this.loading2 = false;
                    if(!response.data.data) {
                        return this.errors.push('Este email no esta registrado');
                    }else{
                        this.success='Email verificado';
                    }
                }).catch(e => {
                    console.log(e);
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