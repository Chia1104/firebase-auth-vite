import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut , updatePassword } from "firebase/auth";
import { firebaseAuth } from '../../firebase/config';

export const signIn = (email, password) => signInWithEmailAndPassword(firebaseAuth, email, password)
    .then((userCredential) => {
        return userCredential.user;
    })
    .catch((error) => {
        return error.message;
    })

export const register = (email, password) => createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then((userCredential) => {
        return userCredential.user;
    })
    .catch((error) => {
        return error.message;
    })

export const singOut = () => signOut(firebaseAuth)
    .then(() => {
        return true;
    })
    .catch((error) => {
        return error.message;
    })

export const changePassword = (user, password) => updatePassword(user, password)
    .then(() => {
        return true;
    })
    .catch((error) => {
        return error.message;
    })
