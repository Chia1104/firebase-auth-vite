import { createStore } from "vuex";
import { countExample } from "./modules/CountExample";
import { firebaseModule } from "./modules/firebase";

const store = createStore({
  modules: {
    countExample: countExample,
    firebaseModule: firebaseModule
  }
});

export default store;
