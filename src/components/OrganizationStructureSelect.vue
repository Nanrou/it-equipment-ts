<template>
  <el-dialog
    title="选择部门"
    :visible.sync="visible"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <el-tree
      v-loading="loading"
      :data="treeData"
      node-key="key"
      style="width: 480px; margin: auto"
    >
      <span class="tree-span" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <template
          v-if="
            (data.hasOwnProperty('children') && data.children.length === 0) ||
              !data.hasOwnProperty('children')
          "
        >
          <span
            ><el-button type="text" @click="getDepartment(data)"
              >选择</el-button
            ></span
          >
        </template>
      </span>
    </el-tree>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { ORGANIZATION_QUERY_API } from "@/store/api";
import { AxiosResponse } from "axios";
import { TreeNode } from "@/store/types";

@Component
export default class OrganizationStructureSelect extends Vue {
  visible = false;
  loading = false;
  treeData: TreeNode[] = [
    {
      label: "",
      value: "",
      children: []
    }
  ];

  handleRequestOrganization() {
    this.loading = true;
    this.$axios
      .get(ORGANIZATION_QUERY_API)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.treeData = data;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  @Emit("getDepartment")
  getDepartment(node: TreeNode) {
    this.visible = false;
    return node;
  }

  openDialog() {
    this.visible = true;
  }

  mounted() {
    this.handleRequestOrganization();
  }
}
</script>

<style scoped>
.tree-span {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
