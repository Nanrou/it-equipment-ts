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
        <el-button
          v-loading="loadingAtPreview"
          :disabled="selectedParams"
          @click="handlePreview"
          >{{ showDownloadBtn ? "预览结果" : "重置条件" }}</el-button
        >
        <div style="display: inline; margin-left: 8px">
          <el-button
            v-if="showDownloadBtn"
            v-loading="loadingAtDownload"
            :disabled="selectedParams"
            circle
            icon="el-icon-download"
            @click="handleDownload"
          ></el-button>
          <a
            v-else
            :href="downloadContent.uri"
            :download="downloadContent.name"
            >{{ downloadContent.name }}</a
          >
        </div>
      </el-form-item>
    </el-form>
    <el-dialog title="导出预览" :visible.sync="dialogVisible">
      <el-table :data="previewData" stripe>
        <el-table-column label="设备分类" prop="category"></el-table-column>
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
        <el-table-column label="所属部门" prop="department"></el-table-column>
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
      <div style="margin-top: 8px; color: #909399">
        <i>预览只展示前10条数据供检验过滤条件</i>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { FormOptions, PreviewData } from "@/store/types";
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

  dialogVisible = false;
  previewData: PreviewData[] = [];

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
      this.$axios
        .get(STATISTICS_PREVIEW_API + this.handleParams())
        .then((response: AxiosResponse) => {
          let { errcode, errmsg, data } = response.data;
          if (errcode === 0) {
            this.previewData = data;
            this.dialogVisible = true;
          } else {
            this.$message.error(errmsg);
          }
        })
        .finally(() => {
          this.loadingAtPreview = false;
        });
    } else {
      this.resetOutputForm();
    }
  }

  handleDownload() {
    this.loadingAtDownload = true;
    this.$axios
      .get(STATISTICS_DOWNLOAD_API + this.handleParams())
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.downloadContent = {
            uri: data.uri, // 这个下载文件需要nginx转发一下
            name: data.name
          };
          this.showDownloadBtn = false;
          this.$message.success("导出成功");
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtDownload = false;
      });
  }

  get selectedParams(): boolean {
    if (this.outputDepartment.length !== 0) {
      return false;
    }
    if (this.outputCategory.length !== 0) {
      return false;
    }
    return this.outputPurchasingTime.length === 0;
  }

  mounted() {
    this.requestOptions();
  }
}
</script>

<style scoped></style>
