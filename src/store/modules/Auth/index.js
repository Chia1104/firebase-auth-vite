import { authInitState } from "./states";
import {
    beginSignIn,
    successSignIn,
    failSignIn,
    beginRequestUser,
    successRequestUser,
    failRequestUser,
    successLogOut,
    failLogOut,
    beginRegister,
    successRegister,
    failRegister,
    beginChangePassword,
    successChangePassword,
    failChangePassword,
} from "./mutations";
import {
    signInAction,
    signInGoogleAction,
    getUserAction,
    logOutAction,
    registerAction,
    changePasswordAction
} from "./actions";

export const auth = {
    state: () => authInitState,
    mutations: {
        beginSignIn,
        successSignIn,
        failSignIn,
        beginRequestUser,
        successRequestUser,
        failRequestUser,
        successLogOut,
        failLogOut,
        beginRegister,
        successRegister,
        failRegister,
        beginChangePassword,
        successChangePassword,
        failChangePassword,
    },
    actions: {
        signInAction,
        signInGoogleAction,
        getUserAction,
        logOutAction,
        registerAction,
        changePasswordAction
    },
}
