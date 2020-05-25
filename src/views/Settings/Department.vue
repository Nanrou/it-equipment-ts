<template>
  <div>
    <el-container>
      <el-header style="margin-left: 36px">
        <h2>组织架构管理</h2>
      </el-header>
      <el-main>
        <el-tree
          v-loading="loadingAtRequest"
          :data="treeData"
          node-key="key"
          :default-expand-all="true"
          style="max-width: 720px; margin-left: 48px"
        >
          <span class="tree-span" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                @click.stop="handleAddNode(data)"
                type="text"
                style="color: #403737"
                >新增</el-button
              >
              <el-button @click.stop="handleEditNode(data)" type="text"
                >更名</el-button
              >
              <el-button
                @click.stop="handleRemoveNode(data)"
                type="text"
                style="color: darkred"
                >删除</el-button
              >
              <department-contact-button :did="data.value" />
            </span>
          </span>
        </el-tree>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { TreeNode } from "@/store/types";
import {
  ORGANIZATION_QUERY_API,
  ORGANIZATION_ADD_API,
  ORGANIZATION_UPDATE_API,
  ORGANIZATION_REMOVE_API
} from "@/store/api";
import {
  UpdateDepartmentLabelInterface,
  AddDepartmentLabelInterface
} from "@/store/types";
import DepartmentContactButton from "./DepartmentContactButton.vue";

@Component({
  components: { DepartmentContactButton }
})
export default class Department extends Vue {
  loadingAtRequest = false;
  treeData: TreeNode[] = [
    {
      label: "",
      value: "",
      children: []
    }
  ];

  handleQueryOrganization() {
    this.loadingAtRequest = true;
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
        this.loadingAtRequest = false;
      });
  }

  handleAddNode(node: TreeNode) {
    this.$prompt("请填入新单位名称", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          let _request: AddDepartmentLabelInterface = {
            label: instance.inputValue,
            parentId: node.value
          };
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = "执行中...";
          this.$axios
            .post(ORGANIZATION_ADD_API, _request)
            .then((response: AxiosResponse) => {
              let { errcode, errmsg } = response.data;
              if (errcode === 0) {
                this.$message.success("操作成功");
                done();
                this.handleQueryOrganization();
              } else {
                this.$message.error(errmsg);
              }
            })
            .finally(() => {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = "确定";
            });
        } else {
          done();
        }
      }
    })
      .then()
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消新增"
        });
      });
  }

  handleEditNode(node: TreeNode) {
    this.$prompt(`请更改${node.label}的名称`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          let _request: UpdateDepartmentLabelInterface = {
            label: instance.inputValue
          };
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = "执行中...";
          this.$axios
            .patch(ORGANIZATION_UPDATE_API + `?did=${node.value}`, _request)
            .then((response: AxiosResponse) => {
              let { errcode, errmsg } = response.data;
              if (errcode === 0) {
                this.$message.success("操作成功");
                done();
                this.handleQueryOrganization();
              } else {
                this.$message.error(errmsg);
              }
            })
            .finally(() => {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = "确定";
            });
        } else {
          done();
        }
      }
    })
      .then()
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消修改"
        });
      });
  }

  handleRemoveNode(node: TreeNode) {
    this.$confirm(`此操作将删除 ${node.label}, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = "执行中...";
          this.$axios
            .delete(ORGANIZATION_REMOVE_API + `?did=${node.value}`)
            .then((response: AxiosResponse) => {
              let { errcode, errmsg } = response.data;
              if (errcode === 0) {
                this.$message.success("操作成功");
                done();
                this.handleQueryOrganization();
              } else {
                this.$message.error(errmsg);
              }
            })
            .finally(() => {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = "确定";
            });
        } else {
          done();
        }
      }
    })
      .then(() => {})
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  mounted() {
    this.handleQueryOrganization();
  }
}
</script>

<style scoped>
.tree-span {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 8px;
}
</style>
