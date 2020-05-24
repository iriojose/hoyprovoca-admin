<template>
    <v-card width="100%" height="1000" elevation="0" color="#2950c3">
        <v-card-text>
            <v-row justify="center" class="py-10">
                <v-card width="900" height="570" :class="$vuetify.breakpoint.smAndDown ? 'mx-4':null">
                    <v-row justify="center">
                        <v-col cols="12" md="6" class="hidden-sm-and-down">
                            <v-img width="100%" height="500" contain :src="require('@/assets/dashboard.svg')"></v-img>
                        </v-col>
                        <v-col cols="12" md="6" sm="12" class="pa-12">
                            <div class="headline text-center mb-5">Bienvenido!</div>

                            <v-card elevation="0" height="50">
                                <v-fade-transition>
                                    <v-alert dense :type="type" v-show="showMessage">
                                        {{mensaje}}
                                    </v-alert>
                                </v-fade-transition> 
                            </v-card>

                            <v-form v-model="valid" @submit.prevent="">
                                <v-text-field
                                    filled
                                    rounded
                                    dense
                                    :disabled="loading"
                                    v-model="data.user"
                                    single-line
                                    validate-on-blur
                                    color="#2950c3"
                                    :rules="[required('Correo electrónico'),emailFormat()]"
                                    label="Ingrese correo electrónico"
                                >
                                </v-text-field>
                                <v-text-field
                                    filled
                                    v-model="data.password"
                                    rounded
                                    dense
                                    :disabled="loading"
                                    type="password"
                                    color="#2950c3"
                                    :rules="[required('Contraseña'),minLength('Contraseña',6)]"
                                    single-line
                                    label="Ingrese Contraseña"
                                >
                                </v-text-field>

                                <v-checkbox 
                                    v-model="custom" 
                                    color="#2950c3"
                                    :disabled="loading"
                                    label="Recordar"
                                ></v-checkbox>

                                <v-btn
                                    rounded
                                    color="#2950c3"
                                    block
                                    :loading="loading"
                                    height="40"
                                    @click="validacion"
                                    class="text-capitalize caption white--text"
                                >
                                    Login
                                </v-btn>
                            </v-form>

                            <v-divider class="my-10"></v-divider>

                            <div class="subtitle-2 text-center color" @click="forgot">¿Olvido su contraseña?</div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import router from '@/router';
import {mapActions} from 'vuex';
import validations from '@/validations/validations';
import Auth from '@/services/Auth';

    export default {
        data() {
            return {
                ...validations,
                custom:false,
                data: {
                    user: "",
                    password: "",
                },
                showMessage:false,
                valid:false,
                loading:false,
                mensaje:'',
                type:'error',
            }
        },
        methods: {
            ...mapActions(['logged','setModalBloqueado']),

            forgot(){
                router.push('/forgot');
            },
            validacion(){
                if(this.valid) this.login();
                else this.respuesta('Campos invalidos','error');
            },
            head:{
                title(){
                    return {
                        inner:'Dashboard',
                        separator:' ',
                        complement: ' '
                    }
                }
            },
            respuesta(mensaje,type){
                this.mensaje = mensaje;
                this.type = type
                this.loading = false;
                this.showMessage = true;
                setTimeout(() => {this.showMessage = false}, 2000);
            },
            async login(){
                this.loading = true;
                await Auth().post("/login",{data:this.data}).then((response) =>{
                    if(response.data.data.perfil_id < 3 || response.data.data.perfil_id > 4){
                        this.logged(response.data);
                        this.respuesta("Bienvenido",'success');
                        setTimeout(() => {router.push('/');},500);
                    }else if(response.data.data.perfil_id == 4){
                        this.setModalBloqueado(true);
                        this.loading = false;
                    }else{
                        this.respuesta('Este usuario no pertenece a este sistema','error');
                    }
                }).catch(e => {
                    console.log(e);
                    this.respuesta('Usuario y/o contraseña incorrecta.','error');
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .color{
        color:#2950c3;
    }
    .color:hover{
        cursor:pointer;
        text-decoration:underline;
    }
</style>