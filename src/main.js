import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import head from "./plugins/head";
import toasted from "./plugins/toasted";
import vuetify from './plugins/vuetify';
import "@babel/polyfill";
//import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import Auth from '@/services/Auth';

Vue.config.productionTip = true;
let token = null;
token = window.localStorage.getItem('admin_token');

if(token){
    Auth().post("/sesion",{token:token}).then((response) => {
        store.state.user.data = response.data.data;
        store.state.user.loggedIn = true;
        store.state.user.token = token;
    
        new Vue({
            store,
            router,
            vuetify,
            toasted,
            head,
            render: h => h(App)
        }).$mount("#app");
    
    }).catch(() => {
        new Vue({
            store,
            router,
            vuetify,
            toasted,
            head,
            render: h => h(App)
        }).$mount("#app");
    });
}else{
    new Vue({
        store,
        router,
        vuetify,
        toasted,
        head,
        render: h => h(App)
    }).$mount("#app");
}


