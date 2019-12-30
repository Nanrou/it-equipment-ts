<template>
  <el-popover
    placement="right"
    @show="getQRCode"
    popper-class="zero-padding-popper-class"
    trigger="hover"
  >
    <div slot v-loading="loadingAtRequest" style="text-align: center">
      <img
        v-if="qrCodePic"
        :src="qrCodePic"
        style="width: 165px; height: 165px"
      />
      <div>
        <i>{{ qrText }}</i>
      </div>
    </div>
    <el-button slot="reference" type="text" icon="el-icon-tickets"></el-button>
  </el-popover>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { EQUIPMENT_QRCODE_API } from "@/store/api";

@Component
export default class QrCode extends Vue {
  @Prop(String) eid: string;
  loadingAtRequest = false;
  qrCodePic = "";
  qrText = "加载中~";
  getQRCode() {
    if (this.qrCodePic) {
      return;
    }
    this.loadingAtRequest = true;
    this.$axios
      .get(EQUIPMENT_QRCODE_API + `?eid=${this.eid}`, { responseType: "blob" })
      .then(response => {
        let reader = new FileReader();
        let that = this;
        reader.onload = function(event: any) {
          that.qrCodePic = event.target.result;
          that.qrText = "右键 另存为 即可保存";
        };
        reader.readAsDataURL(response.data);
      })
      .catch(() => {
        this.$message.error("获取设备二维码失败");
        this.qrText = "二维码怎么找不到了呢";
      })
      .finally(() => {
        this.loadingAtRequest = false;
      });
  }
}
</script>

<style lang="scss">
.zero-padding-popper-class {
  padding: 0;
}
</style>
