<template>
  <div class="header-style">
    <el-row>
      <el-col :span="10" :offset="2">
        <div style="display: inline-block; width: 230px">
          <el-input placeholder="请输入内容" v-model="inputValue">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4" style="text-align: center">
        <p>{{ user.department }}</p>
        <p>{{ user.name }}</p>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button
          @click="logout"
          :loading="loading"
          type="primary"
          style="margin-right: 12px"
          >登出</el-button
        >
      </el-col>
      <el-col :span="4" :offset="1">
        <div style="text-align: right; padding-left: 16px; font-size: 14px">
          <p>{{ timeText.format("LL") }}</p>
          <p>{{ timeText.format("HH:mm:ss") }} {{ timeText.format("dddd") }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace, State } from "vuex-class";
import { SET_LOGOUT } from "@/store/constTypes";
import { StoreUser } from "@/store/types";

import moment from "moment";
import { Moment } from "moment";

const userStore = namespace("@/store/modules/user");

@Component
export default class Header extends Vue {
  @userStore.Mutation(SET_LOGOUT) setLogout: any;
  @State("user") user: StoreUser;

  inputValue = "";
  loading = false;
  timeText: Moment = moment().locale("zh-cn");
  intervalMoment: number = 0;

  logout(): void {
    this.loading = true;
    this.setLogout();
    this.loading = false;
  }

  mounted(): void {
    // 输出当前时间
    this.intervalMoment = setInterval(() => {
      this.timeText = moment().locale("zh-cn");
    }, 1000);
  }

  beforeDestroy(): void {
    clearInterval(this.intervalMoment);
  }
}
</script>

<style scoped>
.header-style {
  float: right;
  width: 780px;
}

p {
  margin: 0;
}
</style>
