<template>
  <div>
    <el-form
      :model="userForm"
      ref="userForm"
      :rules="userFormRules"
      label-width="80px"
    >
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="userForm.workNumber" :maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="userForm.name" :maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="userForm.phone" :maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="department">
        <el-input
          v-model="userForm.department"
          :disabled="true"
          style="width: 180px"
        ></el-input>
        &nbsp;
        <el-button @click="openOrganizationStructureSelect">选择部门</el-button>
      </el-form-item>
      <!-- todo role & password -->
    </el-form>
    <organization-structure-select
      ref="organizationStructureSelect"
      v-on:getDepartment="setDepartment"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Emit } from "vue-property-decorator";
import { UserData, TreeNode } from "@/store/types";
import OrganizationStructureSelect from "@/components/OrganizationStructureSelect.vue";
import { ElForm } from "element-ui/types/form";

@Component({
  components: { OrganizationStructureSelect }
})
export default class UserForm extends Vue {
  @Ref("userForm") userFormIns: ElForm;
  @Ref() readonly organizationStructureSelect: OrganizationStructureSelect;

  userForm: UserData = {
    username: "",
    name: "",
    role: -1,
    department: "",
    phone: "",
    password: "",
    workNumber: ""
  };
  userFormRules = {
    workNumber: [{ required: true, message: "必须填写工号", trigger: "blur" }],
    name: [{ required: true, message: "必须填写姓名", trigger: "blur" }],
    phone: [{ required: true, message: "必须填写联系方式", trigger: "blur" }],
    department: [
      { required: true, message: "必须选择所属部门", trigger: "blur" }
    ]
  };

  setDepartment(n: TreeNode) {
    this.userForm.department = n.label;
  }

  openOrganizationStructureSelect() {
    //@ts-ignore
    this.organizationStructureSelect.openDialog();
  }

  initUserForm(form: any) {
    this.userForm = { ...form };
  }

  outputUserForm() {
    this.userFormIns.validate(valid => {
      if (valid) {
        this.handleValidCallback(this.userForm);
      } else {
        this.handleValidCallback(false);
      }
    });
  }

  @Emit("validCallback")
  handleValidCallback(res: any) {
    return res;
  }
}
</script>

<style scoped>
.el-input {
  width: 280px;
}
</style>
