import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import store from './store';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import VueGtag from "vue-gtag-next";
import VueSocialSharing from 'vue-social-sharing'
// import vue3GoogleLogin from 'vue3-google-login'


const app = createApp(App)
app.config.devtools = true

app.use(store)
    .use(VueGtag, {
        property: {
        id: "G-BV8G5NRLDP"
        }
    })
    .use(VueSocialSharing)
    .use(router)
    // PrimeVUE
    .use(PrimeVue)
    .use(ToastService)
//     // .use(vue3GoogleLogin, {
//     // clientId: '1008690560612-k8am9a162v8i2psshjidecn0d10adkij.apps.googleusercontent.com'
//     // } )

app.component('Button', Button);
app.directive('tooltip', Tooltip);

app.mount('#app')
