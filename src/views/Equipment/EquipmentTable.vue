<template>
  <div>
    <el-table></el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { EQUIPMENT_QUERY_API } from "@/store/api";
import { LOCAL_EQUIPMENTS } from "@/store/constTypes";
import { Equipment } from "@/store/types";
import { AxiosResponse } from "axios";

@Component
export default class EquipmentTable extends Vue {
  tableLoading = false;
  tableData: Equipment[] = [];

  requestData(page: number = -1) {
    this.tableLoading = true;
    this.$axios
      .get(EQUIPMENT_QUERY_API + (page > 0 ? `page=${page.toString()}` : ""))
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.tableData = data;
          window.localStorage.setItem(LOCAL_EQUIPMENTS, JSON.stringify(data));
        } else {
          this.$message.error(errmsg);
        }
      })
      .catch(() => {
        // todo pagination 分页
        this.tableData = JSON.parse(
          window.localStorage.getItem(LOCAL_EQUIPMENTS) || "[]"
        );
      })
      .finally(() => {
        this.tableLoading = false;
      });
  }

  mounted() {
    this.requestData();
  }
}
</script>

<style scoped></style>
