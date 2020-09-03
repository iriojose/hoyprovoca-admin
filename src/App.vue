<template>
    <v-app style="background-color:#fff;">
        <AppBar v-if="ruta() && !loading" />

        <transition name="fade" v-if="!loading">
            <router-view/>
        </transition>  
        
        <v-card elevation="0" width="100%" height="100%" v-if="loading">
            <v-card-text>
                <v-row justify="center" align="center" class="fill-height margen">
                    <div>
                        <v-row justify="center">
                            <Loading />
                        </v-row>
                        <v-btn
                            v-show="error"
                            color="#c9242b"
                            @click="sesion(token)"
                            rounded
                            class=" my-4 text-capitalize subtitle-2 font-weight-bold white--text"
                        >
                            Recargar
                            <v-icon class="mx-2" color="#fff">mdi-reload</v-icon>
                        </v-btn>
                    </div>
                </v-row>
            </v-card-text>
        </v-card>

        <ModalBloqueado />

        <FooterOn v-if="ruta() && !loading" />
        <FooterOff v-if="!ruta() && !loading" />
    </v-app>
</template>

<script>
import Auth from "@/services/Auth";
import router from "@/router";
import { mapActions, mapState } from "vuex";

    export default {
        name: 'App',
        components:{
            AppBar:() => import('@/components/navbar/AppBar'),
            ModalBloqueado:() => import('@/components/dialogs/ModalBloqueado'),
            Loading:() => import("@/components/loaders/Loading"),
            FooterOn:() => import("@/components/footer/FooterDashboard"),
            FooterOff:() => import("@/components/footer/Footer")
        },
        data(){
            return {
                loading:false,
                error:false,
                token:null
            }
        },
        created() {
            this.token = window.localStorage.getItem("admin_token");
            if (this.token != null && this.token != "" && this.token != undefined) this.sesion(this.token);
            else this.loading = false;
        },
        computed: {
            ...mapState(["user", "bloqueado"]),
        },
        methods:{
            ...mapActions(["logged","setModalBloqueado",]),
            
            ruta(){
                if(
                    this.$route.name == 'login' || 
                    this.$route.name == 'forgot' ||
                    this.$route.name == 'register' ||
                    this.$route.name == 'home' ||
                    this.$route.name == 'notauthorized' ||
                    this.$route.name == 'notfound'
                ){
                    return false;
                }else{
                    return true;
                }
            },
            //sesion
            sesion(token) {
                this.loading = true;
                this.error = false;
                Auth().post("/sesion", { token: token }).then((response) => {
                    if(response.data.code == 440){
                        this.loading = false;
                        this.error = false;
                        router.push("/");
                        localStorage.removeItem("admin_token");
                    }
                    if(response.data.response.data.bloqueado == 1){
                        this.setModalBloqueado(true);
                        this.loading = false;
                        this.error = false;
                        localStorage.removeItem("admin_token");
                    } 
                    if(response.data.code == 200) {
                        response.data.response.token = token;
                        //response.data.response.cliente = response.data.response.data.cliente[0];
                        //delete response.data.response.data.vendedor;
                        this.logged(response.data.response);
                        this.loading = false;
                        //router.push("/dashboard");
                    }
                    
                }).catch(() => {
                    this.error = true;
                });
            },
        }
    }
</script>

<style lang="scss" scope>
    .margen {
        margin-top: 150px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    ::-webkit-scrollbar {
        width: 8px;     
        height: 8px;   
    }
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 12px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #b3b3b3;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    }
    ::-webkit-scrollbar-thumb:active {
        background-color: #999999;
    }
    ::-webkit-scrollbar-track {
        background: #fff;
        border-radius: 12px;
    }
    ::-webkit-scrollbar-track:hover,
    ::-webkit-scrollbar-track:active {
        background: #fff;
    }
</style>