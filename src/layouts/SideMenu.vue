<template>
  <div>
    <el-menu :collapse="isCollapse" :unique-opened="true">
      <template v-for="item in menuData">
        <el-menu-item v-if="!item.children" :key="item.path">
          <template slot="title">
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
        <el-submenu v-else :index="item.path" :key="item.path">
          <template slot="title">
            <span>{{ item.meta.title }}</span>
          </template>
          <el-menu-item v-for="_item in item.children" :key="_item.path">
            <template slot="title">
              <span>{{ _item.meta.title }}</span>
            </template>
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

@Component
export default class SideMenu extends Vue {
  menuData: RouteConfig[] = [];
  isCollapse = false;

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
    console.log(this.menuData);
  }
}
</script>

<style scoped></style>
