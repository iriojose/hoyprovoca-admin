<template>
   <v-app style="background-color:#eee;">
      <v-content>
          <transition name="fade">
              <router-view/>
          </transition>  
      </v-content>
    </v-app>
</template>

<script>
  export default {
      name: 'App',
  }
</script>

<style>
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }

    body::-webkit-scrollbar{
      width:8px;
    }

    body::-webkit-scrollbar-track{
      -webkit-box-shadow:inset 0 0 3px rgba(0,0,0,0.3);
    }

    body::-webkit-scrollbar-thumb{
      background-color: darkgrey;
      outline: 1px solid slategray;
    }
</style>
