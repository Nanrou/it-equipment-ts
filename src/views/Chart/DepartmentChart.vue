<template>
  <div>
    <el-form inline>
      <el-button>按设备分类统计</el-button>
      <el-button>按投入使用时间统计</el-button>
    </el-form>
    <el-card style="margin-top: 12px; height: 600px">
      <div id="department-chart"></div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import G2 from "@antv/g2";

@Component
export default class DepartmentChart extends Vue {}
</script>

<style scoped></style>
