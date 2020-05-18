<template>
    <v-dialog v-model="dialog" width="400">
        <v-card>
            <v-toolbar>
                {{title}}
                <v-spacer></v-spacer>
                <slot name="close"></slot>
            </v-toolbar>
            <v-card-text class="my-5">
                <FilePond  
                    ref="pond"
                    label-idle="Drop image here..."
                    labelFileAdded = "Archivo Añadido"
                    :server="{process}"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import variables from '@/services/variables_globales';
import vueFilePond from 'vue-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import Images from '@/services/Images';

const FilePond = vueFilePond( FilePondPluginImagePreview);

    export default {
        components:{
            FilePond
        },
        props:{
            dialog:{
                type:Boolean,
                default:false
            },  
            id:{
                type:String,
                default:''
            },
            entidad:{
                type:String,
                default:''
            },
            title:{
                type:String,
                default:''
            }
        },
        data(){
            return {
                ...variables,
                imagen:null
            }
        },
        methods: {
            process(fieldName, file, metadata, load, error, progress) {
                progress(true, 0, 1);
                let formdata = new FormData();
                formdata.append('image',file);

                Images().post(`/main/grupos/${this.id}`,formdata).then(() => {
                    console.log('subida');
                }).catch(e =>  {
                    console.log(e);
                    console.log('error');
                }); 
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>