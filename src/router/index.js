import { createRouter, createWebHistory } from "vue-router";
import TestPage from "../pages/TestPage.vue";
import HomePage from "../pages/HomePage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import NotFoundPage from "../pages/exceptions/NotFoundPage.vue";
import { firebaseAuth } from '../../firebase/config';

const getUser = () => {
    try {
        const user = firebaseAuth.currentUser;
        if(!user) return false;
        else return user;
    } catch (error) {
        return false;
    }
}

const routes = [
    {
        path: "/testpage",
        name: 'TestPage',
        component: TestPage
    },
    {
        path: "/home",
        name: 'HomePage',
        component: HomePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/profile",
        name: 'ProfilePage',
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
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: "/register",
        name: 'RegisterPage',
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

router.beforeEach((to, from, next) => {
    if (to.name !== 'LoginPage' && !getUser) next({ name: 'LoginPage' })
    else if (to.name === 'LoginPage' && getUser) next({ name: 'HomePage' })
    else if (to.name === 'RegisterPage' && getUser) next({ name: 'HomePage' })
    else next()
})

export default router;
