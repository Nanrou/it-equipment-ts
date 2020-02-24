<template>
  <div>
    <h2>报表导出</h2>
    <el-form label-width="120px" v-loading="loadingAtRequestOptions">
      <el-form-item label="选择所属部门" style="width: 360px">
        <el-select
          :value="outputDepartment"
          v-model="outputDepartment"
          multiple
          :multiple-limit="multipleLimit"
          placeholder="全部"
        >
          <el-option
            v-for="item in departmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择设备分类" style="width: 360px">
        <el-select
          :value="outputCategory"
          v-model="outputCategory"
          multiple
          :multiple-limit="multipleLimit"
          placeholder="全部"
        >
          <el-option
            v-for="item in equipmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间节点(可选)">
        <el-date-picker
          v-model="outputPurchasingTime"
          size="small"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          style="width: 180px"
        ></el-date-picker>
        <i v-if="outputPurchasingTime" style="margin-left: 8px">
          <el-select
            v-model="timeInvert"
            :value="timeInvert"
            size="small"
            style="width: 80px"
          >
            <el-option
              v-for="item of timeOptions"
              :key="`time-option-${item.value}`"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          购买的</i
        >
      </el-form-item>
      <el-form-item style="width: 420px">
        <el-button v-loading="loadingAtPreview" @click="handlePreview">{{
          showDownloadBtn ? "预览结果" : "重置条件"
        }}</el-button>
        <div style="display: inline; margin-left: 8px">
          <el-button
            v-if="showDownloadBtn"
            v-loading="loadingAtDownload"
            circle
            icon="el-icon-download"
            @click="handleDownload"
          ></el-button>
          <a v-else :href="downloadContent.uri">{{ downloadContent.name }}</a>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { FormOptions } from "@/store/types";
import {
  EQUIPMENT_FILTER_OPTIONS_API,
  STATISTICS_PREVIEW_API,
  STATISTICS_DOWNLOAD_API
} from "@/store/api";
import { AxiosResponse } from "axios";

@Component
export default class Output extends Vue {
  multipleLimit = 10; // 多选的限制
  loadingAtRequestOptions: boolean = false;
  loadingAtPreview: boolean = false;
  loadingAtDownload: boolean = false;

  departmentOptions: FormOptions[] = [];
  equipmentOptions: FormOptions[] = [];

  outputPurchasingTime: string = "";
  timeInvert: boolean = false;
  timeOptions = [
    { label: "之后", value: false },
    { label: "之前", value: true }
  ];
  outputDepartment: string[] = [];
  outputCategory: string[] = [];
  showDownloadBtn: boolean = true;
  downloadContent = {
    uri: "",
    name: ""
  };

  requestOptions() {
    this.loadingAtRequestOptions = true;
    this.$axios
      .get(EQUIPMENT_FILTER_OPTIONS_API)
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

  handleParams() {
    let params = "?";
    if (this.outputPurchasingTime) {
      params += `&purchasingTime=${this.outputPurchasingTime}&timeInvert=${this.timeInvert}&`;
    }
    for (let item of [
      ["category", this.outputCategory],
      ["department", this.outputDepartment]
    ]) {
      let k = item[0];
      let vs = item[1] as any;
      if (vs.length > 0) {
        params += `${k}=${vs.join(",")}&`;
      }
    }
    return params;
  }

  resetOutputForm() {
    this.showDownloadBtn = true;
    this.downloadContent = {
      uri: "",
      name: ""
    };
    this.outputPurchasingTime = "";
    this.timeInvert = false;
    this.outputDepartment = [];
    this.outputCategory = [];
  }

  handlePreview() {
    if (this.showDownloadBtn) {
      this.loadingAtPreview = true;
      console.log(this.handleParams());
      this.loadingAtPreview = false;
    } else {
      this.resetOutputForm();
    }
  }

  handleDownload() {
    this.loadingAtDownload = true;
    this.loadingAtDownload = false;
    this.showDownloadBtn = false;
    this.downloadContent = {
      uri: "/",
      name: this.outputPurchasingTime
    };
  }

  mounted() {
    this.requestOptions();
  }
}
</script>

<style scoped></style>
