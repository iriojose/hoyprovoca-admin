import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    barraLateral:true,
    user:{
      logged:false,
      token:null
    }
  },
  mutations: {
    SET_BARRALATERAL(state,val){
      if(val){
        state.barraLateral = true;
      }else{
        state.barraLateral = false;
      }
    },

    SET_LOGIN(state,val){
      state.logged=true;
      state.token=val.token;
    },

    LOGOUT(state){
      state.logged=false;
      state.token=null;
    },
  },
  actions: {
    setBarraLateral({commit},val){
      commit('SET_BARRALATERAL',val);
    },

    setLogin({commit},val){
      commit('SET_LOGIN',val);
    },

    logout({commit}){
      commit("LOGOUT");
    }
  },
  modules: {
    
  }
});
