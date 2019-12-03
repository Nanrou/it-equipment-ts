<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
    <el-table
      :data="userData"
      v-loading="loadingAtRequest"
      stripe
      width="720px"
      @row-click="openUpdateUserForm"
      row-key="pid"
    >
      <el-table-column label="登录账号" prop="username"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="部门" prop="department"></el-table-column>
      <el-table-column label="联系方式" prop="phone"></el-table-column>
      <el-table-column label="权限" prop="role"></el-table-column>
    </el-table>
    <el-dialog
      title="新增用户"
      :visible.sync="dialogVisible"
      destroy-on-close
      width="420px"
    >
      <user-form ref="createForm" v-on:validCallback="handleCreateUser" />
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="handleCreateBtn"
          :loading="loadingAtSubmit"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="修改用户资料"
      :visible.sync="drawerVisible"
      destroy-on-close
      size="35%"
    >
      <user-form
        ref="updateForm"
        v-on:validCallback="handleUpdateUser"
        style="padding-left: 12px"
      />
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="handleUpdateBtn"
          :loading="loadingAtSubmit"
          >确 定</el-button
        >
        <el-button @click="drawerVisible = false">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { UserData } from "@/store/types";
import { ADMIN_API, CREATE_USER_API, UPDATE_USER_API } from "@/store/api";
import { AxiosResponse } from "axios";
import UserForm from "@/views/Settings/UserForm.vue";

@Component({
  components: { UserForm }
})
export default class Admin extends Vue {
  @Ref("updateForm") updateFormIns: UserForm;
  @Ref("createForm") createFormIns: UserForm;

  loadingAtRequest = false;
  loadingAtSubmit = false;
  dialogVisible = false;
  drawerVisible = false;
  userData: UserData[] = [];

  requestData() {
    this.loadingAtRequest = true;
    this.$axios
      .get(ADMIN_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.userData = data;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequest = false;
      });
  }

  openUpdateUserForm(row: any) {
    this.drawerVisible = true;
    setTimeout(() => {
      //@ts-ignore
      this.updateFormIns.initUserForm(row);
    }, 0);
  }

  handleCreateBtn() {
    //@ts-ignore
    this.createFormIns.outputUserForm();
  }

  handleUpdateBtn() {
    //@ts-ignore
    this.updateFormIns.outputUserForm();
  }

  handleCreateUser(form: any) {
    if (form) {
      this.loadingAtSubmit = true;
      this.$axios
        .post(CREATE_USER_API, form)
        .then((response: AxiosResponse) => {
          let { errcode, errmsg } = response.data;
          if (errcode === 0) {
            this.$message.success("新增用户成功！");
            this.dialogVisible = false;
          } else {
            this.$message.error(errmsg);
          }
        })
        .finally(() => {
          this.loadingAtSubmit = false;
        });
    }
  }

  handleUpdateUser(form: any) {
    if (form) {
      this.loadingAtSubmit = true;
      this.$axios
        .patch(UPDATE_USER_API + `$pid=${form.pid}`, form)
        .then((response: AxiosResponse) => {
          let { errcode, errmsg } = response.data;
          if (errcode === 0) {
            this.$message.success("修改用户成功！");
            this.drawerVisible = false;
          } else {
            this.$message.error(errmsg);
          }
        })
        .finally(() => {
          this.loadingAtSubmit = false;
        });
    }
  }

  mounted() {
    this.requestData();
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: center;
  border-top: solid gray;
  padding-top: 12px;
}
</style>
