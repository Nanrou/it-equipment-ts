<template>
  <div id="pieChart"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import G2 from "@antv/g2";
import DataSet from "@antv/data-set";

@Component
export default class PieChart extends Vue {
  @Prop(String) type: "category" | "department" | "purchasingTime";
  @Prop(Array) sourceData: [];
  chart: G2.Chart;
  firstDraw = true;

  draw(doubleCircle: boolean) {
    // 堆叠饼图对数据顺序有要求，要手动排序，不然内外圈对不上
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
      type: "sort-by",
      fields: ["ancestor"]
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
      dimension: doubleCircle ? "ancestor" : "name",
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
      showTitle: false,
      itemTpl:
        '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    chart.legend(false);

    if (doubleCircle) {
      chart
        .intervalStack()
        .position("percent")
        .color("ancestor")
        .label("ancestor", {
          offset: -10
        })
        .tooltip("name*value*percent", function(
          item: string,
          value_: string,
          percent: any
        ) {
          return {
            name: item,
            value: `${value_}(${(percent * 100).toFixed(2)}%)`
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
        type: "sort-by",
        fields: ["ancestor"]
      });
      dv1.transform({
        type: "percent",
        field: "value",
        dimension: "name",
        as: "percent"
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
        .tooltip("name*value*percent", function(
          item: string,
          value_: string,
          percent: any
        ) {
          return {
            name: item,
            value: `${value_}(${(percent * 100).toFixed(2)}%)`
          };
        })
        .style({
          lineWidth: 1,
          stroke: "#fff"
        });
    } else {
      chart
        .intervalStack()
        .position("percent")
        .color("name")
        .label("name")
        .tooltip("name*value*percent", function(
          item: string,
          value_: string,
          percent: any
        ) {
          return {
            name: item,
            value: `${value_}(${(percent * 100).toFixed(2)}%)`
          };
        })
        .select(false)
        .style({
          lineWidth: 1,
          stroke: "#fff"
        });
    }
    this.chart = chart;
    this.chart.render();
    this.firstDraw = false;
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
