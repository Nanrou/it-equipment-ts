<template>
  <div>
    <el-container style="min-height: 100vh">
      <el-aside>
        <side-menu />
      </el-aside>
      <el-container>
        <el-header>
          <header />
        </el-header>
        <el-main style="margin: 0 16px">
          <router-view></router-view>
        </el-main>
        <el-footer></el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import Header from "./Header.vue";
import SideMenu from "@/layouts/SideMenu.vue";
import { Vue, Component } from "vue-property-decorator";
@Component({
  components: {
    Header,
    SideMenu
  }
})
export default class BasicLayout extends Vue {}
</script>
