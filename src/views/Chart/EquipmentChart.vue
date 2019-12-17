<template>
  <div>
    <el-form inline>
      <el-button>按设备分类统计</el-button>
      <el-button>按投入使用时间统计</el-button>
    </el-form>
    <el-card style="margin-top: 12px; height: 600px">
      <div id="equipment-chart"></div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import G2 from "@antv/g2";
import DataSet from "@antv/data-set";

@Component
export default class EquipmentChart extends Vue {
  chart: G2.Chart;
  sourceData = [
    {
      value: 251,
      type: "爆管",
      name: "水泥管"
    },
    {
      value: 1048,
      type: "爆管",
      name: "钢管"
    },
    {
      value: 610,
      type: "二次供水",
      name: "海水倒灌"
    },
    {
      value: 434,
      type: "二次供水",
      name: "停电"
    },
    {
      value: 335,
      type: "设施受损",
      name: "办公环境损坏"
    },
    {
      value: 250,
      type: "设施受损",
      name: "设备故障"
    }
  ];

  draw(data: any) {
    let chart = new G2.Chart({
      container: "equipment-chart",
      forceFit: true,
      padding: 0,
      height: 560
    });
    let dv = new DataSet.DataView();
    dv.source(data).transform({
      type: "percent",
      field: "value",
      dimension: "type",
      as: "percent"
    });
    // 内圈
    chart.source(dv, {
      percent: {
        formatter: function formatter(val: number) {
          return (val * 100).toFixed(2) + "%";
        }
      }
    });
    chart.coord("theta", {
      radius: 0.5
    });
    chart.tooltip({
      showTitle: false
    });
    chart.legend(false);
    chart
      .intervalStack()
      .position("percent")
      .color("type")
      .label("type", {
        offset: -10
      })
      .tooltip("name*percent", function(item: string, percent: any) {
        return {
          name: item,
          value: (percent * 100).toFixed(2) + "%"
        };
      })
      .select(false)
      .style({
        lineWidth: 1,
        stroke: "#fff"
      });
    // 外圈
    let outterView = chart.view();
    let dv1 = new DataSet.DataView();
    dv1.source(data).transform({
      type: "percent",
      field: "value",
      dimension: "name",
      as: "percent"
    });
    outterView.source(dv1, {
      percent: {
        formatter: function formatter(val: number) {
          return (val * 100).toFixed(2) + "%";
        }
      }
    });
    outterView.coord("theta", {
      innerRadius: 0.5 / 0.75,
      radius: 0.75
    });
    outterView
      .intervalStack()
      .position("percent")
      .color("name", [
        "#BAE7FF",
        "#7FC9FE",
        "#71E3E3",
        "#ABF5F5",
        "#8EE0A1",
        "#BAF5C4"
      ])
      .label("name")
      .tooltip("name*percent", function(item: string, percent: any) {
        percent = (percent * 100).toFixed(2) + "%";
        return {
          name: item,
          value: percent
        };
      })
      .style({
        lineWidth: 1,
        stroke: "#fff"
      });
    this.chart = chart;
    this.chart.render();
  }

  mounted() {
    this.draw(this.sourceData);
  }
}
</script>

<style scoped></style>
