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
    setUserData,
} from "./mutations";
import {
    signInAction,
    getUserAction,
    logOutAction,
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
        setUserData,
    },
    actions: {
        signInAction,
        getUserAction,
        logOutAction,
    },
}
