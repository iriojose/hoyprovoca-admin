<template>
     <div v-if="$route.name == 'nuevousuario'">
        <Breadcrumbs :items="items"/>
        
        <v-row justify="center" class="mx-2">
            <v-card class="pa-5" width="100%">
                
                <v-toolbar elevation="0" dense v-if="id">
                    <v-spacer></v-spacer>
                    <div v-if="data.perfil_id !== 4 && data.perfil_id !== 1">Bloquear usuario</div>
                    <div v-else>Desbloquear usuario</div>

                    <v-hover v-slot:default="{hover}" v-show="data.perfil_id == 2 || data.perfil_id == 3" title="Bloquear usuario">
                        <v-btn 
                            fab :elevation="hover ? 2:0"
                            small icon @click="block"
                            :disabled="data.perfil_id == 4 ? true:false"
                        >
                            <v-icon color="#D32F2F">mdi-cancel</v-icon>
                        </v-btn>
                    </v-hover>
                    <v-hover v-slot:default="{hover}" title="Desbloquear usuario" v-show="data.perfil_id == 4">
                        <v-btn 
                            :disabled="data.perfil_id !== 4 ?  true:false" fab 
                            :elevation="hover ? 2:0" 
                            small icon 
                            @click="desbloquear">
                            <v-icon color="#388E3C">mdi-check-circle-outline</v-icon>
                        </v-btn>
                    </v-hover>
                </v-toolbar>

                <v-form v-model="valid">
                    <v-row justify="center">
                         <v-col cols="12" md="4" sm="12" align-self="center">
                            <v-img height="150" width="100%" contain :src="showImage" class="mb-5" />

                            <v-file-input
                                :rules="rules"
                                accept="image/png, image/jpeg"
                                placeholder="Seleccionar imagen"
                                append-icon="mdi-camera"
                                label="Imagen Usuario"
                                dense
                                solo
                                :disabled="loading"
                                @change="procesoImg($event)"
                                color="#005598"
                                v-model="imagen"
                            ></v-file-input>

                            <v-select 
                                v-model="perfil"
                                :items="perfiles"
                                return-object
                                label="Tipo de usuario"
                                solo
                                hint="Nivel de usuario"
                                persistent-hint
                                :disabled="id ? true:false"
                                hide-selected
                                dense
                                color="#005598"
                                @change="selectPerfil($event)"
                            />

                            <v-dialog v-model="dialog" width="400" transition="dialog-bottom-transition">
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-on="on"
                                        label="Empresa"
                                        solo
                                        v-if="!id"
                                        v-model="empresa.nombre_comercial"
                                        :disabled="data.perfil_id !== 2 || loading"
                                        color="#005598"
                                        hint="Empresa"
                                        persistent-hint
                                        dense
                                        :rules="[required('Empresa')]"
                                    />
                                </template>
                                <v-card width="100%" class="pa-2">
                                    <v-card-actions>
                                        <v-btn 
                                            @click="getEmpresas()" 
                                            dark 
                                            class="mb-2 mx-2 text-capitalize caption" 
                                            color="#005598"
                                            :disabled="empresas.length == total || loading ? true:false"
                                        >
                                            Ver más 
                                            <v-icon dark class="ml-2">mdi-chevron-right-box</v-icon>
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-text-field
                                            v-model="search"
                                            label="Buscar"
                                            single-line
                                            append-icon="mdi-magnify"
                                            type="text"
                                            color="#005598"
                                            hide-details
                                            dense
                                        />
                                    </v-card-actions>
                                    <v-card-text>
                                        <v-data-table
                                            :loading="loading && '#005598'" 
                                            loading-text="Loading... Please wait" 
                                            :headers="headers" 
                                            :items="empresas"  
                                            :search="search"
                                            @click:row="select($event)"
                                        >
                                            <template v-slot:item.imagen="{item}">
                                                <v-avatar size="50">
                                                    <v-img :src="image+item.imagen"></v-img>
                                                </v-avatar>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                        </v-col>
                        <v-col cols="12" md="8" sm="12">
                            <v-row justify="center">
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Nombre"
                                        solo
                                        v-model="data.nombre"
                                        :disabled="loading"
                                        hint="Nombre"
                                        persistent-hint
                                        color="#005598"
                                        dense
                                        :rules="[required('Nombre')]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Apellido"
                                        solo
                                        v-model="data.apellido"
                                        :disabled="loading"
                                        color="#005598"
                                        hint="Apellido"
                                        persistent-hint
                                        dense
                                        :rules="[required('Apellido')]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Usuario"
                                        solo
                                        :disabled="id || loading ? true:false"
                                        v-model="data.login"
                                        color="#005598"
                                        hint="Usuario"
                                        persistent-hint
                                        dense
                                        :rules="[required('Usuario')]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Correo electrónico"
                                        solo
                                        prepend-inner-icon="mdi-at"
                                        v-model="data.email"
                                        :disabled="id || loading ? true:false"
                                        color="#005598"
                                        dense
                                        hint="ejemplo@gmail.com"
                                        persistent-hint
                                        :rules="[required('Correo electronico'),emailFormat()]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-menu
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="data.fecha_nac"
                                                label="Fecha de nacimiento"
                                                hint="YYYY/MM/DD format"
                                                persistent-hint
                                                color="#005598"
                                                append-icon="mdi-calendar-range"
                                                solo
                                                dense
                                                single-line
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker 
                                            v-model="data.fecha_nac" no-title 
                                            header-color="#005598"
                                            color="#005598"
                                        />
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field
                                        label="Telefono"
                                        solo
                                        prepend-inner-icon="mdi-cellphone"
                                        v-model="data.telefono"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                        @input="change"
                                        hint="0000-000-0000"
                                        persistent-hint
                                        :rules="[required('Telefono'), minLength('Telefono',13),maxLength('Telefono',13)]"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12" v-if="!id">
                                    <v-text-field
                                        label="Contraseña"
                                        solo
                                        v-model="data.password"
                                        :disabled="loading"
                                        color="#005598"
                                        dense
                                        hint="********"
                                        persistent-hint
                                        :type="showPassword ? 'text' : 'password'"
                                        :rules="[required('Contraseña'), minLength('Contraseña',6)]"
                                        @click:append="showPassword = !showPassword"
                                        :append-icon="showPassword ?  'mdi-eye' : 'mdi-eye-off'"
                                        :prepend-inner-icon="showPassword ?  'mdi-lock-open-variant' : 'mdi-lock'"
                                    />
                                </v-col>
                                <v-col cols="12" md="6" sm="12" v-if="!id">
                                    <v-text-field
                                        v-model="contraseña"
                                        label="Repetir Contraseña"
                                        single-line
                                        type="password"
                                        :rules="[required('Contraseña'),passwordConfirmationRule()]"
                                        prepend-inner-icon="mdi-lock"
                                        solo
                                        color="#005598"
                                        dense
                                    />  
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-btn 
                                        :dark="valid"
                                        :disabled="!valid"
                                        :loading="loading"
                                        color="#005598"
                                        block
                                        @click="post"
                                        class="text-capitalize font-weight-bold white--text"
                                    >
                                        Guardar
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>
        </v-row>
    </div>
</template>

<script>
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import validations from '@/validations/validations';
import variables from '@/services/variables_globales';
import Usuario from '@/services/Usuario';
import Empresa from '@/services/Empresa';
import Images from '@/services/Images';
import Auth from '@/services/Auth';

    export default {
        components:{
            Breadcrumbs,
        },
        data() {
            return {
                ...validations,
                ...variables,
                offset:0,
                total:0,
                search:'',
                empresas:[],
                empresa:{
                    nombre_comercial:'',
                },
                dialog:false,
                showPassword:false,
                contraseña:'',
                id:null,
                imagen:null,
                showImage:'',
                valid:false,
                loading:false,
                perfil:null,
                items: [
                    { text: 'Usuarios', disabled: false},
                    { text: 'Nuevo', disabled: true },
                ],
                data2:{
                    perfil_id:"4"
                },
                data:{
                    nombre:'',
                    apellido:'',
                    login:'',
                    email:'',
                    telefono:'',
                    fecha_nac:new Date().toISOString().substr(0,10),
                    usuario_at:new Date().toISOString().substr(0,10),
                    adm_empresa_id:null,
                    perfil_id:null,
                    password:'',
                },
                default:{
                    nombre:'',
                    apellido:'',
                    login:'',
                    email:'',
                    telefono:'',
                    fecha_nac:new Date().toISOString().substr(0,10),
                    usuario_at:new Date().toISOString().substr(0,10),
                    adm_empresa_id:null,
                    perfil_id:null,
                    password:'',
                },
                rules: [
                    value => !value || value.size < 3000000 || 'Debe pesar menos de 3 MB!',
                ],
                perfiles: [
                    { text: 'Administrador',id:1},
                    { text: 'Super usuario', id:2 },
                    { text: 'Cliente', id:3 }
                ],
                headers: [
                    { text: 'Imagen', value: 'imagen'},
                    { text: 'Nombre',sortable: true, value: 'nombre_comercial'},
                ],
            }
        },
        mounted() {
            this.id = window.localStorage.getItem('editar');
            if(this.id){
                this.getUsuario(this.id);
            }else{
                this.showImage=this.image+'default.png';
            }
            this.getEmpresas();
        },
        destroyed(){
            window.localStorage.removeItem('editar');
        },
        computed: {
            passwordConfirmationRule() {
                return () => (this.data.password === this.contraseña) || 'Las contraseñas no coinciden.';
            },
        },
        methods:{
            success(mensaje){
                this.$toasted.success(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-check-outline",
                });
                this.loading = false;
            },
            error(mensaje){
                this.$toasted.error(mensaje, { 
                    theme: "toasted-primary", 
                    position: "bottom-right", 
                    duration : 2000,
                    icon : "mdi-alert-octagon",
                });
                this.loading = false;
            },
            getUsuario(){
                this.loading = true;
                Usuario().get(`/${this.id}`).then((response) => {
                    this.data = Object.assign({},response.data.data);
                    this.showImage=this.image+this.data.imagen;
                    this.items[1].text="Editar"
                    this.loading = false;
                    if(this.data.perfil_id == 1){
                        this.perfil = this.perfiles[0];
                    }else if(this.data.perfil_id == 2){
                        this.perfil = this.perfiles[1];
                    }else if(this.data.perfil_id == 3){
                        this.perfil = this.perfiles[2];
                    }
                    this.data.fecha_nac = this.data.fecha_nac.substr(0,10);
                }).catch(e => {
                    console.log(e);
                });
            },
            getEmpresas(){
                this.loading=true;
                Empresa().get(`/?limit=50&offset=${this.offset}`).then((response) => {
                    this.total=response.data.totalCount;
                    response.data.data.filter(a => this.empresas.push(a));
                    this.loading=false;
                    this.offset+=50;
                }).catch(e => {
                    console.log(e);
                });
            },
            select(item){
                this.empresa = Object.assign({},item);
                this.data.adm_empresa_id = item.id;
                this.dialog = false;
            },
            selectPerfil(item){
                this.data.perfil_id = item.id;
                this.perfil = item;
                this.empresa = {nombre_comercial:''};
                this.data.adm_empresa_id = null;
            },
            change(){
                if(this.data.telefono.length == 4){
                    this.data.telefono+='-';
                }else if(this.data.telefono.length == 8){
                    this.data.telefono+='-';
                }
            },
            post(){
                if(this.id){
                    this.updateUsuario(this.id);
                }else{
                    this.postUsuario();
                }
            },
            updateUsuario(id){
                this.loading = true;
                Usuario().post(`/${id}`,{data:this.data}).then(() => {
                    if(this.imagen){
                        this.postImagen(id);
                        this.success('Usuario actualizado exitosamente.');
                    }else{
                        this.success('Usuario actualizado exitosamente.');
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.error('Ooops, ocurrio un error.');
                });
            },
            postUsuario(){
                this.loading = true;
                Auth().post("/signup",{data:this.data}).then((response) => {
                    if(this.imagen){
                        this.postImagen(response.data.data.id);
                        this.success('Usuario registrado exitosamente.');
                    }else{
                        this.success('Usuario registrado exitosamente.');
                        this.reset();
                    }
                }).catch(e => {
                    console.log(e);
                    this.error('Oops, ocurrio un error.');
                });
            },
            block(){
                this.loading = true;
                Usuario().post(`/${this.id}`,{data:this.data2}).then(() => {
                    this.data.perfil_id = 4;
                    this.success('Usuario Bloqueado exitosamente.');
                }).catch(e => {
                    console.log(e);
                    this.error('Oops, ocurrio un error.');
                });
            },
            desbloquear(){
                this.loading = true;
                if(this.data.adm_empresa_id == null || this.data.adm_empresa_id == 0){
                    this.data2.perfil_id = 3;
                }else{
                    this.data2.perfil_id = 2;
                }

                Usuario().post(`/${this.id}`,{data:this.data2}).then(() => {
                    this.data.perfil_id = this.data2.perfil_id;
                    this.success('Usuario Desbloqueado exitosamente.');
                }).catch(e => {
                    console.log(e);
                    this.error('Oops, ocurrio un error.');
                });
            },
            //procesamiento de imagenes 
            procesoImg(evt){
                if(evt){
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        this.showImage = e.target.result;
                        this.imagen = evt;
                    }
                    reader.readAsDataURL(evt);
                }else{
                    this.imagen = null;
                    this.showImage=this.image+this.data.imagen;
                }
            },
            reset(){
                this.data = Object.assign({},this.default);
                window.localStorage.removeItem('editar');
                this.showImage=this.image+'default.png';
                this.imagen=null;
                this.items[1].text="Nuevo"
                this.id = null;
                this.empresa = {nomber_comercial:''};
                this.perfil = null;
                this.contraseña = '';
            },
            postImagen(id){
                let formdata = new FormData();
                formdata.append('image',this.imagen);

                Images().post(`/main/usuario/${id}`,formdata).then(() => {
                    this.success('Imagen subida exitosamente.');
                    this.reset();
                }).catch(e =>  {
                    console.log(e);
                    this.error('Error al subir la imagen.');
                    this.reset();
                });
            }, 
        }
    }
</script>
