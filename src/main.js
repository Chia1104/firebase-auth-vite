import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import store from './store';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App)

app.use(store).use(router).use(PrimeVue)
app.mount('#app')
