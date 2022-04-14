import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import * as firebase from 'firebase/app'
import router from './router'

const firebaseConfig = {
    apiKey: import.meta.env.MODE.API_KEY,
    authDomain: import.meta.env.MODE.AUTH_DOMAIN,
    projectId: import.meta.env.MODE.PROJECT_ID,
    storageBucket: import.meta.env.MODE.STORAGE_BUCKET,
    messagingSenderId: import.meta.env.MODE.MESSAGING_SENDER_ID,
    appId: import.meta.env.MODE.APP_ID,
    measurementId: import.meta.env.MODE.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

createApp(App).use(router).mount('#app')
