import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify';
import "@mdi/font/css/materialdesignicons.css";
import Croppa from 'vue-croppa'

Vue.use(Croppa);
Vue.config.productionTip = false;

let token = window.localStorage.getItem('token');

if(token){
  store.state.user.logged=true;
  store.state.user.token=token;
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
