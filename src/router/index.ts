import Vue from "vue";
import VueRouter from "vue-router";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

import store from "../store";
// import NotFound from "../views/404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "maintenance" */ "../views/Login/index.vue")
  },
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
          title: "维护相关"
        },
        component: { render: (h: any) => h("router-view") },
        children: [
          {
            path: "/order",
            name: "order",
            meta: {
              icon: "el-icon-phone",
              title: "日常工单"
            },
            component: () =>
              import(
                /* webpackChunkName: "maintenance" */ "../views/Maintenance/Order/index.vue"
              )
          },
          {
            path: "/patrol",
            name: "patrol",
            meta: {
              icon: "el-icon-time",
              title: "巡检计划"
            },
            component: () =>
              import(
                /* webpackChunkName: "maintenance" */ "../views/Maintenance/Patrol/index.vue"
              )
          }
        ]
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
        path: "/statistics",
        name: "statistics",
        meta: {
          icon: "el-icon-pie-chart",
          title: "报表相关"
        },
        component: { render: (h: any) => h("router-view") },
        children: [
          {
            path: "/chart",
            name: "chart",
            meta: {
              icon: "el-icon-data-line",
              title: "图形统计"
            },
            component: () =>
              import(
                /* webpackChunkName: "settings" */ "../views/Statistics/Chart.vue"
              )
          },
          {
            path: "/output",
            name: "output",
            meta: {
              icon: "el-icon-data-analysis",
              title: "报表导出"
            },
            component: () =>
              import(
                /* webpackChunkName: "settings" */ "../views/Statistics/Output.vue"
              )
          }
        ]
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
            path: "/profile",
            name: "person",
            meta: {
              icon: "el-icon-s-custom",
              title: "个人设置"
            },
            component: () =>
              import(
                /* webpackChunkName: "settings" */ "../views/Settings/Profile.vue"
              )
          },
          {
            path: "/admin",
            name: "admin",
            meta: {
              icon: "el-icon-user",
              title: "用户管理"
            },
            component: () =>
              import(
                /* webpackChunkName: "settings" */ "../views/Settings/Admin.vue"
              )
          },
          {
            path: "/department",
            name: "department",
            meta: {
              icon: "el-icon-office-building",
              title: "部门架构"
            },
            component: () =>
              import(
                /* webpackChunkName: "settings" */ "../views/Settings/Department.vue"
              )
          },
          {
            path: "/system",
            name: "system",
            meta: {
              icon: "el-icon-cpu",
              title: "系统配置"
            },
            component: () =>
              import(
                /* webpackChunkName: "settings" */ "../views/Settings/System.vue"
              )
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
