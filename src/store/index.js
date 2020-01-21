import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    barraLateral:true,
    dialogEmpresa:false,
    user:{
      logged:false,
      token:null,
      data:null
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

    SET_DIALOGEMPRESA(state,val){
      if(val){
        state.dialogEmpresa = true;
      }else{
        state.dialogEmpresa = false;
      }
    },

    SET_LOGIN(state,val){
      state.user.logged=true;
      state.user.token=val.token;
      state.user.data=val.response.data;
      window.localStorage.setItem('token',val.token);
    },

    LOGOUT(state){
      state.user.logged=false;
      state.user.token=null;
      state.user.data=null;
      window.localStorage.setItem('token',null);
    },
  },
  actions: {
    setBarraLateral({commit},val){
      commit('SET_BARRALATERAL',val);
    },

    setDialogEmpresa({commit},val){
      commit('SET_DIALOGEMPRESA',val);
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
