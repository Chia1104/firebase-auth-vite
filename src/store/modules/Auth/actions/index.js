import {
    signIn,
    getUser,
    register,
    logOut,
    changePassword
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
        if (response) return context.commit("successRequestUser", {
            displayName: response.displayName,
            email: response.email,
            photoURL: response.photoURL,
            uid: response.uid,
            emailVerified: response.emailVerified,
        });
        else return context.commit("failRequestUser", 'You are not logged in');
    } catch (error) {
        return context.commit("failRequestUser", error);
    }
};
