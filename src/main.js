import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import head from "./plugins/head";
import croppa from "./plugins/croppa";
import vuetify from './plugins/vuetify';
import "@babel/polyfill";
//import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import Auth from '@/services/Auth';

Vue.config.productionTip = true;
let token = window.localStorage.getItem('token');

Auth().post("/sesion",{token:token}).then((response) => {
    store.state.user.data = response.data.data;
    store.state.user.loggedIn = true;
    store.state.user.token = token;

    new Vue({
        store,
        router,
        vuetify,
        head,
        croppa,
        render: h => h(App)
    }).$mount("#app");

}).catch(() => {
    new Vue({
        store,
        router,
        vuetify,
        head,
        croppa,
        render: h => h(App)
    }).$mount("#app");
});


