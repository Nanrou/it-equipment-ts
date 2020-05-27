<template>
  <div>
    <el-button
      type="primary"
      @click="
        () => {
          resetDialog();
          dialogVisible = true;
        }
      "
      >新建巡检计划</el-button
    >
    <el-dialog
      title="新建巡检计划"
      :visible.sync="dialogVisible"
      top="1vh"
      width="60%"
    >
      <el-form label-width="120px" inline v-loading="loadingAtRequestOptions">
        <el-form-item label="设备所属部门" style="width: 360px">
          <el-select
            :value="outputDepartment"
            v-model="outputDepartment"
            multiple
            :multiple-limit="multipleLimit"
            placeholder="请选择"
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
          <el-button
            type="primary"
            size="small"
            :loading="loadingAtPreview"
            :disabled="outputDepartment.length === 0"
            @click="requestData"
            >预览</el-button
          >
        </el-form-item>
      </el-form>
      <template v-if="tableData.length > 0">
        <div style="margin-bottom: 12px">
          <el-button size="small" @click="handleSelectAll">全选</el-button>
          <el-button size="small" @click="handleInvertSelect">反选</el-button>
          <span style="margin-left: 8px"
            >已选择设备数/当前设备总数： {{ selectedCount }}/{{
              tableData.length
            }}</span
          >
        </div>
        <el-table
          ref="equipmentTable"
          :data="currentTableData"
          stripe
          v-loading="tableLoading"
          row-key="eid"
          @select="handleTableSelection"
          @select-all="handleTableSelectionAll"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            label="设备分类"
            prop="category"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="品牌厂家" prop="brand">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                :content="scope.row.modelNumber"
                placement="top-start"
              >
                <span>{{ scope.row.brand }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="所属部门"
            prop="department"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="责任人" prop="owner">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                :content="'使用人：' + scope.row.user"
                placement="top-start"
              >
                <span>{{ scope.row.owner }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="购买时间"
            prop="purchasingTime"
          ></el-table-column>
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
        <el-row style="margin-top: 12px">
          <el-form>
            <el-form-item label="巡检人员">
              <el-select
                :value="workerID"
                v-model="workerID"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in maintenanceWorkers"
                  :key="item.pid"
                  :label="item.name"
                  :value="`${item.pid}|${item.email}`"
                  :disabled="item.email === null"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="巡检日期">
              <el-date-picker
                v-model="patrolTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </el-row>
      </template>
      <template slot="footer">
        <el-button
          v-if="tableData.length > 0"
          type="primary"
          :disabled="
            selectedCount === 0 || workerID === '' || patrolTime.length !== 2
          "
          :loading="loadingAtPublish"
          @click="handlePublish"
          >制订计划</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Emit } from "vue-property-decorator";
import {
  EQUIPMENT_FILTER_OPTIONS_API,
  EQUIPMENT_QUERY_WITHOUT_PAGINATION_API,
  MAINTENANCE_WORKER_API,
  MAINTENANCE_PATROL_CREATE_API
} from "@/store/api";
import { AxiosResponse } from "axios";
import { FormOptions, Equipment, MaintenanceWorker } from "@/store/types";
import { ElTable } from "element-ui/types/table";

@Component
export default class PatrolCreatePlan extends Vue {
  @Ref("equipmentTable") readonly equipmentTable: ElTable;

  loadingAtRequest = false;
  dialogVisible = false;
  multipleLimit = 5; // 多选的限制
  loadingAtRequestOptions: boolean = false;
  departmentOptions: FormOptions[] = [];
  outputDepartment: string[] = [];
  loadingAtPreview: boolean = false;

  pageSize = 10;
  currentPage = 1;
  totalPage = 1;
  tableData: Equipment[] = [];
  currentTableData: Equipment[] = [];
  tableLoading = false;
  selectedEquipment = new Set();
  selectedCount = 0;

  workerID: string = "";
  maintenanceWorkers: MaintenanceWorker[] = [];
  loadingAtPublish = false;
  patrolTime = [];

  requestOptions() {
    this.loadingAtRequestOptions = true;
    this.$axios
      .get(EQUIPMENT_FILTER_OPTIONS_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.departmentOptions = data.department;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequestOptions = false;
      });
  }

  handleParams() {
    let params = "?";
    for (let item of [["department", this.outputDepartment]]) {
      let k = item[0];
      let vs = item[1] as any;
      if (vs.length > 0) {
        params += `${k}=${vs.join(",")}&`;
      }
    }
    return params;
  }

  resetDialog() {
    this.outputDepartment = [];
    this.workerID = "";
    this.patrolTime = [];
    this.loadingAtPublish = false;
    this.resetTable([]);
  }

  resetTable(data: any) {
    // reset所有相关属性
    this.selectedEquipment = new Set();
    this.selectedCount = 0;
    this.currentPage = 1;
    this.totalPage = Math.ceil(data.length / this.pageSize);
    this.currentTableData = data.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
    this.tableData = data;
  }

  requestData() {
    this.loadingAtPreview = true;
    this.$axios
      .get(EQUIPMENT_QUERY_WITHOUT_PAGINATION_API + this.handleParams())
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.resetTable(data);
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtPreview = false;
      });
  }

  handleChangePage() {
    this.currentTableData = this.tableData.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
    this.handleCurrentPageSelect();
  }

  handleTableSelection(_: any, row: any) {
    if (this.selectedEquipment.has(row.eid)) {
      this.selectedEquipment.delete(row.eid);
    } else {
      this.selectedEquipment.add(row.eid);
    }
    this.selectedCount = this.selectedEquipment.size;
  }

  handleTableSelectionAll(val: any[]) {
    if (val.length > 0) {
      val.forEach(item => this.selectedEquipment.add(item.eid));
    } else {
      this.currentTableData.forEach(item =>
        this.selectedEquipment.delete(item.eid)
      );
    }
    this.selectedCount = this.selectedEquipment.size;
  }

  handleSelectAll() {
    this.tableData.forEach(item => this.selectedEquipment.add(item.eid));
    this.handleCurrentPageSelect();
    this.selectedCount = this.selectedEquipment.size;
  }

  handleInvertSelect() {
    this.tableData.forEach(item => {
      if (this.selectedEquipment.has(item.eid)) {
        this.selectedEquipment.delete(item.eid);
      } else {
        this.selectedEquipment.add(item.eid);
      }
    });
    this.handleCurrentPageSelect();
    this.selectedCount = this.selectedEquipment.size;
  }

  handleCurrentPageSelect() {
    this.$nextTick(() => {
      if (this.selectedEquipment.size > 0) {
        for (let row of this.currentTableData) {
          if (this.selectedEquipment.has(row.eid)) {
            this.equipmentTable.toggleRowSelection(row, true);
          } else {
            this.equipmentTable.toggleRowSelection(row, false);
          }
        }
      } else {
        this.equipmentTable.clearSelection();
      }
    });
  }

  requestWorkers() {
    this.loadingAtRequest = true;
    this.$axios
      .get(MAINTENANCE_WORKER_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.maintenanceWorkers = data;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequest = false;
      });
  }

  handlePublish() {
    this.loadingAtPublish = true;
    let tmp = this.workerID.split("|");
    this.$axios
      .post(MAINTENANCE_PATROL_CREATE_API, {
        pid: tmp[0],
        email: tmp[1],
        eids: Array.from(this.selectedEquipment),
        startTime: this.patrolTime[0],
        endTime: this.patrolTime[1]
      })
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          this.$message.success("巡检计划制订成功");
          this.dialogVisible = false;
          this.requestOutsideData();
        } else if (errcode === 100016) {
          this.$message.warning(errmsg);
          this.dialogVisible = false;
          this.requestOutsideData();
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtPublish = false;
      });
  }

  @Emit("requestData")
  requestOutsideData() {}

  mounted() {
    this.requestOptions();
    this.requestWorkers();
  }
}
</script>

<style scoped>
.pagination-block {
  text-align: center;
  margin-top: 8px;
}
</style>
