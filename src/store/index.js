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
    }
  },
  actions: {
    setBarraLateral({commit},val){
      commit('SET_BARRALATERAL',val);
    }
  },
  modules: {
    
  }
});
