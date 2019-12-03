<template>
  <div>
    <el-container>
      <el-header></el-header>
      <el-main>
        <maintenance-table />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import MaintenanceTable from "@/views/Maintenance/MaintenanceTable.vue";

@Component({
  components: { MaintenanceTable }
})
export default class MaintenanceIndex extends Vue {}
</script>

<style scoped></style>
