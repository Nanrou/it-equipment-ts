import Vue from "vue";
import VueRouter from "vue-router";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

import store from "../store";

import { ALIVE_API } from "@/store/api";
import { LOCAL_TOKEN, SET_LOGIN } from "@/store/constTypes";
import { AxiosResponse } from "axios";
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
          title: "维护相关",
          permission: 0b000100
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
              title: "用户管理",
              permission: 0b100000
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
              title: "部门架构",
              permission: 0b100000
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
              title: "系统配置",
              permission: 0b100000
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

  // @ts-ignore
  if (store.state.user.isLogin) {
    next();
  } else if (to.path === "/login") {
    next();
  } else {
    if (window.localStorage.getItem(LOCAL_TOKEN)) {
      Vue.prototype.$axios.get(ALIVE_API).then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          store.commit(SET_LOGIN, data);
          Vue.prototype.$message.success("欢迎回来！");
          next("/");
        } else {
          Vue.prototype.$message.error(errmsg);
          next("/login");
        }
      });
    } else {
      next("/login");
    }
  }
});

router.afterEach(() => {
  Nprogress.done();
});

export default router;
