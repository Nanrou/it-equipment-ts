<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      v-loading="tableLoading"
      row-key="oid"
      style="max-width: 800px"
      @row-click="handlePatrolDetail"
    >
      <el-table-column
        type="index"
        min-width="40"
        :index="indexMethod"
      ></el-table-column>
      <el-table-column label="工单编号" prop="patrolId"> </el-table-column>
      <el-table-column label="负责人" prop="name"> </el-table-column>
      <el-table-column label="设备总数" prop="total"> </el-table-column>
      <el-table-column label="计划进度" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0">进行中</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success"
            >已完成</el-tag
          >
          <el-tag v-else-if="scope.row.status === 2" type="info">已取消</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <patrol-detail ref="patrolDetail" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from "vue-property-decorator";
import { MaintenancePatrol } from "@/store/types";
import PatrolDetail from "@/views/Maintenance/Patrol/PatrolDetail.vue";

@Component({
  components: { PatrolDetail }
})
export default class PatrolTable extends Vue {
  @Prop() currentPage: number;
  @Prop() pageSize: number;
  @Prop() tableData: MaintenancePatrol[];
  @Prop() tableLoading: boolean;
  @Ref("patrolDetail") readonly patrolDetail: PatrolDetail;

  indexMethod(index: number) {
    return index + (this.currentPage - 1) * this.pageSize + 1;
  }

  @Emit("requestData")
  requestData() {}

  handlePatrolDetail(row: MaintenancePatrol) {
    this.patrolDetail.openDialog(row.pid);
  }
}
</script>

<style scoped></style>