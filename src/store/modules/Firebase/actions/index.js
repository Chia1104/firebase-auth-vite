import { signIn } from "../../../../api";

export const signInAction = () => async (context, { email, password }) => {
    console.log("Begin user request");
    context.commit("beginUserRequest");
    try {
        const response = await signIn(email, password);
        if (response) context.commit("successUserRequest", response);
        else context.commit("failUserRequest", 'Could not complete login!!');
    } catch (error) {
        context.commit("failUserRequest", error);
    }
};
