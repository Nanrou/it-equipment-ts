<template>
  <div>
    <el-container>
      <el-header>
        <el-button>新增设备</el-button>
      </el-header>
      <el-main>
        <equipment-table />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import EquipmentTable from "@/views/Equipment/EquipmentTable.vue";
@Component({
  components: {
    EquipmentTable
  }
})
export default class Equipment extends Vue {}
</script>
