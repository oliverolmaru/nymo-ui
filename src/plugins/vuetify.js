import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    breakpoint: {
        mobileBreakpoint: 960,
    },
    theme: {
        dark: true
    }
});
