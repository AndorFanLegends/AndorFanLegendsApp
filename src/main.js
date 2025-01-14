import { createApp } from 'vue';

// TODO move vuetify setup in "plugins" folder as for router ? and store ? ans i18n
// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VuetifyUseDialog from 'vuetify-use-dialog'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi', // This is already the default value - only for display purposes
    }
})

import App from './App.vue'
import router from "./router";

// pinia
import {createPinia} from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

//i18n
import i18n from "./locales/i18n.js";

// Analytics
import {analytics} from "./firebase.js"

// addhomescreen
import AddToHomescreen from '@owliehq/vue-addtohomescreen';

//Service Worker
import './registerServiceWorker'

createApp(App)
    .use(pinia)
    .use(vuetify)
    .use(router)
    .use(i18n)
    .use(VuetifyUseDialog)
    .use(analytics)
    .use(AddToHomescreen, {
        expires: 1,
        title: 'Andor Fan Legends',
        iconPath: 'img/logo.png',
        content: " ",
        buttonColor: '#5f5f5f',
        background: '#33691e',
        color: '#fff',
        iconColor: ''
    })
    .mount('#app')
