import { createStore } from "vuex";
import { countExample } from "./modules/CountExample";
import { auth } from "./modules/Auth";

const store = createStore({
  modules: {
    countExample: countExample,
    auth: auth,
  }
});

export default store;
