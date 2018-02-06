<template>
  <div class="check-step" v-if="progressList.length" ref="wrap">
    <ul>
      <li :key="index" v-for="(item, index) in progressList" v-html="item" ref="liCur"></li>
    </ul>
    <div class="pro-bar" ref="proBar"></div>
  </div>
</template>

<script>
export default {
  props: {
    progressList: {
      type: Array,
      default: () => [] // es6的箭头函数
    },
    curLen: {
      type: Number,
      default: -1
    }
  },
  mounted () {
    clearInterval(this.timer)
    let per = this.$refs.liCur[1].offsetLeft
    let allWidth = per * (this.progressList.length)
    let addCount = 5
    this.timer = setInterval(() => {
      this.$refs.proBar.style.width = this.$refs.proBar.clientWidth / allWidth * 100 + addCount + '%'
      this.progressList.map((item, index) => {
        let percent = (this.$refs.liCur[index].offsetLeft / allWidth + 0.5 / this.progressList.length) * 100
        // console.log(parseFloat(this.$refs.proBar.style.width), percent)
        if (parseFloat(this.$refs.proBar.style.width) >= percent) {
          this.$refs.liCur[index].className = 'cur'
        }
      })
      if (parseFloat(this.$refs.proBar.style.width) >= 25 * (this.curLen + 1)) {
        clearInterval(this.timer)
      }
    }, 50)
  }
}
</script>

<style scoped>
.check-step{
  position: relative;
}
.pro-bar{
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 0;
  height: 2px;
  background: #d1434a;
}
@media only screen and (max-width: 767px) {
  .pro-bar {
    bottom: 0;
  }
}
</style>
