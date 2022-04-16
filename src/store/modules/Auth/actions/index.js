import { signIn } from "../../../../api";

export const signInAction = async (context, {email, password}) => {
    if (!email || !password) return context.commit("failUserRequest", "Email and password are required");
    context.commit("beginUserRequest");
    try {
        const response = await signIn(email, password);
        if (response) return context.commit("successUserRequest", response);
        else return context.commit("failUserRequest", 'Could not complete login!!');
    } catch (error) {
        return context.commit("failUserRequest", error);
    }
};
