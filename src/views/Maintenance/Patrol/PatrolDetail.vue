<template>
  <el-dialog
    title="巡检详情"
    v-loading="tableLoading"
    :visible.sync="dialogVisible"
    top="5vh"
  >
    <el-form inline>
      <el-form-item label="只看未完成的">
        <el-switch></el-switch>
      </el-form-item>
    </el-form>
    <el-table :data="currentTableData">
      <el-table-column
        type="index"
        min-width="40"
        :index="indexMethod"
      ></el-table-column>
      <el-table-column label="所属部门" prop="department"></el-table-column>
      <el-table-column
        label="设备分类"
        prop="category"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="巡检状态" prop="check">
        <template slot-scope="scope">
          <template v-if="scope.row.check === 0">
            <el-tag disable-transitions>待巡检</el-tag>
          </template>
          <template v-else>
            <el-tag disable-transitions type="success">已巡检</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="巡检时间" prop="checkTime">
        <template slot-scope="scope">
          {{ scope.row.check === 1 ? scope.row.checkTime : "尚未巡检" }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-block">
      <el-pagination
        @current-change="handleChangePage"
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-count="totalPage"
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { MAINTENANCE_PATROL_DETAIL_API } from "@/store/api";
import { AxiosResponse } from "axios";
import { Equipment } from "@/store/types";

@Component
export default class PatrolDetail extends Vue {
  lastPatrolId: string = "";

  dialogVisible = false;

  pageSize = 10;
  currentPage = 1;
  totalPage = 1;
  tableData: Equipment[] = [];
  currentTableData: Equipment[] = [];
  tableLoading = false;

  resetTable(data: any) {
    // reset所有相关属性
    this.currentPage = 1;
    this.totalPage = Math.ceil(data.length / this.pageSize);
    this.currentTableData = data.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
    this.tableData = data;
  }

  openDialog(pid: string) {
    this.dialogVisible = true;
    this.tableLoading = true;
    if (pid !== this.lastPatrolId) {
      this.$axios
        .get(MAINTENANCE_PATROL_DETAIL_API + `?pid=${pid}`)
        .then((response: AxiosResponse) => {
          let { errcode, errmsg, data } = response.data;
          if (errcode === 0) {
            this.resetTable(data);
            this.lastPatrolId = pid;
          } else {
            this.$message.error(errmsg);
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    } else {
      this.resetTable(this.tableData);
      this.tableLoading = false;
    }
  }
  closeDialog() {}

  indexMethod(index: number) {
    return index + (this.currentPage - 1) * this.pageSize + 1;
  }

  handleChangePage() {
    this.currentTableData = this.tableData.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }
}
</script>

<style scoped>
.pagination-block {
  text-align: center;
  margin-top: 8px;
}
</style>
