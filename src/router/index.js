import { createRouter, createWebHistory } from "vue-router";
import TestPage from "../pages/TestPage.vue";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";

const routes = [
    {
        path: "/test", component: TestPage
    },
    {
        path: "/", component: HomePage
    },
    {
        path: "/login", component: LoginPage
    },
    {
        path: "/register", component: RegisterPage
    }
]
export default createRouter({
    history: createWebHistory(),
    routes
});
