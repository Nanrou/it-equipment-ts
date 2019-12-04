<template>
  <div>
    <el-container>
      <el-header height="120px">
        <el-button type="primary" @click="openDialog">新增设备</el-button>
        <table-filter-form
          :tableType="'maintenance'"
          v-on:getFilterParam="getFilterParam"
          v-on:handleFilterRequest="handleFilterRequest"
          class="filter-form"
        />
      </el-header>
      <el-main>
        <equipment-table
          :table-data="tableData"
          :table-loading="tableLoading"
          :current-page="currentPage"
          :page-size="pageSize"
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
    <el-dialog
      title="新增设备"
      :visible.sync="visible"
      :destroy-on-close="true"
      :before-close="closeDialogCheck"
      width="520px"
    >
      <equipment-form
        :action="'add'"
        ref="equipmentForm"
        style="padding-left: 12px"
        v-on:close="closeDialog"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import EquipmentTable from "@/views/Equipment/EquipmentTable.vue";
import EquipmentForm from "@/views/Equipment/EquipmentForm.vue";
import TableFilterForm from "@/components/TableFilterForm.vue";
import { Equipment } from "@/store/types";
import { EQUIPMENT_QUERY_API } from "@/store/api";
import { AxiosResponse } from "axios";

@Component({
  components: {
    EquipmentTable,
    EquipmentForm,
    TableFilterForm
  }
})
export default class EquipmentIndex extends Vue {
  @Ref() readonly equipmentForm: EquipmentForm;

  visible = false;
  filterParam = "";

  pageSize = 10;
  currentPage = 1;
  totalPage = 1;

  tableData: Equipment[] = [];
  tableLoading = false;

  openDialog() {
    this.visible = true;
  }

  closeDialogCheck(done: any) {
    //@ts-ignore
    if (this.equipmentForm.confirmCheck()) {
      this.$confirm("内容已发生改变，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    } else {
      done();
    }
  }

  closeDialog() {
    this.visible = false;
  }

  requestData() {
    this.tableLoading = true;
    // 手动拼接url
    let _url =
      EQUIPMENT_QUERY_API +
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
        this.tableLoading = false;
      });
  }

  // 把table内容给到组件，翻页在父节点做
  handleChangePage() {
    this.requestData();
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
}
.filter-form {
  margin-top: 12px;
}
</style>
