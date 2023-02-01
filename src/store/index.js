import { createStore } from "vuex";
import { countExample } from "./modules/CountExample";
import { auth } from "./modules/Auth";
import { datastore } from "./modules/datastore";
import { actionSheet } from "./modules/ActionSheet";

const store = createStore({
  modules: {
    countExample: countExample,
    auth: auth,
    datastore: datastore,
    actionSheet: actionSheet,
  }
});

export default store;
