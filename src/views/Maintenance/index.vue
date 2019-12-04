<template>
  <div>
    <el-container>
      <el-header v-loading="loadingAtRequestOptions">
        <el-form inline ref="filterForm">
          <el-form-item>
            <el-select
              :value="filterForm.department"
              v-model="filterForm.department"
              multiple
              placeholder="请选择所属部门"
            >
              <el-option
                v-for="item in departmentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              :value="filterForm.equipment"
              v-model="filterForm.equipment"
              multiple
              placeholder="请选择设备分类"
            >
              <el-option
                v-for="item in equipmentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              :value="filterForm.status"
              v-model="filterForm.status"
              multiple
              placeholder="请选择工单状态"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :disabled="!filterEnable"
              @click="handleFilterRequest"
              >查询</el-button
            >
            <el-button @click="resetFilterForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <maintenance-table
          :current-page="currentPage"
          :page-size="pageSize"
          :table-data="tableData"
          :table-loading="tableLoading"
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
import MaintenanceTable from "@/views/Maintenance/MaintenanceTable.vue";
import { FormOptions, MaintenanceOrder } from "@/store/types";
import { MaintenanceStatusOptions } from "@/store/constTypes";
import {
  MAINTENANCE_FILTER_OPTIONS_API,
  MAINTENANCE_QUERY_API
} from "@/store/api";
import { AxiosResponse } from "axios";
// import { ElForm } from "element-ui/types/form";

@Component({
  components: { MaintenanceTable }
})
export default class MaintenanceIndex extends Vue {
  // @Ref("filterForm") filterFormIns: ElForm; // 默认值为array，resetFields无效

  loadingAtRequestOptions = false;
  filterForm = {
    department: [],
    equipment: [],
    status: []
  };

  departmentOptions: FormOptions[] = [];
  equipmentOptions: FormOptions[] = [];
  statusOptions = MaintenanceStatusOptions;

  pageSize = 10;
  currentPage = 1;
  totalPage = 1;

  tableData: MaintenanceOrder[] = [];
  tableLoading = false;

  requestOptions() {
    this.loadingAtRequestOptions = true;
    this.$axios
      .get(MAINTENANCE_FILTER_OPTIONS_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.departmentOptions = data.department;
          this.equipmentOptions = data.equipment;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequestOptions = false;
      });
  }

  // 把table内容给到组件，翻页在父节点做
  handleChangePage() {
    this.requestData();
  }

  requestData() {
    this.tableLoading = true;
    let _url = MAINTENANCE_QUERY_API + `?page=${this.currentPage.toString()}`;
    // 手动拼接url
    if (this.filterEnable) {
      for (let key in this.filterForm) {
        //@ts-ignore
        if (this.filterForm[key].length > 0) {
          //@ts-ignore
          _url += `&${key}=${this.filterForm[key].join(",")}`;
        }
      }
    }
    this.$axios
      .get(_url)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.tableData = data.tableData;
          if (data.totalPage) {
            // 当缓存版本不变时，总页数不会变。这是在服务端判断的
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

  resetFilterForm() {
    this.filterForm = {
      department: [],
      equipment: [],
      status: []
    };
    this.handleFilterRequest();
  }

  get filterEnable(): boolean {
    // 有过滤项为true
    return Object.values(this.filterForm).some(ele => ele.length > 0);
  }

  mounted() {
    this.requestOptions();
    this.requestData();
  }
}
</script>

<style scoped>
.pagination-block {
  text-align: center;
  margin-top: 8px;
}
</style>
