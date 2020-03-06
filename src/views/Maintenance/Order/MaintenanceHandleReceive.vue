<template>
  <el-drawer
    title="接单处理"
    :destroy-on-close="true"
    :visible.sync="visible"
    :before-close="handleClose"
    width="420px"
  >
    <el-tabs type="border-card" style="height: 320px">
      <el-tab-pane label="派工">
        <el-form label-width="80px" style="margin-top: 28px">
          <el-form-item label="负责人员">
            <el-select
              :value="unless"
              v-model="unless"
              placeholder="请选择"
              @change="handleSelectWorker"
            >
              <el-option
                v-for="item in maintenanceWorkers"
                :key="item.pid"
                :label="item.name"
                :value="`${item.pid}|${item.name}|${item.phone}|${item.email}`"
                :disabled="item.email === null"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              maxlength="128"
              :autosize="{ minRows: 3, maxRows: 4 }"
              placeholder="请填写备注内容"
              v-model="dispatchRemark"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="medium"
              :disabled="loadingAtRequest || worker.pid.length === 0"
              @click="handleDispatchWorker"
              :loading="loadingAtSubmit"
              >确认派工</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="远程处理">
        <el-form
          :model="remoteHandleForm"
          label-width="80px"
          style="margin-top: 28px"
        >
          <el-form-item label="处理方式">
            <el-select
              :value="remoteHandleForm.method"
              v-model="remoteHandleForm.method"
              placeholder="请选择"
            >
              <el-option
                v-for="item in remoteHandleMethodOptions"
                :key="'remote' + item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              maxlength="128"
              :autosize="{ minRows: 3, maxRows: 4 }"
              placeholder="请填写备注内容"
              v-model="remoteHandleForm.remark"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="medium"
              :disabled="remoteHandleForm.method.length === 0"
              @click="handleRemoteHandle"
              >确认解决</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { RemoteHandleMethodOptions } from "@/store/constTypes";
import { FormOptions, MaintenanceWorker } from "@/store/types";
import { AxiosResponse } from "axios";
import {
  MAINTENANCE_WORKER_API,
  MAINTENANCE_DISPATCH_API,
  MAINTENANCE_REMOTE_API
} from "@/store/api";

@Component
export default class MaintenanceHandleReceive extends Vue {
  visible = false;
  loadingAtRequest = false;
  loadingAtSubmit = false;
  oid = "";
  orderId = "";

  maintenanceWorkers: MaintenanceWorker[] = [];
  // workers: string[] = [];
  unless = "";
  worker: MaintenanceWorker = {
    pid: "",
    name: "",
    phone: "",
    email: ""
  };
  dispatchRemark = "";

  remoteHandleForm = {
    eid: "",
    method: "",
    remark: ""
  };
  remoteHandleMethodOptions: FormOptions[] = RemoteHandleMethodOptions.map(
    ele => ({
      label: ele,
      value: ele
    })
  );

  requestWorkers() {
    this.loadingAtRequest = true;
    this.$axios
      .get(MAINTENANCE_WORKER_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.maintenanceWorkers = data;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequest = false;
      });
  }

  handleDispatchWorker() {
    this.loadingAtSubmit = true;
    this.$axios
      .patch(MAINTENANCE_DISPATCH_API + `?oid=${this.oid}`, {
        worker: this.worker,
        orderId: this.orderId,
        remark: this.dispatchRemark
      })
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          this.$message.success("派遣成功，并已邮件通知！");
          this.requestData();
          this.closeDialog();
        } else if (errcode === 100016) {
          this.$message.warning(errmsg);
          this.requestData();
          this.closeDialog();
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtSubmit = false;
      });
  }

  handleRemoteHandle() {
    this.loadingAtSubmit = true;
    this.$axios
      .patch(MAINTENANCE_REMOTE_API + `?oid=${this.oid}`, this.remoteHandleForm)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          this.$message.success("操作成功！");
          this.requestData();
          this.closeDialog();
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtSubmit = false;
      });
  }

  openDialog(oid: string, orderId: string, eid: string) {
    this.oid = oid;
    this.orderId = orderId;
    this.remoteHandleForm.eid = eid;
    this.visible = true;
  }

  closeDialog() {
    this.remoteHandleForm = {
      eid: "",
      method: "",
      remark: ""
    };
    this.worker = {
      pid: "",
      name: "",
      phone: "",
      email: ""
    };
    this.oid = "";
    this.orderId = "";
    this.visible = false;
  }

  handleSelectWorker(value: string) {
    let _tmp = value.split("|");
    this.worker = {
      pid: _tmp[0],
      name: _tmp[1],
      phone: _tmp[2],
      email: _tmp[3]
    };
  }

  handleClose(done: any) {
    this.closeDialog();
    done();
  }

  mounted() {
    this.requestWorkers();
  }

  @Emit("requestData")
  requestData() {}
}
</script>

<style scoped></style>
