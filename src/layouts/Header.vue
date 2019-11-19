<template>
  <div class="header-style">
    <el-button
      @click="logout"
      :loading="loading"
      type="primary"
      style="margin-right: 12px"
      >登出</el-button
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { SET_LOGOUT } from "@/store/constTypes";

const userStore = namespace("@/store/modules/user");

@Component
export default class Header extends Vue {
  @userStore.Mutation(SET_LOGOUT) setLogout: any;

  loading = false;

  logout() {
    this.loading = true;
    this.setLogout();
    this.loading = false;
  }
}
</script>

<style scoped>
.header-style {
  float: right;
}
</style>
