<template>
  <el-drawer
    title="更新设备"
    :visible.sync="visible"
    :before-close="closeDrawerCheck"
    :destroy-on-close="true"
  >
    <equipment-form
      ref="equipmentFormComponent"
      :action="'update'"
      :origin-equipment-form="equipmentForm"
    />
  </el-drawer>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { Equipment } from "@/store/types";
import EquipmentForm from "@/views/Equipment/EquipmentForm.vue";

@Component({
  components: { EquipmentForm }
})
export default class EquipmentDrawer extends Vue {
  @Ref() readonly equipmentFormComponent: EquipmentForm;

  visible = false;
  equipmentForm: Equipment | {} = {};

  openDrawer(e: Equipment) {
    this.equipmentForm = e;
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

  closeDrawer() {}
}
</script>

<style scoped></style>
