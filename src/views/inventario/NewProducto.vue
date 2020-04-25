<template>
    <div v-if="$route.name == 'nuevoproducto'">
        <Breadcrumbs :items="items"/>

        <Snackbar :icon="icon" :color="color" :mensaje="mensaje"/>
    </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import Conceptos from '@/services/Conceptos';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Images from '@/services/Images';
import Snackbar from '@/components/snackbars/Snackbar';
import {mapState} from 'vuex';

    export default {
        components:{
            Breadcrumbs,
            Snackbar
        },
        data() {
            return {
                ...variables,
                ...validations,
                icon:'',
                mensaje:'',
                color:'',
                showImage:'',
                loading:false,
                valid:false,
                imagen:null,
                id:null,
                data:{

                },
                default:{

                },
                items: [
                    { text: 'Productos', disabled: false},
                    { text: 'Nuevo', disabled: true },
                ],
                rules: [
                    value => !value || value.size < 3000000 || 'Debe pesar menos de 3 MB!',
                ],
            }
        },
        computed: {
            ...mapState(['user'])
        },
        mounted() {
            this.setSnackbar(false);
            this.id = window.localStorage.getItem('editar');
            if(this.id){
                this.getConcepto(this.id);
            }else{
                this.showImage=this.image+'default.png';
            }
        },
        destroyed(){
            window.localStorage.removeItem('editar');
        },
        methods:{
            getConcepto(id){
                Conceptos.get(`/${id}`).then((response) => {
                    console.log(response);
                }).catch(e => {
                    console.log(e);
                });
            },

            postImagen(id){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/conceptos/${id}`,formdata).then(() => {
                    this.mensajeSnackbar('#388E3C','mdi-check-outline','Producto registrado exitosamente.');
                    this.reset();
                }).catch(e =>  {
                    console.log(e);
                    this.mensajeSnackbar('#D32F2F','mdi-alert-octagon','Error al subir la imagen.');
                    this.reset();
                });
            },  
        }
    }
</script>
