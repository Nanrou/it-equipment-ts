<template>
  <div>
    <bubble-canvas />
    <el-container style="height: 100vh">
      <el-main>
        <login-form class="login-card" />
      </el-main>
      <el-footer>
        <div class="login-footer">
          <p>
            <el-tooltip
              effect="light"
              content="13532227149@163.com"
              placement="top"
            >
              <i class="el-icon-message"></i>
            </el-tooltip>
            &nbsp;联系我们&nbsp;
            <el-tooltip effect="light" content="13532227149" placement="top">
              <i class="el-icon-phone"></i>
            </el-tooltip>
          </p>
          <p>@2019 珠海市供水有限公司 调度热线中心</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import BubbleCanvas from "@/views/Login/BubbleCanvas.vue";
import LoginForm from "@/views/Login/LoginForm.vue";

@Component({
  components: { BubbleCanvas, LoginForm }
})
export default class LoginIndex extends Vue {}
</script>

<style scoped>
.login-card {
  margin: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.login-footer {
  color: #3c3c3c;
  font-size: 16px;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 100px;
  bottom: 10vh;
  transform: translateY(-50%);
}
</style>
