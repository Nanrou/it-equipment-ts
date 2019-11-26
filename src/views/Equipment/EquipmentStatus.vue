<template>
  <el-dialog
    title="修改状态"
    :visible.sync="visible"
    :destroy-on-close="true"
    :before-close="closeDialogCheck"
    width="520px"
  >
    <el-select
      placeholder="请选择"
      :value="statusForm.status"
      v-model="statusForm.status"
    >
      <el-option
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.value === originStatus"
      ></el-option>
    </el-select>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class EquipmentStatus extends Vue {
  visible = false;
  originStatus: number = 0;
  statusForm = {
    eid: "",
    status: 0,
    user: "",
    owner: "",
    department: ""
  };
  statusOptions = [
    { label: "正常", value: 0 },
    { label: "备用", value: 2 },
    { label: "报废", value: 3 }
  ];

  openDialog(
    eid: any,
    status: number,
    user: string,
    owner: string,
    department: string
  ) {
    this.originStatus = status;
    this.statusForm.status = status;
    this.statusForm.eid = eid;
    this.statusForm.user = user;
    this.statusForm.owner = owner;
    this.statusForm.department = department;
    this.visible = true;
  }

  closeDialogCheck(done: any) {
    if (this.equipmentFormCompliance) {
      done();
    } else {
      this.$confirm("内容已发生改变，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }

  get equipmentFormCompliance(): boolean {
    return this.statusForm.status === this.originStatus;
  }
}
</script>

<style scoped></style>
