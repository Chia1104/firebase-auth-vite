import { firebaseInitState } from "./states";
import { beginUserRequest, successUserRequest, failUserRequest } from "./mutations";

export const firebaseModule = {
    state: () => firebaseInitState,
    mutations: { beginUserRequest, successUserRequest, failUserRequest },
}
