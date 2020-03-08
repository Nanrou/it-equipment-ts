<template>
  <el-dialog
    title="邮件详情"
    :visible.sync="dialogVisible"
    v-loading="emailLoading"
  >
    <template>
      <p>{{ content }}</p>
      <div v-show="showResendBtn">
        <el-button @click="resendEmail">重发邮件</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import {
  GET_EMAIL_CONTENT_API,
  RESEND_MAINTENANCE_EMAIL_API,
  RESEND_PATROL_EMAIL_API
} from "@/store/api";

@Component
export default class EmailDialog extends Vue {
  @Prop() emailType: "maintenance" | "patrol";

  dialogVisible = false;
  emailLoading = false;
  content: string = "";
  caseId = "";
  showResendBtn = false;
  resendBtnLoading = false;

  resetDialog() {
    this.content = "";
    this.caseId = "";
    this.emailLoading = false;
    this.showResendBtn = false;
    this.resendBtnLoading = false;
  }

  openEmailDialog(caseId: string) {
    this.resetDialog();
    this.dialogVisible = true;
    this.emailLoading = true;
    this.caseId = caseId;
    this.$axios
      .get(GET_EMAIL_CONTENT_API + `?caseId=${caseId}`)
      .then((response: AxiosResponse) => {
        let { errcode, errmsg, data } = response.data;
        if (errcode === 0) {
          this.content = data.content;
        } else if (errcode === 100017) {
          this.content = "暂无发送记录，请重新发送";
          this.showResendBtn = true;
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.emailLoading = false;
      });
  }

  resendEmail() {
    this.resendBtnLoading = true;
    this.$axios
      .patch(
        (this.emailType === "patrol"
          ? RESEND_PATROL_EMAIL_API
          : RESEND_MAINTENANCE_EMAIL_API) + `?caseId=${this.caseId}`
      )
      .then((response: AxiosResponse) => {
        let { errcode, errmsg } = response.data;
        if (errcode === 0) {
          this.$message.success("发送成功");
        } else if (errcode === 100018) {
          this.$message.warning("邮件已发送，请勿重发");
        } else {
          this.$message.error(errmsg);
        }
      })
      .finally(() => {
        this.resendBtnLoading = false;
        this.dialogVisible = false;
      });
  }
}
</script>

<style scoped></style>
