<template>
  <div>
    <el-form
      :model="equipmentForm"
      ref="equipmentForm"
      v-loading="loadingAtSubmit"
      label-width="100px"
      :rules="equipmentFormRule"
    >
      <el-form-item label="设备分类" prop="category">
        <el-select
          placeholder="请选择"
          :disabled="action === 'update'"
          :value="equipmentForm.category"
          v-model="equipmentForm.category"
        >
          <el-option
            v-for="c in categoryOptions"
            :key="c.value"
            :label="c.label"
            :value="c.value"
          ></el-option>
        </el-select>
        <template v-if="equipmentForm.category === '台式电脑'">
          <template v-if="action === 'add'">
            <el-button
              size="medium"
              style="margin-left: 8px"
              @click="handleOpenHardware"
              >+硬件信息</el-button
            >
          </template>
          <template v-else>
            <el-tooltip content="更新硬件信息">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleOpenHardware"
              />
            </el-tooltip>
          </template>
        </template>
      </el-form-item>
      <!-- todo hardware -->
      <transition name="el-zoom-in-top">
        <el-form-item
          label="设备种类"
          v-if="equipmentForm.category === '其他设备'"
        >
          <el-input
            :maxlength="16"
            placeholder="请输入具体设备"
            v-model="otherCategory"
          >
          </el-input>
        </el-form-item>
      </transition>
      <el-form-item label="品牌厂家" prop="brand">
        <el-input
          v-model="equipmentForm.brand"
          placeholder="如：方正，联想"
          :maxlength="12"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌型号" prop="modelNumber">
        <el-input
          v-model="equipmentForm.modelNumber"
          :maxlength="32"
        ></el-input>
      </el-form-item>
      <el-form-item label="序列号" prop="serialNumber">
        <el-input
          v-model="equipmentForm.serialNumber"
          :maxlength="48"
        ></el-input>
      </el-form-item>
      <el-form-item label="资产价格">
        <el-input
          v-model.number="equipmentForm.price"
          :maxlength="11"
          placeholder="0"
          style="width: 220px"
        ></el-input>
        &nbsp;
        <el-tooltip
          class="prompt-small"
          effect="dark"
          content="如无则留空"
          placement="top-start"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="购买时间" prop="purchasingTime">
        <el-date-picker
          v-model="equipmentForm.purchasingTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
          style="width: 220px"
        >
        </el-date-picker>
        &nbsp;
        <el-tooltip
          class="prompt-small"
          effect="dark"
          content="如无购买时间，可以填机器的生产时间"
          placement="top-start"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="保修时长" prop="guarantee">
        <el-input-number
          v-model="equipmentForm.guarantee"
          :min="0"
          :max="72"
          size="small"
          placeholder="12"
        >
        </el-input-number>
        <span style="margin-left: 5px; font-size: 16px"> 个月</span>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="127"
          placeholder="请输入内容"
          v-model="equipmentForm.remark"
        >
        </el-input>
      </el-form-item>
      <template v-if="action === 'add'">
        <el-form-item label="是否备用">
          <el-switch
            v-model="equipmentForm.status"
            :active-value="2"
            :inactive-value="0"
            inactive-text="正在使用"
            active-text="备用入库"
          >
          </el-switch>
          &nbsp;
          <el-tooltip
            class="prompt-small"
            effect="dark"
            content="刚采购回来还未分配下去，就是备用"
            placement="top-start"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
      </template>
      <template v-if="equipmentForm.status === 0">
        <el-form-item label="责任人" prop="admin">
          <el-input v-model="equipmentForm.owner"></el-input>
        </el-form-item>
        <el-form-item label="使用人" prop="user">
          <el-input v-model="equipmentForm.user"></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input
            v-model="equipmentForm.department"
            :disabled="true"
            style="width: 180px"
            :placeholder="user.department"
          ></el-input>
          &nbsp;
          <el-button @click="openOrganizationStructureSelect"
            >选择部门</el-button
          >
        </el-form-item>
      </template>
      <template v-if="action === 'add'">
        <el-form-item label="填报人">
          <span>{{ user.name }}</span>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="addEquipment"
            :loading="loadingAtSubmit"
            >填报</el-button
          >
          <el-button @click="resetEquipmentForm">重置</el-button>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loadingAtSubmit"
            :disabled="!equipmentFormCompliance"
            @click="updateEquipment"
            >更新</el-button
          >
          <el-button @click="handleClose">取消</el-button>
          <el-tooltip effect="dark" content="删除" placement="top-start">
            <el-button @click="handleRemove" type="text" style="color: #F56C6C">
              <i class="el-icon-delete" />
            </el-button>
          </el-tooltip>
        </el-form-item>
      </template>
    </el-form>
    <equipment-hardware
      :action="action"
      ref="hardware"
      v-on:setHardware="setHardware"
    />
    <organization-structure-select
      ref="organizationStructureSelect"
      v-on:getDepartment="setDepartment"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop, Emit } from "vue-property-decorator";
import {
  Equipment,
  FormOptions,
  AddEquipmentInterface,
  TreeNode
} from "@/store/types";
import { CategoryOptions } from "@/store/constTypes";
import {
  EQUIPMENT_ADD_API,
  EQUIPMENT_UPDATE_API,
  EQUIPMENT_REMOVE_API
} from "@/store/api";
import { State } from "vuex-class";
import { StoreUser, Hardware } from "@/store/types";
import { ElForm } from "element-ui/types/form";
import EquipmentHardware from "@/views/Equipment/EquipmentHardware.vue";
import { AxiosResponse } from "axios";
import OrganizationStructureSelect from "@/components/OrganizationStructureSelect.vue";

@Component({
  components: { EquipmentHardware, OrganizationStructureSelect }
})
export default class EquipmentFrom extends Vue {
  @Prop(String) action: "update" | "add";
  @Prop() originEquipmentForm?: Equipment;
  @State("user") user: StoreUser;
  @Ref("equipmentForm") equipmentFormIns: ElForm;
  @Ref("hardware") hardwareIns: EquipmentHardware;
  @Ref() readonly organizationStructureSelect: OrganizationStructureSelect;

  loadingAtSubmit = false;
  initiativeClose = false;
  equipmentForm: Equipment = {
    brand: "",
    category: "",
    del_flag: false,
    department: "",
    edit: "",
    eid: "",
    guarantee: 12,
    modelNumber: "",
    owner: "",
    price: 0,
    purchasingTime: "",
    remark: "",
    serialNumber: "",
    status: 0,
    user: ""
  };
  hardware: Hardware = {
    cpu: "",
    disk: "",
    gpu: "",
    ip: "",
    mainBoard: "",
    memory: "",
    remark: ""
  };
  otherCategory: string = "";

  categoryOptions: FormOptions[] = CategoryOptions.map(ele => ({
    label: ele,
    value: ele
  }));

  equipmentFormRule = {
    category: [
      { required: true, message: "必须选择设备分类", trigger: "blur" }
    ],
    brand: [{ required: true, message: "必须填写品牌厂家", trigger: "blur" }],
    purchasingTime: [
      { required: true, message: "必须填写购买时间", trigger: "blur" }
    ]
  };

  // 检查status为使用中的情况下的规则约束
  checkStatusValidate(equipment: Equipment): boolean {
    if (
      equipment.status === 0 &&
      !(Boolean(equipment.user) && Boolean(equipment.owner))
    ) {
      if (!equipment.user) {
        this.$message({
          message: "请填写设备的使用人",
          type: "warning"
        });
      } else {
        this.$message({
          message: "请填写设备的负责人",
          type: "warning"
        });
      }
      return false;
    }
    return true;
  }

  // 检查设备分类为其他的情况下，是否填写具体设备
  checkOtherCategory(equipment: Equipment): boolean {
    if (equipment.category === "其他设备" && this.otherCategory.length === 0) {
      this.$message({
        message: "请填写设备的具体分类",
        type: "warning"
      });
      return false;
    }
    return true;
  }

  addEquipment() {
    let _equipment = this.equipmentForm as Equipment;
    if (!this.checkOtherCategory(_equipment)) {
      return false;
    } else if (!this.checkStatusValidate(_equipment)) {
      return false;
    } else {
      this.equipmentFormIns.validate(valid => {
        if (valid) {
          this.loadingAtSubmit = true;
          this.initiativeClose = true;
          let data: AddEquipmentInterface = {
            category: _equipment.category,
            brand: _equipment.brand,
            modelNumber: _equipment.modelNumber,
            serialNumber: _equipment.serialNumber,
            price: _equipment.price || 0,
            purchasingTime: _equipment.purchasingTime,
            guarantee: _equipment.guarantee || 12,
            remark: _equipment.remark,
            status: _equipment.status,
            user: _equipment.user,
            owner: _equipment.owner,
            department: _equipment.department,
            hardware: this.hardware
          };
          this.$axios
            .post(EQUIPMENT_ADD_API, data)
            .then(response => {
              let { errcode, errmsg } = response.data;
              if (errcode === 0) {
                this.$message.success("新增设备成功！");
                this.handleClose();
              } else {
                this.$message.error(errmsg);
              }
            })
            .finally(() => {
              this.loadingAtSubmit = false;
            });
        } else {
          return false;
        }
      });
    }
  }

  updateEquipment() {
    let _equipment = this.equipmentForm as Equipment;
    let _originEquipment = this.originEquipmentForm as Equipment;
    if (!this.checkOtherCategory(_equipment)) {
      return false;
    } else if (!this.checkStatusValidate(_equipment)) {
      return false;
    } else {
      this.equipmentFormIns.validate(valid => {
        if (valid) {
          this.loadingAtSubmit = true;
          let _res = {};
          Object.keys(_equipment).map(k => {
            //@ts-ignore
            if (_equipment[k] !== _originEquipment[k]) {
              //@ts-ignore
              _res[k] = [_equipment[k], _originEquipment[k]]; // data: {key: [new, old]}
            }
          });
          this.$axios
            .patch(EQUIPMENT_UPDATE_API + `?eid=${_equipment.eid}`, _res)
            .then((response: AxiosResponse) => {
              let { errcode, errmsg } = response.data;
              if (errcode === 0) {
                this.$message.success("更新设备信息成功！");
              } else {
                this.$message.error(errmsg);
              }
            })
            .finally(() => {
              this.loadingAtSubmit = false;
              this.handleClose();
            });
        } else {
          return false;
        }
      });
    }
  }

  resetEquipmentForm() {
    if (this.action === "add") {
      this.equipmentFormIns.resetFields();
    }
  }

  handleRemove() {
    this.$msgbox({
      message: "确定将此记录删除吗？",
      title: "警告",
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = "执行中...";
          this.$axios
            .delete(EQUIPMENT_REMOVE_API + `?eid=${this.equipmentForm.eid}`)
            .then((response: AxiosResponse) => {
              let { errcode, errmsg } = response.data;
              if (errcode === 0) {
                this.$message.success("操作成功！");
              } else {
                this.$message.error(errmsg);
              }
            })
            .finally(() => {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = "确定";
              done();
              this.handleClose();
            });
        } else {
          done();
        }
      }
    })
      .then(() => {})
      .catch(() => {});
  }

  confirmCheck(): boolean {
    // 检查表格内容是否已经变动，只在被动关闭的时候判断
    // true是需要提醒
    if (this.initiativeClose) {
      return false;
    }
    if (this.action === "add") {
      return Object.values(this.equipmentForm).some(ele => Boolean(ele));
    } else {
      return this.equipmentFormCompliance;
    }
  }

  @Emit("close")
  handleClose() {
    // 找不到直接关闭drawer的方法，visible设为false不会销毁
    if (this.action === "update") {
      //@ts-ignore
      this.equipmentForm = { ...this.originEquipmentForm };
    }
  }

  handleOpenHardware() {
    //@ts-ignore
    this.hardwareIns.openDialog(this.equipmentForm.eid);
  }

  setHardware(h: Hardware) {
    this.hardware = { ...h };
    //@ts-ignore
    this.hardwareIns.closeDialog();
  }

  openOrganizationStructureSelect() {
    //@ts-ignore
    this.organizationStructureSelect.openDialog();
  }

  setDepartment(n: TreeNode) {
    this.equipmentForm.department = n.label;
  }

  get equipmentFormCompliance(): boolean {
    if (this.action === "update") {
      return Object.keys(this.equipmentForm).some(
        //@ts-ignore 校验一致性
        key => this.equipmentForm[key] !== this.originEquipmentForm[key]
      );
    }
    return true;
  }

  mounted() {
    if (this.action === "update") {
      this.equipmentForm = { ...this.originEquipmentForm } as Equipment;
    }
  }
}
</script>

<style scoped>
.el-input,
.el-textarea {
  width: 80%;
}
</style>
