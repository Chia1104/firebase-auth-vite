import { authInitState } from "./states";
import {
    beginSignIn,
    successSignIn,
    failSignIn,
    beginRequestUser,
    successRequestUser,
    failRequestUser,
} from "./mutations";
import {
    signInAction,
    getUserAction
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
    },
    actions: {
        signInAction,
        getUserAction
    },
}
