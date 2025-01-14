import { createRouter, createWebHistory} from "vue-router";

import LegendList from './../components/LegendList/LegendList.vue';
import LegendFilter from './../components/LegendFilter/LegendFilter.vue';
import LegendView from './../components/LegendView/LegendView.vue';
import SettingsView from './../components/SettingsView/SettingsView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: "home",
            component: LegendList
        },
        {
            path: '/filter',
            name: "filter",
            component: LegendFilter
        },
        {
            path: '/settings',
            name: "settings",
            component: SettingsView
        },
        {
            path: '/:legendSlug/:cardSlug?',
            name:"legend",
            component: LegendView
        }
        /*{
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/AboutView.vue"),
        },*/
    ],
});

export default router;
