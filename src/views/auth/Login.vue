<template>
    <div>

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