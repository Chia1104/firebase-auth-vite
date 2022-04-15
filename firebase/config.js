import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: `${import.meta.env.API_KEY}`,
    authDomain: `${import.meta.env.AUTH_DOMAIN}`,
    projectId: `${import.meta.env.PROJECT_ID}`,
    storageBucket: `${import.meta.env.STORAGE_BUCKET}`,
    messagingSenderId: `${import.meta.env.MESSAGING_SENDER_ID}`,
    appId: `${import.meta.env.APP_ID}`,
    measurementId: `${import.meta.env.MEASUREMENT_ID}`
}

initializeApp(firebaseConfig)

const auth = getAuth()

export { auth }
