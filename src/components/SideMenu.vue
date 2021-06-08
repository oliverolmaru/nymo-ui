<template>
    <v-navigation-drawer
        v-model="sideMenu"
        :mini-variant="miniMenu"
        width="250"
        app
    >
        <v-list dense nav height="75" class="d-flex justify-center align-center">
            <v-list-item>
                <v-list-item-icon>
                </v-list-item-icon>
                <v-list-item-content >
                    <h1 class="title">DigiNYMO</h1>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-divider/>
        <v-list dense nav>
            <v-list-item v-for="item in menuItems" :key="item.label" link :to="item.to">
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="item.label"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'SideMenu',
    data(){
        return{
            menuItems: [
                {
                    label: 'Ülevaade',
                    icon: 'mdi-home',
                    to: '/'
                },{
                    label: 'Veosüsteemid',
                    icon: 'mdi-engine',
                    to: '/propulsion'
                },{
                    label: 'Toiteallikas',
                    icon: 'mdi-flash',
                    to: '/battery'
                },{
                    label: 'Navigatsioon',
                    icon: 'mdi-map',
                    to: '/navigation'
                },{
                    label: 'Sensorid',
                    icon: 'mdi-cctv',
                    to: '/sensors'
                },{
                    label: 'Side',
                    icon: 'mdi-broadcast',
                    to: '/network'
                },
            ]
        }
    },
    computed:{
        ...mapState(['miniMenu']),
        sideMenu: {
            get() {
                return this.$store.state.sideMenu;
            },
            set (val) {
                this.$store.commit('SET_SIDE_MENU', val);
            }
        }
    }

}
</script>

<style>

</style>