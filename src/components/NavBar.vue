<template>
    <v-app-bar
        app
        flat
        height="75"
    >
        <v-btn
            fab
            small
            @click="switchMenu()" class="mr-5">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-switch label="Reaalajas" v-model="realTimeMode" dense hide-details/>
        <v-spacer />
        <template v-if="$vuetify.breakpoint.mobile">
            <v-btn
                icon
                small
                @click="modal = true"
                :disabled="realTimeMode"
                class = "mx-4">
                <v-icon>mdi-calendar</v-icon>
            </v-btn>
        </template>
        <template v-else>
            <span class="px-3" :class="[realTimeMode ? 'disabled' : '']">Periood</span>
            <v-select background-color="secondary" solo v-model="selectedLogGroup" :items="logGroups" item-text="name" item-value="id" :disabled="realTimeMode" hide-details dense/>
            <v-spacer />
            <span class="px-3" :class="[realTimeMode ? 'disabled' : '']">Ajaskaala</span>
            <v-select class="mr-5 small-select" background-color="secondary" solo v-model="logTimestep" :items="logTimesteps" item-text="name" item-value="value" item-disabled="disabled" :disabled="realTimeMode" hide-details dense/>
        </template>
        <v-dialog
            v-model="modal"
            >
            <v-card class="pa-3">
                <p class="px-3" :class="[realTimeMode ? 'disabled' : '']">Periood</p>
                <v-select background-color="secondary" solo v-model="selectedLogGroup" :items="logGroups" item-text="name" item-value="id" :disabled="realTimeMode" hide-details dense/>
                <p class="px-3 mt-3" :class="[realTimeMode ? 'disabled' : '']">Ajaskaala</p>
                <v-select background-color="secondary" solo v-model="logTimestep" :items="logTimesteps" item-text="name" item-value="value" item-disabled="disabled" :disabled="realTimeMode" hide-details dense/>
                <v-btn block class="mt-3">Filtreeri</v-btn>
            </v-card>
        </v-dialog>
        <v-btn
            icon
            small
            @click="logout()">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'NavBar',
    data(){
        return{
            logTimesteps: [
                {
                    name: '1 s',
                    value: 1,
                    disabled: true
                },{
                    name: '5 s',
                    value: 5,
                    disabled: false
                },{
                    name: '20 s',
                    value: 20,
                    disabled: false
                },{
                    name: '1 min',
                    value: 60,
                    disabled: false
                },{
                    name: '5 min',
                    value: 300,
                    disabled: false
                },
            ],
            date: new Date().toISOString().substr(0, 10),
            modal: false,
            menuItems: [
                {
                    label: 'Ülevaade',
                    icon: 'mdi-home'
                },{
                    label: 'Mootorid',
                    icon: 'mdi-engine'
                },{
                    label: 'Navigatsioon',
                    icon: 'mdi-map'
                },{
                    label: 'Sensorid',
                    icon: 'mdi-cctv'
                },{
                    label: 'Side',
                    icon: 'mdi-broadcast'
                },
            ],
            menu: null
        }
    },
    computed:{
        ...mapState(['sideMenu','miniMenu','selectedLogGroup','logGroups']),
        selectedLogGroup: {
            get () {
                return this.$store.state.selectedLogGroup
            },
            set (value) {
                this.$store.commit('SET_SELECTED_LOG_GROUP', value)
            }
        },
        logTimestep: {
            get () {
                return this.$store.state.logTimestep
            },
            set (value) {
                this.$store.commit('SET_LOG_TIMESTEP', value)
            }
        },
        realTimeMode: {
            get () {
                return this.$store.state.realTimeMode
            },
            set (value) {
                this.$store.commit('SET_REAL_TIME_MODE', value)
            }
        },
    },
    created(){
        this.$store.dispatch("fetchShipLogGroups").then(() =>{
        this.$store.commit('SET_SELECTED_LOG_GROUP',this.$store.state.logGroups[0].id)
        });
    },
    methods: {
        ...mapMutations({
            setSideMenu: 'SET_SIDE_MENU',
            setMiniMenu: 'SET_MINI_MENU',
            setAccessToken: 'SET_ACCESS_TOKEN'

        }),
        logout(){
            this.$store.commit('SET_ACCESS_TOKEN','');
            this.$router.push('login');
        },
        switchMenu(){
            if(this.$vuetify.breakpoint.mobile){
                //MOBILE
                this.setMiniMenu(false);
                this.setSideMenu(!this.sideMenu);
            }
            else{
                //DESKTOP
                this.setSideMenu(true);
                this.setMiniMenu(!this.miniMenu)
            }
        },
        refreshData(){
            this.$store.dispatch("fetchShipLogs",{
                group_id: this.$store.state.selectedLogGroup,
                timestep: this.$store.state.logTimestep
            });
        }
    },
    watch: {
        logTimestep: function(){
            this.refreshData();
        },
        selectedLogGroup: function(){
            this.refreshData();
        }
    }
}
</script>

<style>
.disabled{
    color: rgba(255, 255, 255, 0.5);
}

.small-select{
    max-width: 120px;
}
</style>