import {
    signIn,
    getUser,
    register,
    logOut,
    changePassword,
    getUserObservable,
} from "../../../../api";

export const signInAction = async (context, {email, password}) => {
    if (email === '' || password === '') return context.commit("failSignIn", "Email and password are required");
    context.commit("beginSignIn");
    try {
        const response = await signIn(email, password);
        if (response) return context.commit("successSignIn", response);
        else return context.commit("failSignIn", 'Could not complete login!!');
    } catch (error) {
        return context.commit("failSignIn", error);
    }
};

export const getUserAction = async (context) => {
    context.commit("beginRequestUser");
    try {
        const response = await getUser();
        if (response) context.commit("successRequestUser", response);
        else context.commit("failRequestUser", 'Could not complete request!!');
    } catch (error) {
        context.commit("failRequestUser", error);
    }
};

export const logOutAction = async (context) => {
    try {
        const response = await logOut();
        context.commit("successLogOut", response);
    } catch (error) {
        context.commit("failLogOut", error);
    }
};
