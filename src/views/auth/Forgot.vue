<template>
    <v-card width="100%" elevation="0" color="#1f3b63" height="1200">
        <v-card-text>
            <v-row justify="center" class="py-4">
                <v-col cols="12" md="8" sm="12" :class="$vuetify.breakpoint.smAndDown ? 'mx-4':null">
                    <v-row justify="center" class="pb-4">
                        <v-img contain width="100" height="50" :src="require('@/assets/logo 6.png')"></v-img>
                    </v-row>
                    <v-card width="100%">
                        <v-row justify="center">
                            <v-col cols="12" md="6" class="hidden-sm-and-down">
                                <v-img width="100%" height="400" contain :src="require('@/assets/forgot.svg')"></v-img>
                            </v-col>
                            <v-col cols="12" md="6" sm="12" class="pa-12">
                                <div class="headline text-center mb-5">¿Olvido su contraseña?</div>

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
                                        v-model="email"
                                        single-line
                                        color="#0f2441"
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
                                                    color="#0f2441"
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

                                <v-divider class="my-10"></v-divider>

                                <div class="subtitle-2 text-center color" @click="login">¿Ya tienes una cuenta? ¡Iniciar sesión!</div>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>

        <v-footer fixed class="font-weight-medium" elevation="0" color="#1f3b63">
            <v-col class="text-center white--text" cols="12">
                {{ new Date().getFullYear() }} — <strong>Hoyprovoca</strong> 
            </v-col>
        </v-footer>
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
                email:'',
                mensaje:'',
                type:'error',
                loading:false,
                loading2:false,
                showMessage:false,
                success:'',
                errors:[],
            }
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
            },
            sendMail(){
                this.showMessage = false;
                this.loading = true;
                Auth().post("/sendmail",{data:{user:this.email}}).then(() => {
                    this.respuesta("Email enviado","success");
                }).catch(e => {
                    console.log(e);
                    this.respuesta("Error el enviar el Email","error");
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
        color:#000;
        background:#fff;
    }
    .color:hover{
        cursor:pointer;
        text-decoration:underline;
        background:#fff;
    }
</style>