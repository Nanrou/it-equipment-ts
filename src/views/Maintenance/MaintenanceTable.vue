<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      v-loading="tableLoading"
      row-key="oid"
      style="max-width: 800px"
    >
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column label="工单编号" prop="oid" width="120">
      </el-table-column>
      <el-table-column label="设备分类" prop="equipment" width="110">
      </el-table-column>
      <el-table-column label="故障原因" prop="reason"></el-table-column>
      <el-table-column label="所属部门" prop="department"></el-table-column>
      <el-table-column label="工单状态" prop="status">
        <template slot-scope="scope">
          <template v-if="scope.row.status === 'R'">
            <el-tag disable-transitions type="warning">待接单</el-tag>
          </template>
          <template v-else-if="scope.row.status === 'D'">
            <el-tag disable-transitions type="">已指派</el-tag>
          </template>
          <template v-else-if="scope.row.status === 'H'">
            <el-tag disable-transitions color="#0ee0ff">正在处理</el-tag>
          </template>
          <template v-else-if="scope.row.status === 'E'">
            <el-tag disable-transitions color="#14c010" style="color: #fff"
              >待评价</el-tag
            >
          </template>
          <template v-else-if="scope.row.status === 'F'">
            <el-tag disable-transitions type="success">已完结</el-tag>
          </template>
          <template v-else>
            <el-tag disable-transitions type="info">已取消</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <maintenance-flow :oid="scope.row.oid" style="margin-right: 8px" />
          <el-button
            v-if="scope.row.status === 'R'"
            type="text"
            style="margin-right: 8px"
            @click="openHandleReceiveDialog(scope.row)"
            >接单</el-button
          >
          <template v-else-if="scope.row.status === 'D'">
            <el-tooltip content="请扫描操作" placement="top">
              <el-button type="text" style="margin-right: 8px" :disabled="true"
                >到达现场</el-button
              >
            </el-tooltip>
          </template>
          <template v-else-if="scope.row.status === 'H'">
            <el-tooltip content="请扫描操作" placement="top">
              <!-- todo PC端的完工确认 -->
              <el-button type="text" style="margin-right: 8px" :disabled="true"
                >维护完成</el-button
              >
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <maintenance-handle-receive ref="handleReceive" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { MaintenanceOrder } from "@/store/types";
import { MAINTENANCE_QUERY_API } from "@/store/api";
import { AxiosResponse } from "axios";
import { LOCAL_MAINTENANCE } from "@/store/constTypes";
import MaintenanceFlow from "@/views/Maintenance/MaintenanceFlow.vue";
import MaintenanceHandleReceive from "@/views/Maintenance/MaintenanceHandleReceive.vue";

@Component({
  components: { MaintenanceFlow, MaintenanceHandleReceive }
})
export default class MaintenanceTable extends Vue {
  @Ref("handleReceive") handleReceiveIns: MaintenanceHandleReceive;

  tableLoading = false;
  tableData: MaintenanceOrder[] = [];

  requestData(page: number = -1) {
    this.tableLoading = true;
    this.$axios
      .get(MAINTENANCE_QUERY_API + (page > 0 ? `page=${page.toString()}` : ""))
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.tableData = data;
          window.localStorage.setItem(LOCAL_MAINTENANCE, JSON.stringify(data));
        } else {
          this.$message.error(errmsg);
        }
      })
      .catch(() => {
        // todo pagination 分页
        this.tableData = JSON.parse(
          window.localStorage.getItem(LOCAL_MAINTENANCE) || "[]"
        );
      })
      .finally(() => {
        this.tableLoading = false;
      });
  }

  openHandleReceiveDialog(row: MaintenanceOrder) {
    this.handleReceiveIns.openDialog(row.oid);
  }

  mounted() {
    this.requestData();
  }
}
</script>

<style scoped></style>
