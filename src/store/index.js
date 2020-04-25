import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user:{
            token:null,
            data:{},
            loggedIn:false
        },
        snackbar:false,
        drawer:true,
        editar:null,
        series:[1,1,1]
    },
    mutations: {
        SET_DRAWER(state,val){
            val ? state.drawer = true:state.drawer = false;
        },
        SET_SNACKBAR(state,val){
            val ? state.snackbar = true:state.snackbar = false;
        },
        SET_EDITAR(state,val){
            state.editar = val;
        },
        SET_SERIES(state,val){
            state.series = val;
        },
        //autenticacion
        SET_LOGGED(state,val){//logea al usuario
            let data = {};
            data.loggedIn = true;
            data.token = val.token;
            data.data = val.data;
            state.user = data;
            window.localStorage.setItem('token',val.token);
        },
        LOGOUT(state){//cierra la sesion
            state.user.token=null;
            state.user.data={};
            state.user.loggedIn=false;
            window.localStorage.setItem('token',"");//se elimina el token del storage
        },
    },
    actions: {
        setSnackbar({commit},val){
            commit('SET_SNACKBAR',val);
        },
        setDrawer({commit},val){
            commit('SET_DRAWER',val);
        },
        setEditar({commit},val){
            commit('SET_EDITAR',val);
        },
        setSeries({commit},val){
            commit('SET_SERIES',val);
        },
        logged({commit},val){
            commit('SET_LOGGED',val);
        },
        logout({commit}){
            commit('LOGOUT');
        },
    },
    modules: {
        
    }
});
