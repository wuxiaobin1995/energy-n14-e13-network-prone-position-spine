<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-09 21:39:41
 * @LastEditTime: 2022-12-12 17:56:44
 * @Description : 腹式呼吸训练-参数设置
-->
<template>
  <div class="abdominal-respiration-set">
    <div class="des">
      <div class="item">
        训练目的：进行腹式呼吸训练，加强腹横肌收缩能力，修复腹直肌分离，摆脱水桶腰，缓解肩颈疼痛
      </div>
      <div class="item">
        动作要求：首先鼻吸气腹部隆起，随后嘴呼气，同时控制腰腹部向下压紧床面且能触及侧腹部肌肉明显收紧，过程中保持肩部和臀部紧贴软垫，重复至训练结束
      </div>
      <div class="item">提示：从中点开始预备</div>
    </div>

    <div class="content">
      <div class="chart">
        <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
      </div>
      <div class="set">
        <!-- 训练目标 -->
        <div class="set__one">
          <span class="text">训练目标</span>
          <el-input-number
            v-model="target"
            :precision="0"
            :step="1"
            :min="targetDown + 5"
            :max="midpoint - 5"
            @change="handleTargetChange"
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
        <!-- 保持时间 -->
        <div class="set__three">
          <span class="text">保持时间</span>
          <el-input-number
            v-model="keepTime"
            :precision="0"
            :step="1"
            :min="1"
            :max="3"
            @change="handleKeepTimeChange"
          ></el-input-number>
        </div>
        <!-- 休息时间 -->
        <div class="set__four">
          <span class="text">休息时间</span>
          <el-input-number
            v-model="restTime"
            :precision="0"
            :step="1"
            :min="1"
            :max="3"
            @change="handleRestTimeChange"
          ></el-input-number>
        </div>
      </div>
    </div>

    <div class="btn">
      <el-button class="item" type="primary" @click="handleStart"
        >开始训练</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'abdominal-respiration-set',

  data() {
    return {
      /* 图形相关变量 */
      myChart: null,
      option: {},
      xData: [], // x轴

      /* 其他 */
      targetUp: this.$store.state.bothFlexibility.maxDepth,
      targetDown: this.$store.state.bothFlexibility.minDepth,

      target: this.$store.state.bothFlexibility.minDepth + 5, // 训练目标
      num: 5, // 训练个数，5~20
      keepTime: 2, // 保持时间，1~3
      restTime: 2, // 休息时间，1~3

      standardArray: [], // 基础参考曲线
      bgArray: [] // 参考曲线，暂定5个一组
    }
  },

  mounted() {
    this.countChart().then(() => {
      this.initChart()
    })
  },

  computed: {
    // 中点
    midpoint() {
      return parseInt(((this.targetUp + this.targetDown) / 2).toFixed(0))
    }
  },

  methods: {
    /**
     * @description: 计算图形所需参数逻辑函数
     */
    countChart() {
      return new Promise((resolve, reject) => {
        /* 绘制参考曲线逻辑 */
        const midpoint = this.midpoint // 中点
        const target = this.target // 目标
        const restTime = this.restTime // 休息时间
        const keepTime = this.keepTime // 保持时间

        const restTimeArray = []
        for (let i = 0; i < restTime * 10 + 1; i++) {
          restTimeArray.push(midpoint)
        }

        const interval = parseFloat(((midpoint - target) / 10).toFixed(3)) // 间隔值

        const downArray = []
        let downSum = midpoint
        for (let i = 0; i < 9; i++) {
          downSum = downSum - interval
          downArray.push(downSum)
        }

        const keepTimeArray = []
        for (let i = 0; i < keepTime * 10 + 1; i++) {
          keepTimeArray.push(target)
        }

        const upArray = []
        let upSum = target
        for (let i = 0; i < 9; i++) {
          upSum = upSum + interval
          upArray.push(upSum)
        }

        this.standardArray = restTimeArray.concat(
          downArray,
          keepTimeArray,
          upArray
        )

        this.bgArray = []
        for (let i = 0; i < 5; i++) {
          this.bgArray.push(...this.standardArray)
        }

        /* x轴 */
        this.xData = []
        for (let i = 0; i < this.bgArray.length; i++) {
          this.xData.push(parseFloat((i * 0.1).toFixed(1)))
        }

        resolve()
      })
    },

    /**
     * @description: 初始化echarts图形
     */
    initChart() {
      this.myChart = this.$echarts.init(document.getElementById('chart'))
      this.option = {
        xAxis: {
          type: 'category',
          name: '秒',
          data: this.xData,
          boundaryGap: false // 从0点开始
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false // 隐藏背景网格线
          },
          max: this.midpoint + 10,
          min: this.targetDown - 10 >= 0 ? this.targetDown - 10 : 0
        },
        legend: {},
        // tooltip: {},
        series: [
          {
            name: '参考曲线',
            data: this.bgArray,
            color: 'green',
            type: 'line',
            smooth: false,
            showSymbol: false
          }
        ],
        animation: false
      }
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 训练目标改变触发
     */
    handleTargetChange() {
      this.countChart().then(() => {
        this.option.xAxis.data = this.xData
        this.option.series[0].data = this.bgArray
        this.myChart.setOption(this.option)
      })
    },
    /**
     * @description: 保持时间改变触发
     */
    handleKeepTimeChange() {
      this.countChart().then(() => {
        this.option.xAxis.data = this.xData
        this.option.series[0].data = this.bgArray
        this.myChart.setOption(this.option)
      })
    },
    /**
     * @description: 休息时间改变触发
     */
    handleRestTimeChange() {
      this.countChart().then(() => {
        this.option.xAxis.data = this.xData
        this.option.series[0].data = this.bgArray
        this.myChart.setOption(this.option)
      })
    },

    /**
     * @description: 开始训练按钮
     */
    handleStart() {
      this.$router.push({
        path: '/abdominal-respiration-measure',
        query: {
          midpoint: JSON.stringify(this.midpoint),
          target: JSON.stringify(this.target),
          num: JSON.stringify(this.num),
          restTime: JSON.stringify(this.restTime),
          keepTime: JSON.stringify(this.keepTime)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.abdominal-respiration-set {
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
      @include flex(column, center, center);
      .set__one {
        margin-bottom: 50px;
        .text {
          margin-right: 10px;
          font-size: 22px;
        }
      }
      .set__two {
        margin-bottom: 50px;
        .text {
          margin-right: 10px;
          font-size: 22px;
        }
      }
      .set__three {
        margin-bottom: 50px;
        .text {
          margin-right: 10px;
          font-size: 22px;
        }
      }
      .set__four {
        .text {
          margin-right: 10px;
          font-size: 22px;
        }
      }
    }
  }

  .btn {
    @include flex(row, center, center);
    .item {
      font-size: 28px;
    }
  }
}
</style>
