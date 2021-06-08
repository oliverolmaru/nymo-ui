<template>
  <v-app>
    <template v-if="accessToken != ''">
      <side-menu/>
      <nav-bar/>
    </template>
    <v-main>
      <router-view/>
    </v-main>
    <v-overlay :value="globalNotification" >
        <v-alert
            :type="success ? 'success' : 'error'"
            elevation="8"
            transition="fade-transition"
            >{{globalNotification}}
        </v-alert>
    </v-overlay>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';
import SideMenu from './components/SideMenu';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  components: {
    SideMenu,
    NavBar
  },
  data: () => ({
    reloadTimer: '',
    stillLoading: false
  }),
  created(){
    this.loadCache();
    this.reloadTimer = setInterval(this.checkRealTime,500);
  },
  methods: {
    ...mapActions({
      fetchRealTimeShipLogs: 'fetchRealTimeShipLogs'
    }),
    checkRealTime(){
      if(this.stillLoading || !this.realTimeMode) return;
      
      console.log("refreshing");
      this.stillLoading = true;
      this.fetchRealTimeShipLogs()
      .then(() => {
        this.stillLoading = false;
      })
      .catch(() => {
        this.stillLoading = false;
      });
    },    
    loadCache(){
      if(localStorage.accessToken) this.$store.commit('SET_ACCESS_TOKEN', localStorage.accessToken);
    }
  },
  computed: {
    ...mapState(['accessToken','globalNotification','success','realTimeMode']),
  },
  watch: {
    accessToken: function(){
      if(this.accessToken == '' && this.$router.currentRoute != '/login'){
        this.$router.push('/login');
      }
    }
  },
  beforeDestroy(){
    clearInterval(this.reloadTimer);
  }
};
</script>

<style>
.v-application {
  font-family: 'Lexend Deca', sans-serif !important;
}
</style>
