import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import * as firebase from 'firebase/app'
import router from './router'
import store from './store';

createApp(App).use(store).use(router).mount('#app')
