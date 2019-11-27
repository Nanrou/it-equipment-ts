<template>
  <el-dialog
    title="硬件配置信息"
    :append-to-body="true"
    :destroy-on-close="true"
    :before-close="closeDialogCheck"
    :visible.sync="visible"
    width="420px"
    ref="dialogIns"
  >
    <el-form
      v-loading="loadingAtRequest"
      :model="hardwareForm"
      ref="hardwareForm"
      label-width="80px"
    >
      <el-form-item label="IP地址" prop="ip">
        <el-input
          v-model="hardwareForm.ip"
          placeholder="请填写iPv4的地址"
          :maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item label="CPU" prop="cpu">
        <el-input
          v-model="hardwareForm.cpu"
          placeholder="请填写CPU的型号"
          :maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item label="显卡" prop="gpu">
        <el-input
          v-model="hardwareForm.gpu"
          placeholder="请填写显卡的型号"
          :maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item label="主板" prop="mainBoard">
        <el-input
          v-model="hardwareForm.mainBoard"
          placeholder="请填写主板型号"
          :maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item label="内存" prop="memory">
        <el-input
          v-model="hardwareForm.memory"
          placeholder="请填写内存型号及大小"
          :maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item label="硬盘" prop="disk">
        <el-input
          v-model="hardwareForm.disk"
          placeholder="请填写硬盘的型号及容量大小"
          :maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          :maxlength="127"
          v-model="hardwareForm.remark"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loadingAtSubmit"
          :disabled="!hardwareFormCompliance"
          >确定</el-button
        >
        <el-button style="margin-left: 8px" @click="closeDialog"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop, Emit } from "vue-property-decorator";
import { ElForm } from "element-ui/types/form";
import { Hardware } from "@/store/types";
import { EQUIPMENT_HARDWARE_API } from "@/store/api";
import { AxiosResponse } from "axios";

@Component
export default class EquipmentHardware extends Vue {
  @Prop(String) action: "update" | "add";
  @Ref("hardwareForm") hardwareFormIns: ElForm;
  @Ref("dialogIns") dialogIns: any;

  visible = false;
  loadingAtSubmit = false;
  loadingAtRequest = false;
  eid: string = "";

  hardwareForm: Hardware = {
    cpu: "",
    disk: "",
    gpu: "",
    ip: "",
    mainBoard: "",
    memory: "",
    remark: ""
  };

  originHardwareForm: Hardware = new (class implements Hardware {
    cpu: string;
    disk: string;
    gpu: string;
    ip: string;
    mainBoard: string;
    memory: string;
    remark: string;
  })();

  confirmClose() {
    if (this.action === "add") {
      return Object.values(this.hardwareForm).some(ele => Boolean(ele));
    } else {
      return this.hardwareFormCompliance;
    }
  }

  get hardwareFormCompliance(): boolean {
    if (this.action === "update") {
      return Object.keys(this.hardwareForm).some(
        //@ts-ignore 校验一致性
        key => this.hardwareForm[key] !== this.originHardwareForm[key]
      );
    }
    return true;
  }

  closeDialogCheck(done: any) {
    if (!this.confirmClose()) {
      done();
    } else {
      this.$confirm("内容已发生改变，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }

  closeDialog() {
    this.hardwareFormIns.resetFields();
    this.visible = false;
    // console.log(this.dialogIns)
    // this.dialogIns.handleClose();
  }

  openDialog(eid: any) {
    if (this.action === "update") {
      this.eid = eid;
      this.loadingAtRequest = true;
      this.$axios
        .get(EQUIPMENT_HARDWARE_API + `?eid=${eid}`)
        .then((response: AxiosResponse) => {
          let { errcode, errmsg, data } = response.data;
          if (errcode === 0) {
            this.originHardwareForm = { ...data };
            this.hardwareForm = { ...data };
          } else {
            this.$message.error(errmsg);
          }
        })
        .finally(() => {
          this.loadingAtRequest = false;
        });
    }
    this.visible = true;
  }

  handleSubmit() {
    if (this.action === "update") {
      this.loadingAtSubmit = true;
      this.$axios
        .patch(EQUIPMENT_HARDWARE_API + `?eid=${this.eid}`, this.hardwareForm)
        .then((response: AxiosResponse) => {
          let { errcode, errmsg } = response.data;
          if (errcode === 0) {
            this.$message.success("更新硬件信息成功！");
          } else {
            this.$message.error(errmsg);
          }
        })
        .finally(() => {
          this.loadingAtSubmit = false;
          this.closeDialog();
        });
    } else {
      this.handleAddHardware();
    }
  }

  @Emit("setHardware")
  handleAddHardware() {
    return this.hardwareForm;
  }
}
</script>

<style scoped></style>
