<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      v-loading="tableLoading"
      row-key="oid"
      style="max-width: 800px"
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
      <el-table-column label="操作" min-width="100px">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-tickets"
            style="font-size: 18px"
            @click="handlePatrolDetail(scope.row)"
          ></el-button>
          <el-button
            type="text"
            icon="el-icon-message"
            style="font-size: 18px"
            @click="openEmailDialog(scope.row)"
          ></el-button>
          <el-button
            type="text"
            icon="el-icon-close"
            style="font-size: 18px; color: #F56C6C"
            @click="deletePatrolPlane(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <patrol-detail ref="patrolDetail" />
    <email-dialog ref="emailDialog" :email-type="'patrol'" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from "vue-property-decorator";
import { MaintenancePatrol } from "@/store/types";
import PatrolDetail from "@/views/Maintenance/Patrol/PatrolDetail.vue";
import EmailDialog from "@/components/EmailDialog.vue";
import { MAINTENANCE_DELETE_PATROL_API } from "@/store/api";
import { AxiosResponse } from "axios";

@Component({
  components: { PatrolDetail, EmailDialog }
})
export default class PatrolTable extends Vue {
  @Prop() currentPage: number;
  @Prop() pageSize: number;
  @Prop() tableData: MaintenancePatrol[];
  @Prop() tableLoading: boolean;
  @Ref("patrolDetail") readonly patrolDetail: PatrolDetail;
  @Ref("emailDialog") emailLoadingIns: EmailDialog;

  indexMethod(index: number) {
    return index + (this.currentPage - 1) * this.pageSize + 1;
  }

  @Emit("requestData")
  requestData() {}

  handlePatrolDetail(row: MaintenancePatrol) {
    //@ts-ignore
    this.patrolDetail.openDialog(row.pid);
  }

  openEmailDialog(row: MaintenancePatrol) {
    //@ts-ignore
    this.emailLoadingIns.openEmailDialog(row.patrolId);
  }

  deletePatrolPlane(row: MaintenancePatrol) {
    // todo permission
    this.$msgbox({
      title: "注意",
      type: "warning",
      message: "此操作将删除该计划, 是否继续?",
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = "执行中...";
          this.$axios
            .delete(MAINTENANCE_DELETE_PATROL_API + `?pid=${row.pid}`)
            .then((response: AxiosResponse) => {
              let { errcode, errmsg } = response.data;
              if (errcode === 0) {
                this.requestData();
              } else {
                this.$message.error(errmsg);
              }
            })
            .finally(() => {
              done();
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = "确定";
            });
        } else {
          done();
        }
      }
    })
      .then(() => {
        this.$message.success("删除成功");
      })
      .catch(() => {});
  }
}
</script>

<style scoped></style>
