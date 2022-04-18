import { createStore } from "vuex";
import { countExample } from "./modules/CountExample";
import { auth } from "./modules/Auth";
import { actionSheet } from "./modules/ActionSheet";

const store = createStore({
  modules: {
    countExample: countExample,
    auth: auth,
    actionSheet: actionSheet,
  }
});

export default store;
