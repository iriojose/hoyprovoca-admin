<template>
    <div v-if="$route.name == 'nuevocargo'">
        <Breadcrumbs :items="items"/>

        <v-row justify="center" class="mx-2">
            <v-card width="500" height="500" class="pa-5">
                <v-img height="200" width="100%" contain :src="image+concepto.imagen" class="mb-5" />
                <div class="text-center title font-weight-bold">{{concepto.nombre}}</div>

                <v-form v-model="valid">
                    <v-text-field
                        label="Existencia fisica"
                        solo
                        v-model="concepto.existencias[0].existencia"
                        type="number"
                        disabled
                        color="#005598"
                        dense
                    />

                    <v-text-field
                        label="Existencia Nueva"
                        solo
                        v-model="data.cantidad"
                        type="number"
                        :disabled="loading"
                        color="#005598"
                        dense
                        :rules="[required('Existencia'),positivo('Existencia')]"
                    />

                    <v-btn 
                        :dark="valid"
                        :disabled="!valid"
                        :loading="loading"
                        color="#005598"
                        block
                        @click="postCargos()"
                        class="text-capitalize font-weight-bold white--text"
                    >
                        Guardar
                    </v-btn>
                </v-form>
            </v-card>
        </v-row>

        <Snackbar :icon="icon" :color="color" :mensaje="mensaje"/>
    </div>
</template>

<script>
import Conceptos from '@/services/Conceptos';
import Cargos from '@/services/Cargos';
import Movimiento_deposito from '@/services/Movimiento_deposito';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import Snackbar from '@/components/snackbars/Snackbar';
import {mapActions,mapState} from 'vuex';
import validations from '@/validations/validations';
import router from '@/router';
import variables from '@/services/variables_globales';

    export default {
        components:{
            Breadcrumbs,
            Snackbar
        },
        data() {
            return {
                ...validations,
                ...variables,
                color:'',
                icon:'',
                mensaje:'',
                valid:false,
                loading:false,
                id:null,
                data:{
                    fecha_at:new Date().toISOString().substr(0,10),
                    cantidad:0,
                    adm_conceptos_id:0,
                    usuario_id:0,
                    adm_depositos_id: 1
                },
                movimiento:{
                    adm_depositos_id:1,
                    cantidad:0,
                    adm_conceptos_id:0,
                },
                concepto:{
                    imagen:'default.png',
                    existencias:[
                        {existencia:0}
                    ]
                },
                items: [
                    { text: 'Cargos', disabled: false},
                    { text: 'Nuevo', disabled: true },
                ],
            }
        },
        mounted() {
            this.setSnackbar(false);
            this.id = window.localStorage.getItem('editar');
            this.data.adm_conceptos_id = this.id;
            this.data.usuario_id = this.user.data.id;
            this.getConcepto(this.id);
        },
        computed: {
            ...mapState(['user'])
        },
        destroyed(){
            window.localStorage.removeItem('editar');
        },
        methods:{
            ...mapActions(['setSnackbar']),

            mensajeSnackbar(color,icon,mensaje){
                this.color=color;
                this.icon =icon;
                this.mensaje = mensaje;
                this.setSnackbar(true);
                this.loading = false;
            },
            getConcepto(id){
                this.loading = true;
                Conceptos().get(`/?id=${id}`).then((response) => {
                    this.concepto = response.data.data[0];
                    this.loading = false;
                }).catch(e => {
                    console.log(e);
                });
            },
            postMovimiento(){
                Movimiento_deposito().post("/",{data:this.movimiento}).then((response) => {

                })
            },
            postCargos(){
                Cargos().post("/",{data:this.data}).then(() => {
                    this.mensajeSnackbar('#388E3C','mdi-check-outline','Cargo añadido exitosamente.');
                    router.push("/cargos");
                }).catch(e => {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Ooops, ocurrio un error.');
                    router.push("/cargos");
                });
            }
        }
    }
</script>