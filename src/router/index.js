import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/index/index.vue";
import createHelper from "vue-router-keep-alive-helper";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
  },
  {
    path: "/home",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue"),
  },
  {
    path: "/newGraph",
    name: "NewGraph",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Newgraph.vue"),
  },
  {
    path: "/company",
    name: "Company",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Company.vue"),
  },
  {
    path: "/search",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Search.vue"),
  },
  {
    path: "/detail",
    name: "Detail",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Detail.vue"),
  },
  {
    path: "/hello",
    name: "Hello",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Hello.vue"),
  },
  {
    path: "/tree",
    name: "Tree",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Tree.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/User.vue"),
  },
  {
    path: "/test",
    name: "Test",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Test.vue"),
  },
  // {
  //   path: "/socket",
  //   name: "Socket",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../components/Socket.vue"),
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// replaceStay是需要缓存的组件地址，缓存后跳转该页面的地址必须是$router.replace('/url')
createHelper({ Vue, router, replaceStay: ["/search"] });

export default router;
