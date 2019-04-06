import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./components/search/Search.vue")
    },
    {
      path: "/stream",
      name: "Stream",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./components/video-stream/Video-stream.vue")
    }
  ]
});
