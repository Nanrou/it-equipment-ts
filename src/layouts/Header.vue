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
      <el-col :span="1" :offset="2">
        <el-tooltip content="登出">
          <el-button
            @click="logout"
            :loading="loading"
            type="text"
            style="margin-right: 12px; color: gray"
          >
            <svg class="icon">
              <use xlink:href="#icon-log-out" />
            </svg>
          </el-button>
        </el-tooltip>
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
require("../assets/iconfont/log-out");
import { Vue, Component } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import { SET_LOGOUT } from "@/store/constTypes";
import { StoreUser } from "@/store/types";
import { AxiosResponse } from "axios";
import { LOGOUT_API } from "@/store/api";

import moment from "moment";
import { Moment } from "moment";

// const userStore = namespace("user");

@Component
export default class Header extends Vue {
  // @userStore.Mutation("user/setLogout") setLogout: any;
  @Mutation(SET_LOGOUT) setLogout: any; // SET_LOGOUT 是 user/setLogout
  @State("user") user: StoreUser;

  inputValue = "";
  loading = false;
  timeText: Moment = moment().locale("zh-cn");
  intervalMoment: number = 0;

  logout(): void {
    this.loading = true;
    this.$axios
      .get(LOGOUT_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          this.$message.success("登出成功！");
          this.setLogout();
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loading = false;
      });
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

.icon {
  width: 22px;
  height: 22px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  text-align: center;
}
</style>
