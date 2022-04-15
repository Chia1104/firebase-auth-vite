import { firebaseInitState } from "./states";
import { beginUserRequest, successUserRequest, failUserRequest } from "./mutations";
import { signInAction } from "./actions";

export const firebaseModule = {
    state: () => firebaseInitState,
    mutations: { beginUserRequest, successUserRequest, failUserRequest },
    actions: { signInAction },
}
