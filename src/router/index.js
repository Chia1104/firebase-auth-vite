import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
    {
        path: "/test", component: () => import("../pages/TestPage.vue")
    },
    {
        path: "/", component: () => import("../pages/HomePage.vue")
    }
]
export default createRouter({
    history: createWebHashHistory(),
    routes
});
