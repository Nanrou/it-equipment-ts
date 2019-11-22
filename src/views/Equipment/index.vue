<template>
  <div>
    <el-container>
      <el-header>
        <el-button type="primary" @click="openDialog">新增设备</el-button>
      </el-header>
      <el-main>
        <equipment-table />
      </el-main>
    </el-container>
    <el-dialog
      title="新增设备"
      :visible.sync="visible"
      :destroy-on-close="true"
      :before-close="closeDialogCheck"
      width="520px"
    >
      <equipment-form
        :action="'add'"
        ref="equipmentForm"
        style="padding-left: 12px"
        v-on:close="closeDialog"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import EquipmentTable from "@/views/Equipment/EquipmentTable.vue";
import EquipmentForm from "@/views/Equipment/EquipmentForm.vue";

@Component({
  components: {
    EquipmentTable,
    EquipmentForm
  }
})
export default class EquipmentIndex extends Vue {
  @Ref() readonly equipmentForm: EquipmentForm;

  visible = false;

  openDialog() {
    this.visible = true;
  }

  closeDialogCheck(done: any) {
    //@ts-ignore
    if (this.equipmentForm.confirmCheck()) {
      this.$confirm("内容已发生改变，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    } else {
      done();
    }
  }

  closeDialog() {
    this.visible = false;
  }
}
</script>

<style scoped></style>
