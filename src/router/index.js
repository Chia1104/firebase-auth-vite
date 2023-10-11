import {
    createRouter,
    createWebHistory
} from "vue-router";
import { trackRouter } from "vue-gtag-next";
import TestPage from "../pages/TestPage.vue";
import HomePage from "../pages/HomePage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import ResultsPage from "../pages/ResultsPage.vue";
import ImageReviewPage from "../pages/ImageReviewPage.vue";
import PhotosPage from "../pages/PhotosPage.vue";
import RaceLog from "../pages/RaceLogPage.vue";
import RaceStartList from "../pages/RaceStartListPage.vue";
import Races from "../pages/Races.vue";
import Race from "../pages/Race.vue";
import RaceAdmin from "../pages/RaceAdmin.vue";
import NotFoundPage from "../pages/exceptions/NotFoundPage.vue";

import {
    firebaseAuth
} from '../../firebase/config';

const routes = [
    // dynamic segments start with a colon
    {
        path: "/e",
        name: 'Events',
        component: Races,
        beforeEnter: (to, from, next) => {
            firebaseAuth.onAuthStateChanged(user => {
                if (user) {
                    next();
                } else {
                    next('/login');
                }
            });
        },
        // children: [  {
        //     path: '/e/:raceId',
        //     name: "Event",
        //     component: Race,
        // },]
    },
    {
        path: '/e',
        name: "Event",
        // component: Race,
        children: [{
            path: ':raceId',
            component: Race,
          },
          {
            path: ':raceId/images',
            component: ImageReviewPage,
          },
          {
            path: ':raceId/edit',
            component: RaceAdmin,
          },
          {
            path: ':raceId/bibs',
            component: RaceStartList,
          },
          {
            path: ':raceId/log',
            component: RaceLog,
          },
        ],
    },
    {
        path: '/r',
        name: "Results",
        component: ResultsPage,
        children: [{
              path: ':raceId',
              component: ResultsPage,
            },
            {
              path: ':raceId/:bib',
              component: ResultsPage,
            },
          ],
    },
    {
        path: '/p',
        name: "Photos",
        component: PhotosPage,
        children: [{
              path: ':raceId',
              component: PhotosPage,
            },
            {
              path: ':raceId/:bib',
              component: PhotosPage,
            },
          ],
    },
    {
        path: "/testpage",
        name: 'TestPage',
        component: TestPage
    },
    {
        path: "/home",
        name: 'HomePage',
        component: HomePage,
        beforeEnter: (to, from, next) => {
            firebaseAuth.onAuthStateChanged(user => {
                if (user) {
                    next();
                } else {
                    next('/login');
                }
            });
        }
    },
    {
        path: "/profile",
        name: 'ProfilePage',
        component: ProfilePage,
        beforeEnter: (to, from, next) => {
            firebaseAuth.onAuthStateChanged(user => {
                if (user) {
                    next();
                } else {
                    next('/login');
                }
            });
        }
    },
    {
        patch: "/",
        redirect: "/home"
    },
    {
        path: "/login",
        name: 'LoginPage',
        component: LoginPage,
        beforeEnter: (to, from, next) => {
            firebaseAuth.onAuthStateChanged(user => {
                if (user) {
                    next('/home');
                } else {
                    next();
                }
            });
        }
    },
    {
        path: "/register",
        name: 'RegisterPage',
        component: RegisterPage,
        beforeEnter: (to, from, next) => {
            firebaseAuth.onAuthStateChanged(user => {
                if (user) {
                    next('/home');
                } else {
                    next();
                }
            });
        }
    },
    {
        path: "/:catchAll(.*)",
        component: NotFoundPage
    }
]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes
});

trackRouter(router);

export default router;