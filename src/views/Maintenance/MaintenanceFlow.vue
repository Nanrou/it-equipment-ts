<template>
  <el-popover
    placement="left"
    @show="requestData"
    width="350"
    trigger="click"
    v-loading="loadingAtRequest"
  >
    <template v-if="flow">
      <div :style="{ height: flow.length * 90 + 'px' }">
        <el-steps
          direction="vertical"
          :active="flow.length"
          finish-status="success"
        >
          <el-step
            v-for="item of flow"
            :key="oid + '-' + item.status"
            :title="formatStatus(item.status)"
            :description="item.content"
          >
          </el-step>
          <el-step
            v-if="flow.length > 0 && flow[flow.length - 1].status !== 'F'"
            :title="formatNextStep(flow[flow.length - 1].status)"
          ></el-step>
        </el-steps>
      </div>
    </template>
    <template v-else>怎么就找不到了呢 &nbsp; (╯￣Д￣)╯╘═╛</template>
    <el-button
      slot="reference"
      type="text"
      icon="el-icon-tickets"
      style="font-size: 18px"
    ></el-button>
  </el-popover>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { MAINTENANCE_FLOW_API } from "@/store/api";
import { MaintenanceFlowType } from "@/store/types";

@Component
export default class MaintenanceFlow extends Vue {
  @Prop() oid: string;

  loadingAtRequest = false;
  flow: MaintenanceFlowType[] = [];

  requestData() {
    this.loadingAtRequest = true;
    this.$axios
      .get(MAINTENANCE_FLOW_API + `?oid=${this.oid}`)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.flow = data;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequest = false;
      });
  }

  formatStatus(status: string) {
    switch (status) {
      case "R":
        return "上报";
      case "D":
        return "派工";
      case "H":
        return "到达现场";
      case "E":
        return "维修完成";
      case "F":
        return "完结";
    }
  }

  formatNextStep(status: string) {
    switch (status) {
      case "R":
        return "待接单";
      case "D":
        return "正在赶往现场";
      case "H":
        return "正在维护";
      case "E":
        return "待评价";
      case "F":
        return "完结";
    }
  }
}
</script>

<style scoped>
.el-step__description {
  font-size: 14px;
}
</style>
