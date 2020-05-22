<template>
    <div>
        <v-row justify="center" :class="$vuetify.breakpoint.smAndDown ? 'mx-2':null">
            <v-col cols="12" sm="12" md="3" v-for="(card,i) in cards" :key="i">
                <div class="sombra">
                    <v-card elevation="0">
                        <v-alert
                            border="left"
                            colored-border
                            :color="card.clases"
                            elevation="0" class="sombra"
                        >
                            <v-row :justify="$vuetify.breakpoint.smAndDown ? 'center':null">
                                <v-col cols="9">
                                    <div :class="card.clases">{{card.text}}</div>
                                    <div class="subtitle-1 font-weight-black">{{card.number}}</div>
                                </v-col>
                               
                               <v-col cols="3">
                                   <v-icon size="40" color="grey lighten-2">{{card.icon}}</v-icon>
                               </v-col>
                            </v-row>
                        </v-alert>
                    </v-card>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        //mdiClipboardTextMultiple
        // mdiChat
        // mdiCalendarBlank
        data() {
            return {
                cards:[
                    {id:0,number:'$40.000',clases:'blue--text darken-4 overline',text:'GANANCIAS (MES)',icon:'mdi-calendar-blank'},
                    {id:1,number:'20',clases:'green--text darken-4 overline',text:'USUARIOS',icon:'mdi-account-circle'},
                    {id:2,number:'10',clases:'teal--text darken-3 overline',text:'EMPRESAS',icon:'mdi-domain'},
                    {id:3,number:'50',clases:'yellow--text darken-4 overline',text:'PENDIENTES',icon:'mdi-chat'},
                ]
            }
        },
    }
</script>

<style lang="css" scoped>
    .sombra{
       /*box-shadow: 0px 0px 50px 20px (173, 185, 201, 0.9);*/
        box-shadow: 0px 0px 35px 5px rgba(173, 185, 201,0.2);
    }
    .color1{
        color:rgba(28, 73, 133, 0.514)
    }
</style>