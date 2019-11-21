import Vue from "vue";
import VueRouter from "vue-router";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

import store from "../store";
// import NotFound from "../views/404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/BasicLayout.vue"),
    children: [
      { path: "/", redirect: "/board" },
      {
        path: "/board",
        name: "board",
        meta: {
          icon: "el-icon-data-board",
          title: "公告"
        },
        component: () =>
          import(/* webpackChunkName: "layout" */ "../views/Board.vue")
      },
      {
        path: "/maintenance",
        name: "maintenance",
        meta: {
          icon: "el-icon-cpu",
          title: "维修相关"
        },
        children: []
      },
      {
        path: "/equipment",
        name: "equipment",
        meta: {
          icon: "el-icon-monitor",
          title: "设备相关"
        },
        component: () =>
          import(
            /* webpackChunkName: "equipment" */ "../views/Equipment/index.vue"
          )
      },
      {
        path: "/settings",
        name: "settings",
        meta: {
          icon: "el-icon-setting",
          title: "设置相关"
        },
        component: { render: (h: any) => h("router-view") },
        children: [
          {
            path: "/admin",
            name: "admin",
            meta: {
              icon: "el-icon-user",
              title: "admin"
            }
          },
          {
            path: "/department",
            name: "department",
            meta: {
              icon: "el-icon-office-building",
              title: "department"
            }
          }
        ]
      }
    ]
  },
  {
    path: "*",
    name: "404",
    meta: {
      hideInMenu: true
    },
    component: () => import("../views/404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    Nprogress.start();
  }
  next();
});

router.afterEach(() => {
  Nprogress.done();
});

export default router;
