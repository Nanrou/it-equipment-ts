<template>
  <div>
    <el-container>
      <el-header height="50px">
        <patrol-create-plan v-on:requestData="requestData"></patrol-create-plan>
      </el-header>
      <el-main>
        <patrol-table
          :current-page="currentPage"
          :page-size="pageSize"
          :table-data="tableData"
          :table-loading="tableLoading"
          v-on:requestData="requestData"
        />
        <div class="pagination-block">
          <el-pagination
            @current-change="handleChangePage"
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            :page-count="totalPage"
          >
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PatrolTable from "@/views/Maintenance/Patrol/PatrolTable.vue";
import { MaintenancePatrol } from "@/store/types";
import { MAINTENANCE_PATROL_QUERY_API } from "@/store/api";
import { AxiosResponse } from "axios";
import PatrolCreatePlan from "@/views/Maintenance/Patrol/PatrolCreatePlan.vue";

@Component({
  components: { PatrolTable, PatrolCreatePlan }
})
export default class PatrolIndex extends Vue {
  pageSize = 10;
  currentPage = 1;
  totalPage = 1;

  tableData: MaintenancePatrol[] = [];
  tableLoading = false;

  requestData() {
    this.tableLoading = true;
    // 手动拼接url
    let _url =
      MAINTENANCE_PATROL_QUERY_API + `?page=${this.currentPage.toString()}`;
    this.$axios
      .get(_url)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.tableData = data.tableData;
          if (data.totalPage) {
            // 当缓存版本不变时，总页数不会变。这是在服务端判断的  过滤条件发生改变？
            this.totalPage = data.totalPage;
          }
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        // 现在是每页都去获取
        this.tableLoading = false;
      });
  }

  handleChangePage() {
    this.requestData();
  }

  mounted() {
    this.requestData();
  }
}
</script>

<style scoped>
.pagination-block {
  text-align: center;
  margin-top: 8px;
  width: 95%;
  max-width: 800px;
}
</style>
