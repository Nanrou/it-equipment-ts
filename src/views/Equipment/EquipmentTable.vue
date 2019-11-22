<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      v-loading="tableLoading"
      row-key="eid"
      @row-click="openDetail"
    >
      <el-table-column type="index"></el-table-column>
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
      <el-table-column label="设备状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="warning"
            >维修</el-tag
          >
          <el-tag v-else-if="scope.row.status === 2" type="info">备用</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="danger">报废</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click.stop="editEquipment(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <equipment-detail ref="equipmentDetail" />
    <equipment-drawer ref="equipmentDrawer" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { EQUIPMENT_QUERY_API } from "@/store/api";
import { LOCAL_EQUIPMENTS } from "@/store/constTypes";
import { Equipment } from "@/store/types";
import { AxiosResponse } from "axios";
import EquipmentDetail from "@/views/Equipment/EquipmentDetail.vue";
import EquipmentDrawer from "@/views/Equipment/EquipmentDrawer.vue";

@Component({
  components: {
    EquipmentDrawer,
    EquipmentDetail
  }
})
export default class EquipmentTable extends Vue {
  @Ref() readonly equipmentDetail: EquipmentDetail;
  @Ref() readonly equipmentDrawer: EquipmentDrawer;

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

  editEquipment(equipment: Equipment) {
    //@ts-ignore todo rm
    this.equipmentDrawer.openDrawer(equipment);
  }

  openDetail(equipment: Equipment) {
    //@ts-ignore todo rm
    this.equipmentDetail.openDialog(equipment);
  }

  mounted() {
    this.requestData();
  }
}
</script>

<style scoped></style>
