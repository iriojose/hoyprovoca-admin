<template>
    <v-form v-model="valid" class="mx-5">
        <v-text-field
            label="Usuario/Email"
            single-line
            v-model="data.user"
            type="email"
            outlined
            color="#005598"
            flat
            dense
            :rules="[required('Usuario/Email'), maxLength('Usuario/Email',50)]"
        />
        <v-text-field
            v-model="data.password"
            single-line
            label="Introduzca su contraseña"
            type="password"
            :rules="[required('password'), minLength('password',8)]"
            outlined
            color="#005598"
            dense
            flat
        />
        <v-hover v-slot:default="{hover}" open-delay="200">
            <v-btn 
                block 
                type="submit" 
                class="text-capitalize mt-5"
                :disabled="!valid || loading" 
                color="#005598" 
                :dark="valid && !loading"
                :loading="loading"
                :elevation="hover ? 5:0"
                @click="login()"
            >
                Iniciar Sesión
            </v-btn>
        </v-hover>
    </v-form>
</template>

<script>
import Auth from '@/services/Auth';
import validations from "@/validations/validations";
import router from '@/router';
import {mapActions} from 'vuex';

    export default {    
        data() {
            return {
                valid:false,
                loading:false,
                showPassword:false,
                snackbar:false,
                ...validations,
                data:{
                    user:'',
                    password:''
                }
            }
        },
        methods:{
            ...mapActions(['logged']),

            login(){
                this.loading = true;
                Auth().post("/login",{data:this.data}).then((response) => {
                    console.log(response);
                    this.snackbar=true;
                    this.logged(response.data.token);
                    setTimeout(() => {
                        this.error=null;
                        this.loading=false;
                        router.push('/');
                    },1000);
                }).catch(e => {
                    console.log(e);
                    this.loading = false;
                    this.snackbar=true;
                });
            }
        }
    }
</script>