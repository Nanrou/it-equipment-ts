<template>
  <div>
    <el-container>
      <el-header height="100px">
        <table-filter-form
          :tableType="'maintenance'"
          v-on:getFilterParam="getFilterParam"
          v-on:handleFilterRequest="handleFilterRequest"
          style="margin-top: 8px"
        />
      </el-header>
      <el-main>
        <maintenance-table
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
import MaintenanceTable from "@/views/Maintenance/Order/MaintenanceTable.vue";
import { MaintenanceOrder } from "@/store/types";
import { MAINTENANCE_QUERY_API } from "@/store/api";
import { AxiosResponse } from "axios";
// import { ElForm } from "element-ui/types/form";
import TableFilterForm from "@/components/TableFilterForm.vue";

@Component({
  components: { TableFilterForm, MaintenanceTable }
})
export default class MaintenanceIndex extends Vue {
  // @Ref("filterForm") filterFormIns: ElForm; // 默认值为array，resetFields无效

  pageSize = 10;
  currentPage = 1;
  totalPage = 1;

  tableData: MaintenanceOrder[] = [];
  tableLoading = false;
  filterParam = "";

  // 把table内容给到组件，翻页在父节点做
  handleChangePage() {
    this.requestData();
  }

  requestData() {
    this.tableLoading = true;
    // 手动拼接url
    let _url =
      MAINTENANCE_QUERY_API +
      `?page=${this.currentPage.toString()}` +
      this.filterParam;
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

  handleFilterRequest() {
    this.currentPage = 1;
    this.requestData();
  }

  getFilterParam(param: string) {
    this.filterParam = param;
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
