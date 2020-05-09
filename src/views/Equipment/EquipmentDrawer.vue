<template>
  <el-drawer
    title="更新设备"
    :visible.sync="visible"
    :before-close="closeDrawerCheck"
    :destroy-on-close="true"
  >
    <equipment-form
      v-if="showForm"
      ref="equipmentFormComponent"
      :action="'update'"
      :origin-equipment-form="equipmentForm"
      v-on:close="closeDrawer"
    />
  </el-drawer>
</template>

<script lang="ts">
import { Vue, Component, Ref, Emit } from "vue-property-decorator";
import { Equipment } from "@/store/types";
import EquipmentForm from "@/views/Equipment/EquipmentForm.vue";

@Component({
  components: { EquipmentForm }
})
export default class EquipmentDrawer extends Vue {
  @Ref() readonly equipmentFormComponent: EquipmentForm;

  visible = false;
  equipmentForm: Equipment | {} = {};
  showForm = false; // 还是子组件未销毁，导致更新后不更新

  openDrawer(e: Equipment) {
    this.equipmentForm = e;
    this.showForm = true;
    this.visible = true;
  }

  closeDrawerCheck(done: any) {
    //@ts-ignore
    if (this.equipmentFormComponent.confirmCheck()) {
      this.$confirm("内容已发生改变，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    } else {
      done();
    }
  }

  closeDrawer() {
    this.showForm = false;
    this.visible = false;
    this.requestData();
  }

  @Emit("requestData")
  requestData() {}
}
</script>

<style>
.el-drawer {
  display: inline-table;
}
</style>
