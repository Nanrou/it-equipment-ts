<template>
  <div>
    <el-form inline v-loading="loadingAtRequestConfig">
      <el-form-item
        label="通信配置："
        style="font-weight: bolder"
      ></el-form-item>
      <el-form-item
        v-for="c in configList"
        :key="c[0]"
        :label="configMapper[c[0]]"
      >
        <el-switch
          v-model="c[1]"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0"
          @change="handleConfigChange(c)"
        >
        </el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { CONFIG_API } from "../../store/api";
import { ConfigMapper } from "../../store/constTypes";

@Component
export default class System extends Vue {
  loadingAtRequestConfig = false;
  configMapper = ConfigMapper;
  configList: [] = []; // [[k, v], ...]

  requestConfig() {
    this.loadingAtRequestConfig = true;
    this.$axios
      .get(CONFIG_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.configList = data;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequestConfig = false;
      });
  }

  handleConfigChange(c: string[]) {
    this.loadingAtRequestConfig = true;
    this.$axios
      .patch(CONFIG_API, { key: c[0], value: c[1] })
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          //@ts-ignore
          this.$message.success(`更改${this.configMapper[c[0]]}配置成功`);
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtRequestConfig = false;
      });
  }

  mounted() {
    this.requestConfig();
  }
}
</script>

<style scoped></style>
