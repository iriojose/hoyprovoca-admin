import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import head from "./plugins/head";
import toasted from "./plugins/toasted";
import vuetify from './plugins/vuetify';
import "@babel/polyfill";
import "@mdi/font/css/materialdesignicons.css";
import croppa from 'vue-croppa';
Vue.use(croppa);

new Vue({
    store,
    router,
    vuetify,
    toasted,
    head,
    render: h => h(App)
}).$mount("#app");
    
   