<template>
  <div style="display: inline">
    <el-button size="small" type="text" @click.stop="openDialog"
      >设置联系人</el-button
    >
    <el-dialog title="设置部门联系人" :visible.sync="dialogVisible">
      <span v-loading="originContactLoading">
        当前联系人: {{ originContact.name || "暂未指定" }}
        {{ originContact.phone }}
      </span>
      <el-form inline v-loading="contactsLoading">
        <el-form-item>
          <el-select
            :value="contact.pid"
            v-model="contact.pid"
            placeholder="请选择联系人"
          >
            <el-option
              v-for="item in contacts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="!Boolean(contact.pid)" @click="setContact"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { DepartmentContact, FormOptions } from "@/store/types";
import {
  GET_DEPARTMENT_CONTACT_API,
  SET_DEPARTMENT_CONTACT_API,
  ADMIN_API
} from "@/store/api";

@Component
export default class DepartmentContactButton extends Vue {
  @Prop(String) did: string;

  dialogVisible = false;
  originContact = {
    name: "",
    phone: ""
  };
  originContactLoading = false;

  contact: DepartmentContact = {
    pid: "",
    name: "",
    phone: ""
  };

  contacts: FormOptions[] = [];
  contactsLoading = false;

  getAllContact() {
    this.contactsLoading = true;
    this.$axios
      .get(ADMIN_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          let _tmp = [];
          for (let d of data) {
            _tmp.push({
              value: d.uid,
              label: d.name
            });
          }
          this.contacts = _tmp;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.contactsLoading = false;
      });
  }

  getSingleContact() {
    this.originContactLoading = true;
    this.$axios
      .get(GET_DEPARTMENT_CONTACT_API + `?did=${this.did}`)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.originContact = { ...data };
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.originContactLoading = false;
      });
  }

  setContact() {
    this.contactsLoading = true;
    this.$axios
      .patch(SET_DEPARTMENT_CONTACT_API, {
        did: this.did,
        pid: this.contact.pid
      })
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          this.$message.success("设置成功");
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.contactsLoading = false;
        this.dialogVisible = false;
      });
  }

  openDialog() {
    this.dialogVisible = true;
    this.getAllContact();
    this.getSingleContact();
  }
}
</script>

<style scoped></style>
