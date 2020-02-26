<template>
  <div>
    <template>
      <h3>个人资料</h3>
      <el-form label-width="80px">
        <el-form-item label="姓名">
          <span>{{ user.name }}</span>
        </el-form-item>
        <el-form-item label="所属部门">
          <span>{{ user.department }}</span>
        </el-form-item>
        <el-form-item label="电话">
          <template v-if="editType === 'phone'">
            <el-input
              v-model="newValue"
              :value="newValue"
              style="width: 160px"
            ></el-input>
            <el-button
              type="text"
              icon="el-icon-check"
              style="margin-left: 4px"
              :disabled="
                !Boolean(newValue !== user.phone && newValue.length === 11)
              "
              :loading="loadingAtEdit"
              @click="handleUpdateProfile()"
            ></el-button>
            <el-button
              type="text"
              icon="el-icon-close"
              style="margin-left: 4px"
              @click="
                () => {
                  editType = '';
                  newValue = '';
                }
              "
            ></el-button>
          </template>
          <template v-else>
            <span>{{ user.phone }}</span>
            <el-button
              v-show="editType === ''"
              type="text"
              icon="el-icon-edit"
              style="margin-left: 4px"
              @click="
                () => {
                  editType = 'phone';
                  newValue = user.phone;
                }
              "
            ></el-button>
          </template>
        </el-form-item>
        <el-form-item label="邮箱">
          <template v-if="editType === 'email'">
            <el-input
              v-model="newValue"
              :value="newValue"
              style="width: 160px"
            ></el-input>
            <el-button
              type="text"
              icon="el-icon-check"
              style="margin-left: 4px"
              :disabled="!Boolean(newValue !== user.email)"
              :loading="loadingAtEdit"
              @click="handleUpdateProfile"
            ></el-button>
            <el-button
              type="text"
              icon="el-icon-close"
              style="margin-left: 4px"
              @click="
                () => {
                  editType = '';
                  newValue = '';
                }
              "
            ></el-button>
          </template>
          <template v-else>
            <span>{{ user.email }}</span>
            <el-button
              v-show="editType === ''"
              type="text"
              icon="el-icon-edit"
              style="margin-left: 4px"
              @click="
                () => {
                  editType = 'email';
                  newValue = user.email;
                }
              "
            ></el-button>
          </template>
        </el-form-item>
      </el-form>
    </template>
    <template>
      <h3>修改密码</h3>
      <el-form
        :model="passwordForm"
        ref="passwordForm"
        :rules="passwordRule"
        status-icon
        label-width="80px"
        style="width: 60%; max-width: 320px"
      >
        <el-form-item label="原密码" prop="originPass">
          <el-input
            v-model="passwordForm.originPass"
            type="password"
            auto-complete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            v-model="passwordForm.pass"
            type="password"
            auto-complete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            v-model="passwordForm.checkPass"
            type="password"
            @keyup.enter.native="handleChangePassword"
            auto-complete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleChangePassword"
            :loading="loadingAtClick"
            >更新</el-button
          >
          <el-button @click="resetPasswordForm">取消</el-button>
        </el-form-item>
      </el-form>
      <i class="prompt-small" style="font-size: 12px"
        >注意：更新密码后需要重新登陆</i
      >
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { State, Mutation } from "vuex-class";
import { StoreUser, ChangePasswordInterface } from "@/store/types";
import { ElForm } from "element-ui/types/form";
import { CHANGE_PASSWORD_API, UPDATE_PROFILE_API } from "@/store/api";
import { SET_LOGIN } from "@/store/constTypes";

@Component
export default class Profile extends Vue {
  @State("user") user: StoreUser;
  @Ref("passwordForm") passwordFormIns: ElForm;
  @Mutation(SET_LOGIN) setLogin: any; // SET_LOGIN 是 user/setLogin

  loadingAtClick = false;
  passwordForm = {
    // 密码表单
    originPass: "",
    pass: "",
    checkPass: ""
  };
  editType: "phone" | "email" | "" = "";
  newValue: string = "";
  loadingAtEdit: boolean = false;

  handleUpdateProfile() {
    this.loadingAtEdit = true;
    this.$axios
      .patch(UPDATE_PROFILE_API, {
        type: this.editType,
        newValue: this.newValue
      })
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          this.$message.success("更新成功");
          let _tmp =
            this.editType === "phone"
              ? { phone: this.newValue }
              : { email: this.newValue };
          this.setLogin(_tmp);
          this.newValue = "";
          this.editType = "";
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtEdit = false;
      });
  }

  validatePassCompliance = (rule: any, value: string, callback: any) => {
    if (value === "") {
      callback(new Error("请再次输入密码"));
    } else if (value !== this.passwordForm.pass) {
      callback(new Error("两次输入密码不一致!"));
    } else {
      callback();
    }
  };

  passwordRule = {
    originPass: [{ required: true, message: "请输入原密码", trigger: "blur" }],
    pass: [{ required: true, message: "请输入新密码", trigger: "blur" }],
    checkPass: [{ validator: this.validatePassCompliance, trigger: "blur" }]
  };

  handleChangePassword() {
    this.passwordFormIns.validate(valid => {
      if (valid) {
        let _req: ChangePasswordInterface = {
          originPassword: this.passwordForm.originPass,
          newPassword: this.passwordForm.pass
        };
        this.$axios
          .patch(CHANGE_PASSWORD_API, _req)
          .then((response: AxiosResponse) => {
            let { errcode, errmsg } = response.data;
            if (errcode === 0) {
              this.$message.success("更新密码成功");
              // todo logout
            } else {
              this.$message.error(errmsg);
            }
          })
          .finally(() => {
            this.resetPasswordForm();
          });
      } else {
        return false;
      }
    });
  }

  resetPasswordForm() {
    this.passwordFormIns.resetFields();
  }
}
</script>

<style scoped></style>
