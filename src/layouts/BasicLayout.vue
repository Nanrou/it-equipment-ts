<template>
  <div>
    <el-container style="min-height: 100vh">
      <el-aside :width="collapsed ? '65px' : '220px'" class="side">
        <div class="logo">{{ collapsed ? "IT" : "IT设备管理系统" }}</div>
        <side-menu :is-collapse="collapsed" />
      </el-aside>
      <el-container>
        <el-header class="header">
          <i
            :class="collapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            @click="collapsed = !collapsed"
            style="font-size: 40px"
          ></i>
          <Header />
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
export default class BasicLayout extends Vue {
  collapsed = false;
}
</script>

<style scoped lang="scss">
.logo {
  font-size: 24px;
  text-align: center;
  padding-top: 12px;
  margin-bottom: 24px;
}

.side {
  background: #1c2327;
  color: aliceblue;
  box-shadow: 5px 0 5px 0 #c1c1c1;
}
.header {
  padding: 10px 20px;
  box-shadow: 5px 0 5px 0 #c1c1c1;
}
</style>
