<template>
  <div>
    <el-form inline>
      <el-button @click="handleStatistics('category')"
        >按设备分类统计</el-button
      >
      <el-button @click="handleStatistics('department')"
        >按使用部门统计</el-button
      >
      <el-button>按投入使用时间统计</el-button>
      <el-button @click="pieChart.clear()">clear</el-button>
      <el-button @click="pieChart.repaint()">repaint</el-button>
      <el-button @click="pieChart.destroy()">destroy</el-button>
    </el-form>
    <el-card
      v-loading="loadingAtRequest"
      style="margin-top: 12px; height: 600px"
    >
      <template v-if="currentType === ''">
        <div>
          <i class="el-icon-top"></i>请先选择统计类别<i class="el-icon-top"></i>
        </div>
      </template>
      <template v-else-if="currentType === 'purchasingTime'"></template>
      <template v-else>
        <PieChart
          ref="pieChart"
          :type="currentType"
          :source-data="sourceData"
        ></PieChart>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import PieChart from "@/views/Statistics/PieChart.vue";
import {
  STATISTICS_DEPARTMENT_API,
  STATISTICS_EQUIPMENT_API
} from "@/store/api";

@Component({
  components: { PieChart }
})
export default class Chart extends Vue {
  @Ref() readonly pieChart: PieChart;
  loadingAtRequest = false;
  currentType: "" | "category" | "department" | "purchasingTime" = "";
  sourceData = [];

  handleStatistics(type: "category" | "department" | "purchasingTime") {
    this.loadingAtRequest = true;
    let _api: string = "";
    switch (type) {
      case "category":
        _api = STATISTICS_EQUIPMENT_API;
        break;
      case "department":
        _api = STATISTICS_DEPARTMENT_API;
        break;
    }
    this.$axios
      .get(_api)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.sourceData = data.sourceData;
          this.currentType = type;
          let doubleCircle = data.doubleCircle as boolean;
          setTimeout(() => {
            // @ts-ignore
            this.pieChart.destroy(); // 手动删除再draw
            // @ts-ignore
            this.pieChart.draw(doubleCircle);
          }, 0);
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequest = false;
      });
  }
}
</script>

<style scoped></style>
