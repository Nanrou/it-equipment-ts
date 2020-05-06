<template>
  <div>
    <div style="width: 95%">
      <span style="float: right">
        <el-button
          style="font-size: 18px"
          type="text"
          icon="el-icon-refresh"
          :loading="tableLoading"
          @click="requestData"
        ></el-button>
      </span>
    </div>
    <el-table
      :data="tableData"
      stripe
      v-loading="tableLoading"
      row-key="eid"
      @row-click="openDetail"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        width="55"
      ></el-table-column>
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
          <el-tag
            v-if="scope.row.status === 0"
            type="success"
            @click.stop="openStatusForm(scope.row)"
            >正常</el-tag
          >
          <el-tag v-else-if="scope.row.status === 1" type="warning"
            >维修</el-tag
          >
          <el-tag
            v-else-if="scope.row.status === 2"
            type="info"
            @click.stop="openStatusForm(scope.row)"
            >备用</el-tag
          >
          <el-tag
            v-else-if="scope.row.status === 3"
            type="danger"
            @click.stop="openStatusForm(scope.row)"
            >报废</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status !== 1"
            type="text"
            icon="el-icon-edit"
            @click.stop="editEquipment(scope.row)"
          ></el-button>
          <el-tooltip content="设备维修中" v-else>
            <el-button
              type="text"
              icon="el-icon-edit"
              :disabled="true"
            ></el-button>
          </el-tooltip>
          <qr-code :eid="scope.row.eid" style="margin-left: 8px" />
        </template>
      </el-table-column>
    </el-table>
    <equipment-detail ref="equipmentDetail" />
    <equipment-drawer ref="equipmentDrawer" v-on:requestData="requestData" />
    <equipment-status ref="equipmentStatus" v-on:requestData="requestData" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop, Emit } from "vue-property-decorator";
import { Equipment } from "@/store/types";
import EquipmentDetail from "@/views/Equipment/EquipmentDetail.vue";
import EquipmentDrawer from "@/views/Equipment/EquipmentDrawer.vue";
import EquipmentStatus from "@/views/Equipment/EquipmentStatus.vue";
import QrCode from "@/components/QrCode.vue";

@Component({
  components: {
    EquipmentStatus,
    EquipmentDrawer,
    EquipmentDetail,
    QrCode
  }
})
export default class EquipmentTable extends Vue {
  @Prop() currentPage: number;
  @Prop() pageSize: number;
  @Prop() tableData: Equipment[];
  @Prop() tableLoading: boolean;

  @Ref() readonly equipmentDetail: EquipmentDetail;
  @Ref() readonly equipmentDrawer: EquipmentDrawer;
  @Ref() readonly equipmentStatus: EquipmentStatus;

  editEquipment(equipment: Equipment) {
    //@ts-ignore todo rm
    this.equipmentDrawer.openDrawer(equipment);
  }

  openDetail(equipment: Equipment) {
    //@ts-ignore todo rm
    this.equipmentDetail.openDialog(equipment);
  }

  openStatusForm(equipment: Equipment) {
    //@ts-ignore todo rm
    this.equipmentStatus.openDialog(
      equipment.eid,
      equipment.status,
      equipment.user,
      equipment.owner,
      equipment.department
    );
  }

  indexMethod(index: number) {
    return index + (this.currentPage - 1) * this.pageSize + 1;
  }

  @Emit("requestData")
  requestData() {}
}
</script>

<style scoped></style>
