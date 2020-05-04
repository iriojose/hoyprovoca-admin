<template>
    <div>
        <v-form v-model="valid" class="mx-5">
            <v-text-field
                label="Usuario / Correo"
                v-model="data.user"
                type="email"
                outlined
                prepend-inner-icon="mdi-at"
                color="#005598"
                :disabled="loading"
                dense
                single-line
                :rules="[required('Usuario / Correo'), maxLength('Usuario / Correo',100)]"
            />    
            <v-text-field
                v-model="data.password"
                label="Contraseña"
                single-line
                :disabled="loading"
                :type="showPassword ? 'text' : 'password'"
                :rules="[required('Contraseña'), minLength('Contraseña',6)]"
                @click:append="showPassword = !showPassword"
                :append-icon="showPassword ?  'mdi-eye' : 'mdi-eye-off'"
                :prepend-inner-icon="showPassword ?  'mdi-lock-open-variant' : 'mdi-lock'"
                outlined
                color="#005598"
                dense
            />  
            <v-hover v-slot:default="{hover}" open-delay="200">
                <v-btn 
                    block 
                    type="submit" 
                    class="text-capitalize mt-5"
                    :disabled="!valid || loading" 
                    :color="hover ? '#388E3C':'#43A047'" 
                    :dark="valid && !loading"
                    :loading="loading"
                    :elevation="hover ? 5:0"
                    @click="login()"
                >
                    Iniciar Sesión
                </v-btn>
            </v-hover>
        </v-form>
    </div>
</template>

<script>
import Auth from '@/services/Auth';
import validations from '@/validations/validations';
import router from '@/router';
import {mapActions} from 'vuex';

    export default {
        data(){
            return {
                data: {
                    user: "",
                    password: "",
                },
                valid:false,
                ...validations,
                showPassword:false,
                loading:false,
            }
        },
        methods: {
            ...mapActions(['logged','setModalBloqueado']),

            success(mensaje){
                this.$toasted.success(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-check-outline",
                });
                this.loading = false;
                router.push('/');
            },
            error(mensaje){
                this.$toasted.error(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-alert-octagon",
                });
                this.loading = false;
            },

            login(){
                this.loading = true;
                Auth().post("/login",{data:this.data}).then((response) =>{
                    if(response.data.data.perfil_id < 3){
                        this.logged(response.data);
                        this.success("Bienvenido "+response.data.data.nombre+" "+response.data.data.apellido+".");
                    }else if(response.data.data.perfil_id == 4){
                        this.setModalBloqueado(true);
                        this.loading = false;
                    }else{
                        this.error('Usuario no permitido');
                    }
                }).catch(e => {
                    console.log(e);
                    this.error('Usuario y/o contraseña incorrecta.');
                });
            }
        },
    }
</script>