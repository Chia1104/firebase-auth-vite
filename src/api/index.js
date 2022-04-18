import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut , updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { firebaseAuth } from '../../firebase/config';

export const getUser = () => {
    try {
        return firebaseAuth.currentUser;
    } catch (error) {
        throw error;
    }
}

export const getUserObservable = () => {
    try {
        firebaseAuth.onAuthStateChanged(
            (user) => {
                return user;
            }
        );
    } catch (error) {
        throw error;
    }
}

export const reAuthenticate = (password) => reauthenticateWithCredential(firebaseAuth.currentUser, EmailAuthProvider.credential(firebaseAuth.currentUser.email, password))
    .then(
        (user) => {
            console.debug(user);
            return user;
        }
    ).catch(
        (error) => {
            console.debug(error);
            throw error;
        }
    );

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
        throw error;
    })

export const changePassword = (password) => {
    const user = firebaseAuth.currentUser;
    return updatePassword(user, password)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.debug(error);
            throw error;
        })
}
