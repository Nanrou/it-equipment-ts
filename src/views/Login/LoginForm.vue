<template>
  <el-card class="login-card">
    <div slot="header">
      <span>登录</span>
    </div>
    <div>
      <el-form
        :model="loginForm"
        :rules="loginFormRule"
        ref="loginForm"
        label-width="70px"
        style="padding-right: 8%; padding-left: 2%; margin-top: 12px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="现在可以直接通过工号登陆了"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="margin-bottom: 8px">
          <el-input
            v-model="loginForm.password"
            type="password"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="margin: 16px auto 0; width: 85%">
        <el-button
          type="primary"
          @click="login"
          :loading="loadingAtSubmit"
          style="width: 100%"
          >登陆</el-button
        >
        <div style="text-align: right;">
          <el-checkbox
            v-model="rememberUser.checkbox"
            @change="handleRemember"
            style="color: #606266"
            >记住用户名</el-checkbox
          >
          <el-button
            @click="handleForgetPassword"
            type="text"
            style="margin-left: 10px; color: #909399"
            >忘记密码</el-button
          >
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { ElForm } from "element-ui/types/form";
import { AxiosResponse } from "axios";
import { LOGIN_API } from "@/store/api";
import { LOCAL_REMEMBER, SET_LOGIN, LOCAL_TOKEN } from "@/store/constTypes";
import { Mutation } from "vuex-class";

@Component
export default class LoginForm extends Vue {
  @Mutation(SET_LOGIN) setLogin: any; // SET_LOGIN 是 user/setLogin
  @Ref("loginForm") loginFormIns: ElForm;

  loadingAtSubmit = false;
  loginForm = {
    username: "",
    password: ""
  };
  loginFormRule = {
    username: [{ required: true, message: "必须填写用户名", trigger: "blur" }],
    password: [{ required: true, message: "必须填写密码", trigger: "blur" }]
  };
  rememberUser = {
    checkbox: false,
    username: ""
  };

  login() {
    this.loginFormIns.validate(valid => {
      if (valid) {
        this.loadingAtSubmit = true;
        this.$axios
          .post(LOGIN_API, {
            username: this.loginForm.username,
            password: this.loginForm.password
          })
          .then((response: AxiosResponse) => {
            let { errcode, errmsg, data } = response.data;
            if (errcode === 0) {
              window.localStorage.setItem(LOCAL_TOKEN, data["token"]);
              this.setLogin(data["user"]);
              this.$message.success("登录成功！");
              this.$router.push("/");
            } else {
              this.$message.error(errmsg);
            }
          })
          .finally(() => {
            if (this.rememberUser.checkbox) {
              // 记住用户名
              this.rememberUser.checkbox = true;
              this.rememberUser.username = this.loginForm.username;
              window.localStorage.setItem(
                LOCAL_REMEMBER,
                JSON.stringify(this.rememberUser)
              );
            }
            this.loadingAtSubmit = false;
          });
      } else {
        return false;
      }
    });
  }

  handleForgetPassword() {
    this.$alert("请联系管理人员", "提示", {
      confirmButtonText: "确定"
    });
  }

  handleRemember(val: boolean) {
    if (!val) {
      this.rememberUser.checkbox = false;
      this.rememberUser.username = "";
      window.localStorage.setItem(
        LOCAL_REMEMBER,
        JSON.stringify(this.rememberUser)
      );
    }
  }

  mounted() {
    let _form = window.localStorage.getItem(LOCAL_REMEMBER) || false;
    if (_form) {
      this.rememberUser = { ...JSON.parse(_form) };
      if (this.rememberUser.checkbox) {
        this.loginForm.username = this.rememberUser.username;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-card {
  width: 32%;
  min-width: 320px;
  max-width: 450px;
  margin: auto;
  text-align: center;
  border-radius: 8px;
  opacity: 0.97;
  background-color: #fdfdfd;
}
</style>
