<template>
  <el-form inline ref="filterForm" v-loading="loadingAtRequestOptions">
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
        :placeholder="
          tableType === 'equipment' ? '请选择设备状态' : '请选择工单状态'
        "
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
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { FormOptions } from "@/store/types";
import {
  MaintenanceStatusOptions,
  EquipmentStatusOptions
} from "@/store/constTypes";
import {
  MAINTENANCE_FILTER_OPTIONS_API,
  EQUIPMENT_FILTER_OPTIONS_API
} from "@/store/api";
import { AxiosResponse } from "axios";

@Component
export default class TableFilterForm extends Vue {
  @Prop() tableType: "equipment" | "maintenance";

  loadingAtRequestOptions = false;
  filterForm = {
    department: [],
    equipment: [],
    status: []
  };

  departmentOptions: FormOptions[] = [];
  equipmentOptions: FormOptions[] = [];
  // statusOptions = MaintenanceStatusOptions;

  requestOptions() {
    this.loadingAtRequestOptions = true;
    this.$axios
      .get(
        this.tableType === "equipment"
          ? EQUIPMENT_FILTER_OPTIONS_API
          : MAINTENANCE_FILTER_OPTIONS_API
      )
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

  @Emit("handleFilterRequest")
  handleFilterRequest() {
    this.getFilterParam();
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

  get statusOptions() {
    return this.tableType === "equipment"
      ? EquipmentStatusOptions
      : MaintenanceStatusOptions;
  }

  @Emit("getFilterParam")
  getFilterParam(): string {
    let _url = "";
    for (let key in this.filterForm) {
      //@ts-ignore
      if (this.filterForm[key].length > 0) {
        //@ts-ignore
        _url += `&${key}=${this.filterForm[key].join(",")}`;
      }
    }
    return _url;
  }

  mounted() {
    this.requestOptions();
  }
}
</script>

<style scoped></style>
