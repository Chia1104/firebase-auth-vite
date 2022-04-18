import {
    signIn,
    getUser,
    register,
    logOut,
    changePassword,
    reAuthenticate,
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

export const registerAction = async (context, {email, password}) => {
    if (email === '' || password === '') return context.commit("failRegister", "Email, password are required");
    context.commit("beginRegister");
    try {
        const response = await register(email, password);
        if (response) return context.commit("successRegister", response);
        else return context.commit("failRegister", 'Could not complete registration!!');
    } catch (error) {
        return context.commit("failRegister", error);
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

export const changePasswordAction = async (context, {oldPassword, newPassword}) => {
    if (oldPassword === '' || newPassword === '') return context.commit("failChangePassword", "Old and new password are required");
    if (newPassword === oldPassword) return context.commit("failChangePassword", "New password must be different from old password");
    context.commit("beginChangePassword");
    try {
        const auth = await reAuthenticate(oldPassword);
        if (auth) {
            const isChange = await changePassword(newPassword);
            if (isChange === true) {
                context.commit("successChangePassword");
                console.debug('Password changed successfully');
            }
            else {
                context.commit("failChangePassword", "Could not change password");
                console.debug('Could not change password');
            }
        } else {
            context.commit("failChangePassword", 'Could not complete change password!!');
            console.debug('Could not complete change password!!');
        }
    } catch (e) {
        return context.commit("failChangePassword", e);
    }
};
