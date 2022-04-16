import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut , updatePassword } from "firebase/auth";
import { firebaseAuth } from '../../firebase/config';

export const getUser = () => {
    try {
        return firebaseAuth.currentUser;
    } catch (error) {
        throw error;
    }
}

export const signIn = (email, password) => signInWithEmailAndPassword(firebaseAuth, email, password)
    .then((userCredential) => {
        return userCredential.user;
    })
    .catch((error) => {
        throw error.code;
    })

export const register = (email, password) => createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then((userCredential) => {
        return userCredential.user;
    })
    .catch((error) => {
        throw error.code;
    })

export const logOut = () => signOut(firebaseAuth)
    .then(() => {
        return true;
    })
    .catch((error) => {
        throw error.code;
    })

export const changePassword = (user, password) => updatePassword(user, password)
    .then(() => {
        return true;
    })
    .catch((error) => {
        throw error.code;
    })
