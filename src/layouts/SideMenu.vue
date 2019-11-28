<template>
  <div>
    <el-menu
      :collapse="isCollapse"
      :unique-opened="true"
      :default-active="$router.currentRoute.path"
      background-color="#1c2327"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="border-right: 0; padding-left: 8px"
      router
    >
      <template v-for="item in menuData">
        <el-menu-item v-if="!item.children" :key="item.path" :index="item.path">
          <i :class="item.meta.icon"></i>
          <span slot="title">{{ item.meta.title }}</span>
        </el-menu-item>
        <el-submenu v-else :index="item.path" :key="item.path">
          <template slot="title">
            <i :class="item.meta.icon"></i>
            <span>{{ item.meta.title }}</span>
          </template>
          <el-menu-item
            v-for="_item in item.children"
            :key="_item.path"
            :index="_item.path"
          >
            <i :class="_item.meta.icon"></i>
            <span slot="title">{{ _item.meta.title }}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { auth } from "@/utils/common";
import router from "@/router";
import { RouteConfig } from "vue-router";

@Component({
  props: {
    isCollapse: Boolean
  }
})
export default class SideMenu extends Vue {
  menuData: RouteConfig[] = [];

  getMenuData(routes: RouteConfig[]) {
    const menuData: RouteConfig[] = [];
    for (let item of routes) {
      if (item.meta) {
        if (item.meta.permission && !auth(item.meta.permission)) {
          // 有权限要求且权限不足
          continue;
        }
        if (item.name && !item.meta.hideInMenu) {
          const newItem = { ...item };
          delete newItem.children;
          if (item.children && item.children.length > 0) {
            newItem.children = this.getMenuData(item.children);
          }
          menuData.push(newItem);
        }
      } else if (item.children) {
        menuData.push(...this.getMenuData(item.children));
      }
    }
    return menuData;
  }

  mounted() {
    //@ts-ignore
    this.menuData = this.getMenuData(router.options.routes);
  }
}
</script>

<style scoped></style>
