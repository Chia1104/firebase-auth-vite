import { createRouter, createWebHistory } from "vue-router";
import TestPage from "../pages/TestPage.vue";
import HomePage from "../pages/HomePage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import NotFoundPage from "../pages/exceptions/NotFoundPage.vue";

const routes = [
    {
        path: "/testpage", component: TestPage
    },
    {
        path: "/home",
        component: HomePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/profile",
        component: ProfilePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        patch: "/",
        redirect: "/home"
    },
    {
        path: "/login",
        component: LoginPage
    },
    {
        path: "/register",
        component: RegisterPage
    },
    {
        path: "/:catchAll(.*)",
        component: NotFoundPage
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// router.beforeEach((to, from) => {
//     // ...
//     // 返回 false 以取消导航
//     return false
// })

export default router;
