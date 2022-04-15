import { createRouter, createWebHistory } from "vue-router";
import TestPage from "../pages/TestPage.vue";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import NotFoundPage from "../pages/exceptions/NotFoundPage.vue";

const routes = [
    {
        path: "/testpage", component: TestPage
    },
    {
        path: "/", component: HomePage
    },
    {
        path: "/login", component: LoginPage
    },
    {
        path: "/register", component: RegisterPage
    },
    {
        path: "/:catchAll(.*)", component: NotFoundPage
    }
]
export default createRouter({
    history: createWebHistory(),
    routes
});
