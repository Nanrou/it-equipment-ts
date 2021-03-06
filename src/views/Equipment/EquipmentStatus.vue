<template>
  <div>
    <el-dialog
      title="修改状态"
      :visible.sync="visible"
      :destroy-on-close="true"
      :before-close="closeDialogCheck"
      width="380px"
    >
      <el-select
        placeholder="请选择"
        :value="statusForm.status"
        v-model="statusForm.status"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.value === originStatus"
        ></el-option>
      </el-select>
      <template v-if="!equipmentFormCompliance">
        <template v-if="statusForm.status === 0">
          <el-form
            :model="statusForm"
            :rules="statusFormRule"
            v-loading="loadingAtSubmit"
            style="margin-top: 16px"
            ref="statusForm"
          >
            <el-form-item label="使用人" prop="user">
              <el-input v-model="statusForm.user"></el-input>
            </el-form-item>
            <el-form-item label="责任人" prop="owner">
              <el-input v-model="statusForm.owner"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" prop="department">
              <el-input
                v-model="statusForm.department"
                :disabled="true"
                style="width: 180px"
              ></el-input>
              &nbsp;
              <el-button @click="openOrganizationStructureSelect"
                >选择部门</el-button
              >
            </el-form-item>
          </el-form>
          <div style="text-align: center">
            <el-button
              type="primary"
              :loading="loadingAtSubmit"
              @click="handleChangeStatus"
              >确定</el-button
            >
          </div>
        </template>
        <template v-else>
          <el-button
            type="primary"
            style="margin-left: 12px"
            @click="handleChangeStatus"
            :loading="loadingAtSubmit"
            >确定</el-button
          >
        </template>
      </template>
    </el-dialog>
    <organization-structure-select
      ref="organizationStructureSelect"
      v-on:getDepartment="setDepartment"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Emit } from "vue-property-decorator";
import { ElForm } from "element-ui/types/form";
import { TreeNode } from "@/store/types";
import { AxiosResponse } from "axios";
import { EQUIPMENT_CHANGE_STATUS_API } from "@/store/api";
import OrganizationStructureSelect from "@/components/OrganizationStructureSelect.vue";

@Component({
  components: { OrganizationStructureSelect }
})
export default class EquipmentStatus extends Vue {
  @Ref("statusForm") statusFormIns: ElForm;
  @Ref() readonly organizationStructureSelect: OrganizationStructureSelect;

  visible = false;
  loadingAtSubmit = false;
  originStatus: number = 0;
  statusForm = {
    eid: "",
    status: 0,
    user: "",
    owner: "",
    department: ""
  };
  statusFormRule = {
    user: [{ required: true, message: "必须选择联系人", trigger: "blur" }],
    owner: [{ required: true, message: "必须选择负责人", trigger: "blur" }],
    department: [
      { required: true, message: "必须选择所属部门", trigger: "blur" }
    ]
  };
  statusOptions = [
    { label: "正常", value: 0 },
    { label: "备用", value: 2 },
    { label: "报废", value: 3 }
  ];

  openDialog(
    eid: any,
    status: number,
    user: string,
    owner: string,
    department: string
  ) {
    this.originStatus = status;
    this.statusForm.status = status;
    this.statusForm.eid = eid;
    this.statusForm.user = user;
    this.statusForm.owner = owner;
    this.statusForm.department = department;
    this.visible = true;
  }

  handleChangeStatus() {
    if (this.statusForm.status === 0) {
      this.statusFormIns.validate(valid => {
        if (valid) {
          this.handleChangeStatusInner();
        } else {
          return false;
        }
      });
    } else {
      let _text = this.statusForm.status === 2 ? "备用" : "报废";
      this.$confirm(`确定将该设备状态改为${_text}？`)
        .then(_ => {
          this.handleChangeStatusInner();
        })
        .catch(_ => {});
    }
  }

  handleChangeStatusInner() {
    this.loadingAtSubmit = true;
    this.$axios
      .patch(
        EQUIPMENT_CHANGE_STATUS_API + `?eid=${this.statusForm.eid}`,
        this.statusForm
      )
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          this.$message.success("更新成功");
          this.requestData();
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loadingAtSubmit = false;
        this.visible = false;
      });
  }

  closeDialogCheck(done: any) {
    if (this.equipmentFormCompliance) {
      done();
    } else {
      this.$confirm("内容已发生改变，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }

  @Emit("requestData")
  requestData() {}

  openOrganizationStructureSelect() {
    //@ts-ignore
    this.organizationStructureSelect.openDialog();
  }

  setDepartment(n: TreeNode) {
    this.statusForm.department = n.label;
  }

  get equipmentFormCompliance(): boolean {
    return this.statusForm.status === this.originStatus;
  }
}
</script>

<style scoped></style>
