<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-09 16:58:39
 * @LastEditTime: 2022-12-09 21:10:34
 * @Description : 内核心激活训练-参数设置
-->
<template>
  <div class="core-activation-set">
    <div class="des">
      <div class="item">
        训练目的：激活腹横肌、多裂肌、盆底肌、膈肌，改善腹直肌分离、产后腰背疼痛
      </div>
      <div class="item">
        动作要求：配合腹式呼吸，曲线穿过横线范围上下线完成一个训练
      </div>
    </div>

    <div class="content">
      <div class="chart">
        <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
      </div>

      <div class="set">
        <!-- 示意图 -->
        <div class="title">示意图</div>
        <div class="img">
          <el-image :src="imgSrc" fit="scale-down"></el-image>
        </div>
        <!-- 训练目标 -->
        <div class="set__one">
          <div class="text">训练目标</div>
          <el-input-number
            v-model="targetDown"
            :precision="0"
            :step="1"
            :min="0"
            :max="targetUp - 1"
            @change="handleChangeTargetDown"
          ></el-input-number>
          <span class="interval">~</span>
          <el-input-number
            v-model="targetUp"
            :precision="0"
            :step="1"
            :min="targetDown + 1"
            :max="100"
            @change="handleChangeTargetUp"
          ></el-input-number>
        </div>
        <!-- 训练个数 -->
        <div class="set__two">
          <span class="text">训练个数</span>
          <el-input-number
            v-model="num"
            :precision="0"
            :step="1"
            :min="5"
            :max="20"
          ></el-input-number>
        </div>
      </div>
    </div>

    <div class="btn">
      <el-button class="btn__item" type="primary" @click="handleStart"
        >开始训练</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'core-activation-set',

  data() {
    return {
      imgSrc: require('@/assets/img/Train/Core_Activation/示意图.png'), // 示意图

      /* 图形相关变量 */
      myChart: null,
      option: {},

      /* 其他 */
      targetUp: '', // 训练目标上限
      targetDown: '', // 训练目标下限
      num: 5 // 训练个数
    }
  },

  created() {
    const maxDepth = this.$store.state.bothFlexibility.maxDepth
    const minDepth = this.$store.state.bothFlexibility.minDepth
    const middle = parseInt((maxDepth + minDepth) / 2)
    this.targetUp = middle + 5
    this.targetDown = middle - 5
  },
  mounted() {
    this.initChart()
  },

  methods: {
    /**
     * @description: 初始化echarts图形
     */
    initChart() {
      this.myChart = this.$echarts.init(document.getElementById('chart'))
      this.option = {
        xAxis: {
          type: 'category',
          name: '秒',
          data: [],
          boundaryGap: false // 从0点开始
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false // 隐藏背景网格线
          },
          max: this.targetUp + 10 <= 100 ? this.targetUp + 10 : 100,
          min: this.targetDown - 10 >= 0 ? this.targetDown - 10 : 0
        },
        legend: {},
        series: [
          {
            name: '上限',
            data: [this.targetUp, this.targetUp],
            color: 'blue',
            type: 'line',
            smooth: true,
            showSymbol: false
          },
          {
            name: '下限',
            data: [this.targetDown, this.targetDown],
            color: 'green',
            type: 'line',
            smooth: true,
            showSymbol: false
          }
        ],
        animation: false
      }
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 下训练目标计数器改变时触发
     */
    handleChangeTargetDown() {
      this.option.series[1].data = [this.targetDown, this.targetDown]
      this.myChart.setOption(this.option)
    },
    /**
     * @description: 上训练目标计数器改变时触发
     */
    handleChangeTargetUp() {
      this.option.series[0].data = [this.targetUp, this.targetUp]
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 开始训练
     */
    handleStart() {
      // this.$router.push({
      //   path: '/',
      //   query: {
      //     targetUp: JSON.stringify(this.targetUp),
      //     targetDown: JSON.stringify(this.targetDown),
      //     num: JSON.stringify(this.num)
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.core-activation-set {
  width: 100%;
  height: 100%;
  @include flex(column, stretch, stretch);

  .des {
    margin: 5px 0 15px 60px;
    font-size: 18px;
    .item {
      margin-bottom: 5px;
    }
  }

  .content {
    flex: 1;
    @include flex(row, space-between, stretch);
    .chart {
      flex: 1;
    }
    .set {
      width: 35%;
      @include flex(column, stretch, center);
      .title {
        font-weight: 700;
        margin-bottom: 10px;
        font-size: 18px;
      }
      .img {
        box-shadow: 0 0 8px #929292;
        width: 70%;
      }
      .set__one {
        margin-top: 50px;
        .text {
          margin-bottom: 10px;
          font-size: 22px;
          @include flex(row, center, center);
        }
        .interval {
          margin: 0 15px;
        }
      }
      .set__two {
        margin-top: 40px;
        @include flex(column, center, center);
        .text {
          font-size: 22px;
          margin-bottom: 10px;
        }
      }
    }
  }

  .btn {
    @include flex(row, center, center);
    .btn__item {
      font-size: 28px;
    }
  }
}
</style>
