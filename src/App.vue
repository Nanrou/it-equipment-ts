<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ALIVE_API } from "./store/api";
import { LOCAL_TOKEN, SET_LOGIN } from "./store/constTypes";
import { AxiosResponse } from "axios";
import { Mutation } from "vuex-class";

@Component
export default class App extends Vue {
  @Mutation(SET_LOGIN) setLogin: any; // SET_LOGIN 是 user/setLogin

  mounted() {
    if (window.localStorage.getItem(LOCAL_TOKEN)) {
      this.$axios.get(ALIVE_API).then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.setLogin(data);
          this.$message.success("欢迎回来！");
          this.$router.push("/");
        } else {
          this.$message.error(errmsg);
        }
      });
    } else {
      this.$router.push("login");
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
