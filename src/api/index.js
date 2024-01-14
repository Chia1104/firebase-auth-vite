import { signInWithEmailAndPassword,GoogleAuthProvider, signInWithRedirect,signInWithPopup, createUserWithEmailAndPassword, signOut , updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { collection, doc, getDocs, getDoc, setDoc  } from "firebase/firestore"; 

import { firebaseAuth, db } from '../../firebase/config';

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

/**
 * ```javascript
 * // Sign in using a popup.
 * const provider = new GoogleAuthProvider();
 * provider.addScope('profile');
 * provider.addScope('email');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Google Access Token.
 * const credential = GoogleAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * ```
 */    

export const signInGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    // signInWithRedirect(firebaseAuth, provider)
    return signInWithPopup(firebaseAuth, provider).then((userCredential) => {
        console.debug(`logging in ${userCredential.user.email}`)
        return userCredential.user;
    })
    .catch((error) => {
        throw error.code;
    })
    // debugger;
}

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

export const getRaces = () => {
    const racesRef = collection(db, "races");
    return getDocs(racesRef).then(docSnap=> {
            let dat= docSnap.docs.map(x=>{
                        let o=x.data();
                        o['id']=x.id;
                        return o})
            return dat;
        }).catch((error) => {
            // doc.data() will be undefined in this case
            console.debug("No such document!",error);
            return {}
        }) 
}

export const getAllDocs = (path) => {
    const racesRef = collection(db, path);
    return getDocs(racesRef).then(docSnap=> {
            let dat= docSnap.docs.map(x=>x.data())
            return dat;
        }).catch((error) => {
            // doc.data() will be undefined in this case
            console.debug("No such Collection!",error);
            return {}
        }) 
}

export const  getDocData = async (path) => {
    // debugger
    console.log(`getDocData(): ${path}`)
    const docRef = doc(db, path);
    // console.debug(docRef)
    return await getDoc(docRef).then((docSnap)=> {
            let dat= docSnap.data()
            // console.debug(dat)
            return dat;
        }).catch((error) => {
            // doc.data() will be undefined in this case
            console.debug("No such document!",error);
            return {}
        }) 
}

export const  getPublicUrl = (folder,raceId,file) =>{
    if (file){
        let filename=file.replace(/.png/i,'.jpg')
        return `https://storage.googleapis.com/run-pix.appspot.com/${folder}/${raceId}/${filename}`
    }
}

/**
 * 
 * @param {*} event : event id
 * @param {*} role : manager,volunteer,runner,others
 * @returns 
 */
export const  checkAccessEventRole = (event,role) =>{
    let user= firebaseAuth.currentUser;
    if(user) {
        if (role){
            //check user id in raceManager, raceVolunteers in database
            
        } else {
            return true
        }
    } else {
        return false
    }
}

export const setDocData = async (path,payload,merge) => {
    // debugger
    // console.log(`setDocData(): ${path}`)
    const docRef = doc(db, path);

    if (authorized()) {    
        return await setDoc(docRef,
                            payload,
                            merge? {merge: true} : {} )
                        .then((ret)=> {
                return ret;
            }).catch((error) => {
                // doc.data() will be undefined in this case
                console.debug("Error in setDocData()",error);
                throw Error("Error in setDocData()")
            }) 
        }else{
            console.debug("Error in setDocData()",error);
            throw Error("Error in setDocData()") 
        }
}

function authorized(){
    // debugger
    // firebaseAuth.currentUser
    return true
}