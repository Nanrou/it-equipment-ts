<template>
  <div>
    <div style="width: 95%;max-width: 800px">
      <span style="float: right">
        <el-button
          style="font-size: 18px"
          type="text"
          icon="el-icon-refresh"
          :loading="tableLoading"
          @click="requestData"
        ></el-button>
      </span>
    </div>
    <el-table
      :data="tableData"
      stripe
      v-loading="tableLoading"
      row-key="oid"
      style="max-width: 800px"
    >
      <el-table-column
        type="index"
        width="40"
        :index="indexMethod"
      ></el-table-column>
      <el-table-column label="工单编号" prop="orderId" width="120">
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
            <el-tag disable-transitions :color="'#00A3BB'" style="color: #fff"
              >处理中</el-tag
            >
          </template>
          <template v-else-if="scope.row.status === 'E'">
            <el-tag disable-transitions :color="'#78c0bd'" style="color: #fff"
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
      <el-table-column label="操作" min-width="120px">
        <template slot-scope="scope">
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
          <el-tooltip content="工单进度" placement="top">
            <maintenance-flow :oid="scope.row.oid" style="margin-left: 8px" />
          </el-tooltip>
          <template v-if="scope.row.status !== 'R'">
            <el-tooltip content="邮件详情" placement="top">
              <el-button
                type="text"
                icon="el-icon-message"
                style="font-size: 18px; margin-left: 4px"
                @click="openEmailDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <maintenance-handle-receive
      ref="handleReceive"
      v-on:requestData="requestData"
    />
    <email-dialog ref="emailDialog" :email-type="'maintenance'" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop, Emit } from "vue-property-decorator";
import { MaintenanceOrder } from "@/store/types";
import MaintenanceFlow from "@/views/Maintenance/Order/MaintenanceFlow.vue";
import MaintenanceHandleReceive from "@/views/Maintenance/Order/MaintenanceHandleReceive.vue";
import EmailDialog from "@/components/EmailDialog.vue";

@Component({
  components: { MaintenanceFlow, MaintenanceHandleReceive, EmailDialog }
})
export default class MaintenanceTable extends Vue {
  @Ref("handleReceive") handleReceiveIns: MaintenanceHandleReceive;
  @Ref("emailDialog") emailLoadingIns: EmailDialog;
  @Prop() currentPage: number;
  @Prop() pageSize: number;
  @Prop() tableData: MaintenanceOrder[];
  @Prop() tableLoading: boolean;

  openHandleReceiveDialog(row: MaintenanceOrder) {
    //@ts-ignore
    this.handleReceiveIns.openDialog(row.oid, row.orderId, row.eid);
  }

  indexMethod(index: number) {
    return index + (this.currentPage - 1) * this.pageSize + 1;
  }

  @Emit("requestData")
  requestData() {}

  openEmailDialog(row: MaintenanceOrder) {
    //@ts-ignore
    this.emailLoadingIns.openEmailDialog(row.orderId);
  }
}
</script>

<style scoped></style>
