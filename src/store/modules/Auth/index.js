import { authInitState } from "./states";
import { beginUserRequest, successUserRequest, failUserRequest } from "./mutations";
import { signInAction } from "./actions";

export const auth = {
    state: () => authInitState,
    mutations: { beginUserRequest, successUserRequest, failUserRequest },
    actions: { signInAction },
}
