import { actionSheetInitState } from "./states";
import {
    activeChangePasswordSheet,
} from "./mutations";
import {
    activeChangePasswordSheetAction,
} from "./actions";

export const actionSheet = {
    state: actionSheetInitState,
    mutations: {
        activeChangePasswordSheet,
    },
    actions: {
        activeChangePasswordSheetAction,
    }
};
