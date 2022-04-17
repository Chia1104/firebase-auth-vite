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
} from "./mutations";
import {
    signInAction,
    getUserAction,
    logOutAction,
    registerAction,
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
    },
    actions: {
        signInAction,
        getUserAction,
        logOutAction,
        registerAction,
    },
}
