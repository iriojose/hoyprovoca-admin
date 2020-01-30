import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    barraLateral:true,
    dialogEmpresa:false,
    dialogInventario:false,
    snackbar:false,
    inventario:{},
    user:{
      logged:false,
      token:null,
      data:null
    }
  },
  mutations: {
    SET_SNACKBAR(state,val){
      if(val){
        state.snackbar = true;
      }else{
        state.snackbar = false;
      }
    },

    SET_INVENTARIO(state,val){
      state.inventario = val;
    },

    SET_DIALOG_INVENTARIO(state,val){
      if(val){
        state.dialogInventario = true;
      }else{
        state.dialogInventario = false;
      }
    },

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
    setSnackbar({commit},val){
      commit('SET_SNACKBAR',val);
    },

    setBarraLateral({commit},val){
      commit('SET_BARRALATERAL',val);
    },

    setDialogEmpresa({commit},val){
      commit('SET_DIALOGEMPRESA',val);
    },

    setInventario({commit},val){
      commit('SET_INVENTARIO',val);
    },

    setDialogInventario({commit},val){
      commit('SET_DIALOG_INVENTARIO',val);
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
