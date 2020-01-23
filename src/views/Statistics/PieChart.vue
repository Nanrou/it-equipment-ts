<template>
  <div id="pieChart"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import G2 from "@antv/g2";
import DataSet from "@antv/data-set";

@Component
export default class PieChart extends Vue {
  @Prop(String) type: "category" | "department";
  @Prop(Array) sourceData: [];
  chart: G2.Chart;
  firstDraw = true;

  draw() {
    let data = this.sourceData;
    let chart = new G2.Chart({
      // container: `${this.type}-chart`,
      container: "pieChart",
      forceFit: true,
      padding: 0,
      height: 560
    });
    let dv = new DataSet.View().source(data);
    dv.transform({
      type: "map",
      callback(row: any) {
        row.type = row.name;
        return row;
      }
    });
    dv.transform({
      type: "map",
      callback(row: any) {
        row.nv = row.name + " " + row.value;
        return row;
      }
    });
    dv.transform({
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
      .tooltip("nv*percent", function(item: string, percent: any) {
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
    let outerView = chart.view();
    let dv1 = new DataSet.View().source(data);
    dv1.transform({
      type: "percent",
      field: "value",
      dimension: "name",
      as: "percent"
    });
    dv1.transform({
      type: "map",
      callback(row: any) {
        row.nv = row.name + " " + row.value;
        return row;
      }
    });
    outerView.source(dv1, {
      percent: {
        formatter: function formatter(val: number) {
          return (val * 100).toFixed(2) + "%";
        }
      }
    });
    outerView.coord("theta", {
      innerRadius: 0.5 / 0.75,
      radius: 0.75
    });
    outerView
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
      .tooltip("nv*percent", function(item: string, percent: any) {
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
    this.firstDraw = false;
  }

  repaint() {
    console.log("repaint");
    this.chart.repaint();
  }
  clear() {
    console.log("clear");
    this.chart.clear();
  }
  destroy() {
    if (!this.firstDraw) {
      this.chart.destroy();
    }
  }

  // todo changeData
}
</script>

<style scoped></style>
