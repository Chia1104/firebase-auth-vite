import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import * as firebase from 'firebase/app'
import router from './router'
import store from './store';

const firebaseConfig = {
    apiKey: `${import.meta.env.API_KEY}`,
    authDomain: `${import.meta.env.AUTH_DOMAIN}`,
    projectId: `${import.meta.env.PROJECT_ID}`,
    storageBucket: `${import.meta.env.STORAGE_BUCKET}`,
    messagingSenderId: `${import.meta.env.MESSAGING_SENDER_ID}`,
    appId: `${import.meta.env.APP_ID}`,
    measurementId: `${import.meta.env.MEASUREMENT_ID}`
};

firebase.initializeApp(firebaseConfig);

createApp(App).use(store).use(router).mount('#app')
