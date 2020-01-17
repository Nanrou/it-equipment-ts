<template>
  <div>
    <el-form inline v-loading="loadingAtRequestConfig">
      <el-form-item
        label="系统配置："
        style="font-weight: bolder"
      ></el-form-item>
      <el-form-item
        v-for="c in configList"
        :key="c[0]"
        :label="configMapper[c[0]]"
      >
        <el-switch
          v-model="c[1]"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0"
          @change="handleConfigChange(c)"
        >
        </el-switch>
      </el-form-item>
    </el-form>
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
      <el-table-column label="权限">
        <template slot-scope="scope">
          <span v-for="i in roleOptions" :key="i.value">
            <el-tag
              v-if="i.value & scope.row.role"
              style="margin-right: 2px; margin-bottom: 2px"
              >{{ i.label }}</el-tag
            >
          </span>
        </template>
      </el-table-column>
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
import {
  ADMIN_API,
  CREATE_USER_API,
  UPDATE_USER_API,
  CONFIG_API
} from "@/store/api";
import { AxiosResponse } from "axios";
import UserForm from "@/views/Settings/UserForm.vue";
import { RoleOptions, ConfigMapper } from "@/store/constTypes";

@Component({
  components: { UserForm }
})
export default class Admin extends Vue {
  @Ref("updateForm") updateFormIns: UserForm;
  @Ref("createForm") createFormIns: UserForm;

  loadingAtRequest = false;
  loadingAtRequestConfig = false;
  loadingAtSubmit = false;
  dialogVisible = false;
  drawerVisible = false;
  userData: UserData[] = [];
  roleOptions = RoleOptions;
  configMapper = ConfigMapper;
  configList: [] = []; // [[k, v], ...]

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
            this.requestData();
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
        .patch(UPDATE_USER_API + `?uid=${form.uid}`, form)
        .then((response: AxiosResponse) => {
          let { errcode, errmsg } = response.data;
          if (errcode === 0) {
            this.$message.success("修改用户成功！");
            this.drawerVisible = false;
            this.requestData();
          } else {
            this.$message.error(errmsg);
          }
        })
        .finally(() => {
          this.loadingAtSubmit = false;
        });
    }
  }

  requestConfig() {
    this.loadingAtRequestConfig = true;
    this.$axios
      .get(CONFIG_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.configList = data;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequestConfig = false;
      });
  }

  handleConfigChange(c: string[]) {
    this.loadingAtRequestConfig = true;
    this.$axios
      .patch(CONFIG_API, { key: c[0], value: c[1] })
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          //@ts-ignore
          this.$message.success(`更改${this.configMapper[c[0]]}配置成功`);
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequestConfig = false;
      });
  }

  mounted() {
    this.requestData();
    this.requestConfig();
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
