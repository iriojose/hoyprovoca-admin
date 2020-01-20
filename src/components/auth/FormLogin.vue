<template>
    <v-form v-model="valid" class="center" @submit.prevent="">
        <v-row justify="center" align="center">
            <v-col cols="12" md="10" sm="12">
                <v-text-field
                    label="Email"
                    v-model="data1.usuario"
                    :disabled="loading"
                    type="email"
                    clearable
                    outlined
                    prepend-inner-icon="email"
                    color="#005598"
                    dense
                    counter="50"
                    :rules="[required('Email'), emailFormat(), maxLength('Email',50)]"
                />       
            </v-col>
            <v-col cols="12" md="10" sm="12">
                <v-text-field
                    v-model="data1.password"
                    label="Password"
                    :disabled="loading"
                    counter="true"
                    :type="showPassword ? 'text' : 'password' "
                    :rules="[required('password'), minLength('password',8)]"
                    @click:append="showPassword = !showPassword"
                    :append-icon="showPassword ?  'visibility' : 'visibility_off'"
                    :prepend-inner-icon="showPassword ?  'lock_open' : 'lock'"
                    outlined
                    color="#005598"
                    dense
                />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-btn 
                    block 
                    type="submit" 
                    :disabled="!valid || loading" 
                    color="#005598" 
                    :dark="valid && !loading"
                    :loading="loading"
                    @click="login"
                >
                    Enviar
                    <template v-slot:loader>
                        <span class="custom-loader">
                        <v-icon light>cached</v-icon>
                        </span>
                    </template>
                </v-btn>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" :color="error ? '#C62828':'#1B5E20'" right>
            <div v-if="error">
                <v-icon>
                    cancel
                </v-icon>
                {{error}}
            </div>
            <div v-else>
                <v-icon>
                    check
                </v-icon>
                Se ha logueado exitosamente.
            </div>
        </v-snackbar>
    </v-form>   
</template>

<script>
import validations from '@/validations/validations';
import Usuario from '@/services/Usuario';
import {mapState,mapActions} from 'vuex';

    export default {
        data() {
            return {
                data1:{
                    usuario: "",
                    password: "",
                },
                valid:false,
                loading:false,
                showPassword:false,
                snackbar:false,
                error:null,
                ...validations,
            }
        },
        computed: {
            ...mapState(['user'])
        },
        methods: {
            ...mapActions(['setLogin']),

            login(){
                this.loading=true;
                let data = {
                    usuario:this.data1.usuario,
                    password:this.data1.password,
                }
                Usuario().post("/login",{data}).then((response) => {
                    console.log(response);
                    this.snackbar=true;
                    this.loading=false;
                }).catch(e => {
                    this.snackbar=true;
                    this.loading=false;
                    this.error="Ocurrio un error";
                    console.log(e);
                });
            }
        },
    }
</script>

<style scoped>
    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }
    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>