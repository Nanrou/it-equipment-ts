<template>
  <el-dialog title="设备详情" :visible.sync="visible" width="520px">
    <div>
      <p>设备分类：{{ equipment.category }}</p>
      <p>
        品牌：{{ equipment.brand }}
        <el-divider direction="vertical" />
        型号：{{ equipment.modelNumber }}
      </p>
      <p>序列号：{{ equipment.serialNumber }}</p>
      <p>
        购入时间：{{ equipment.purchasingTime }}
        <el-divider direction="vertical" />
        保修时长：{{ equipment.guarantee }}个月
        <el-divider direction="vertical" />
        价格：{{ equipment.price }}
      </p>
      <p>
        所属部门：{{ equipment.department }}
        <el-divider direction="vertical" />
        责任人：{{ equipment.owner }}
        <el-divider direction="vertical" />
        使用人：{{ equipment.user }}
      </p>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Equipment } from "@/store/types";

@Component
export default class EquipmentDetail extends Vue {
  visible = false;
  equipment: Equipment | {} = {};

  openDialog(equipment: Equipment) {
    this.equipment = equipment;
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.equipment = {};
  }
}
</script>

<style scoped></style>
