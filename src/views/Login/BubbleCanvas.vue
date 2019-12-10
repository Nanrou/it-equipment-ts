<template>
  <canvas id="bubble-canvas" ref="bubble_canvas"></canvas>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { BubbleItem } from "@/store/types";

@Component
export default class BubbleCanvas extends Vue {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth,
    document.body.clientWidth
  );
  canvasHeight = Math.max(
    window.innerHeight,
    document.documentElement.clientHeight,
    document.body.clientHeight,
    675
  );
  roundCount = 50;
  allRound: BubbleItem[] = [];
  aID: number;

  timeoutIndexWidth: any;
  timeoutIndexHeight: any;

  animate() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (let r of this.allRound) {
      r.move(this.canvasHeight);
    }
    this.aID = requestAnimationFrame(this.animate);
  }

  init() {
    for (let i = 0; i < this.roundCount; i++) {
      this.allRound[i] = new BubbleItem(
        this.ctx,
        i,
        Math.random() * this.canvasWidth,
        Math.random() * this.canvasHeight
      );
      this.allRound[i].draw();
    }
    this.animate();
  }

  @Watch("onCanvasWidth")
  onCanvasWidth() {
    clearTimeout(this.timeoutIndexWidth);
    this.timeoutIndexWidth = setTimeout(() => {
      this.canvas.width = this.canvasWidth;
    }, 300);
  }

  @Watch("onCanvasWidth")
  onCanvasHeight() {
    clearTimeout(this.timeoutIndexHeight);
    this.timeoutIndexHeight = setTimeout(() => {
      this.canvas.height = this.canvasHeight;
    }, 300);
  }

  mounted() {
    this.canvas = document.getElementById("bubble-canvas") as HTMLCanvasElement;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.init();

    let that = this;
    window.onresize = function handleResize() {
      that.canvasWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth,
        document.body.clientWidth
      );
      that.canvasHeight = Math.max(
        window.innerHeight,
        document.documentElement.clientHeight,
        document.body.clientHeight,
        675
      );
    };
  }

  beforeDestroy() {
    cancelAnimationFrame(this.aID);
    window.onresize = () => {};
  }
}
</script>

<style lang="scss">
#bubble-canvas {
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
  background: #000c40; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to top,
    #f0f2f0,
    #000c40
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to top,
    #f0f2f0,
    #000c40
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
