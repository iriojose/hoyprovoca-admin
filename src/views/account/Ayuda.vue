<template>
    <div :class="$vuetify.breakpoint.smAndDown ? null:drawer ? 'left':null">
        <v-card min-height="570px" elevation="0">
            <v-card-text>
                <div class="font-weight-black title text-center">Centro de Soporte al Cliente</div>
                <v-row justify="center" align="center" class="mt-3">
                    <div id="talkjs-container" style="width: 100%;; height: 450px"></div>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Talk from 'talkjs';
import w from '@/services/variables_globales';

    export default {
        head: {
            title() {
                return {
                    inner: "Admin",
                    separator:'|',
                    complement:'Soporte'
                };
            }
        },
        data() {
            return {
                ...w,
                me: null,
                other: null,
            }
        },
        computed:{
            ...mapState(['user','fotoChanged','foto','fotoFile','drawer']),
        },
        watch: {
            fotoFile:function(){
                console.log(this.fotoFile);
            },
            fotoChanged: function(){
                this.change = this.fotoChanged;
            },
        },
       methods:{
            ...mapActions(['setSnackbar','setFoto','setFotoChanged']),            
        },
        mounted() {
            let inbox;
            Talk.ready.then(async () => {
                this.me = new Talk.User({
                    id: this.user.data.id !== 2 ? this.user.data.email : "teamlead@somossistemas.com",
                    name: this.user.data.id !== 2 ? this.user.data.nombre + " " + this.user.data.apellido: "Soporte Hoyproca",
                    email: this.user.data.id !== 2 ? this.user.data.email !== "" ? this.user.data.email : null : null, 
                    photoUrl: this.user.data.id !== 2 ? this.user.data.imagen === 'default.png' ? require('@/assets/user.jpg') : this.image+this.user.data.imagen : require('@/assets/2.png'),
                    welcomeMessage: this.user.data.id !== 2 ?  null : "En Hoyprovoca, estamos encantados de ayudarte a solventar tus problemas. Déjanos un mensaje!",
                    role: 'Customer',
                    locale: 'es-ES'
                });
                window.talkSession = new Talk.Session({
                    appId: process.env.VUE_APP_TALKJS_ID,
                    me: this.me
                });
                
                
                if(this.user.data.id !== 2){
                    this.other = new Talk.User({
                        id: "teamlead@somossistemas.com",
                        name: "Soporte Hoyprovoca",
                        email: "teamlead@somossistemas.com",
                        photoUrl: require('@/assets/2.png'),
                        welcomeMessage: "En Hoyprovoca, estamos encantados de ayudarte a solventar tus problemas. Déjanos un mensaje!",
                        role:'Support',
                        locale: 'es-ES'
                    });
                    let conversation = window.talkSession.getOrCreateConversation(Talk.oneOnOneId(this.me, this.other));
                    conversation.setParticipant(this.me);
                    conversation.setParticipant(this.other);
                    inbox = window.talkSession.createInbox({selected: conversation});
                    
                }else{
                    window.talkSession = new Talk.Session({
                        appId: process.env.VUE_APP_TALKJS_ID,
                        me: this.me
                    });
                    let conversation = window.talkSession.getOrCreateConversation(Talk.oneOnOneId(this.me));
                    conversation.setParticipant(this.me);
                    
                    inbox = window.talkSession.createInbox({selected: conversation});
                }
                inbox.mount(document.getElementById("talkjs-container"));
                
            });
        }
    }
</script>

<style lang="scss">
    .left{
        margin-left:250px;
    }
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition-duration: .3s;
        transition-property: height, opacity, transform;
        transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
        overflow: hidden;
    }
    
    .slide-left-enter,
    .slide-right-leave-active {
        opacity: 0;
        transform: translate(2em, 0);
    }
    
    .slide-left-leave-active,
    .slide-right-enter {
        opacity: 0;
        transform: translate(-2em, 0);
    }
    .fixHeight{
        @media (max-width:958px){
            margin-top:-25px!important;
            max-height: 100%!important;
        }
    }
</style>