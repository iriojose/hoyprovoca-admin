import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify';
import "@mdi/font/css/materialdesignicons.css";
import Usuario from '@/services/Usuario';

Vue.config.productionTip = false;

let token = window.localStorage.getItem('token');

if(token){
  store.state.user.logged=true;
  store.state.user.token=token;
  Usuario().post("/validate",{user_token:token}).then((response) => {
    store.state.user.data=response.data.data;
  }).catch(e => {
    console.log(e);
  });
}else{
  store.state.user.logged=false;
  store.state.user.token=null;
  store.state.user.data=null;
}

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
