<template>
  <el-dialog
    title="设备详情"
    :visible.sync="visible"
    width="520px"
    :destroy-on-close="true"
  >
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
    <template v-if="equipment.category === '台式电脑'">
      <el-divider />
      <template v-loading="loading" element-loading-text="正常查找硬件设备..">
        <p>IP地址：{{ hardware.ip || "无记录" }}</p>
        <p>
          CPU：{{ hardware.cpu || "无记录" }}
          <el-divider direction="vertical" />
          显卡：{{ hardware.gpu || "无记录" }}
        </p>
        <p>
          主板：{{ hardware.mainBoard || "无记录" }}
          <el-divider direction="vertical" />
          内存：{{ hardware.memory || "无记录" }}
        </p>
        <p>硬盘：{{ hardware.disk || "无记录" }}</p>
        <p>备注：{{ hardware.remark || "无" }}</p>
      </template>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Equipment, Hardware } from "@/store/types";
import { EQUIPMENT_HARDWARE_API } from "@/store/api";
import { AxiosResponse } from "axios";

@Component
export default class EquipmentDetail extends Vue {
  visible = false;
  loading = false;
  equipment: Equipment | {} = {};
  hardware: Hardware = {
    cpu: "",
    disk: "",
    gpu: "",
    ip: "",
    mainBoard: "",
    memory: "",
    remark: ""
  };

  openDialog(equipment: Equipment) {
    this.equipment = equipment;
    this.visible = true;
    if (equipment.category === "台式电脑") {
      this.loading = true;
      this.$axios
        .get(EQUIPMENT_HARDWARE_API + `?eid=${equipment.eid}`)
        .then((response: AxiosResponse) => {
          let { errcode, errmsg, data } = response.data;
          if (errcode === 0) {
            this.hardware = { ...data };
          } else if (errcode === 100006) {
            this.$message.warning(errmsg);
          } else {
            this.$message.error(errmsg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  closeDialog() {
    this.visible = false;
    this.equipment = {};
  }
}
</script>

<style scoped></style>
