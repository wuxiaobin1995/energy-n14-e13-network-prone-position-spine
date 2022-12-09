<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-09 21:12:48
 * @LastEditTime: 2022-12-09 21:37:43
 * @Description : 活动度改善训练-参数设置
-->
<template>
  <div class="activity-improvement-set">
    <div class="des">
      <div class="text">
        <div class="text__item">训练目的：改善腰椎灵活性；</div>
        <div class="text__item">
          动作要求：吸气同时控制腰腹部缓慢向上抬至最高，上抬的过程中保持肩部和臀部紧贴软垫，随后呼气同时控制腰腹部缓慢向下压至最低，重复至训练结束。
        </div>
      </div>
    </div>

    <div class="content">
      <div class="chart">
        <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
      </div>
      <div class="set">
        <!-- 训练个数 -->
        <div class="set__one">
          <span class="text">训练个数</span>
          <el-input-number
            v-model="num"
            :precision="0"
            :step="1"
            :min="5"
            :max="20"
          ></el-input-number>
        </div>
        <!-- 间隔时间 -->
        <div class="set__two">
          <span class="text">间隔时间</span>
          <el-input-number
            v-model="intervalTime"
            :precision="0"
            :step="1"
            :min="2"
            :max="10"
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
  name: 'activity-improvement-set',

  data() {
    return {
      /* 图形相关变量 */
      myChart: null,
      option: {},

      /* 其他 */
      targetUp: this.$store.state.bothFlexibility.maxDepth,
      targetDown: this.$store.state.bothFlexibility.minDepth,
      num: 5, // 训练个数
      intervalTime: 4 // 间隔时间（秒）
    }
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
          max: this.targetUp + 10,
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
     * @description: 开始训练按钮
     */
    handleStart() {
      this.$router.push({
        path: '/',
        query: {
          targetUp: JSON.stringify(this.targetUp), // 上限
          targetDown: JSON.stringify(this.targetDown), // 下限
          num: JSON.stringify(this.num), // 训练个数
          intervalTime: JSON.stringify(this.intervalTime) // 间隔时间
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-improvement-set {
  width: 100%;
  height: 100%;
  @include flex(column, stretch, stretch);

  .des {
    .text {
      margin: 5px 0 15px 60px;
      font-size: 18px;
      .text__item {
        margin-bottom: 5px;
      }
    }
  }

  .content {
    flex: 1;
    @include flex(row, space-between, stretch);
    .chart {
      flex: 1;
    }
    .set {
      @include flex(column, center, center);
      .set__one {
        .text {
          font-size: 22px;
          margin-right: 10px;
        }
      }
      .set__two {
        margin-top: 50px;
        .text {
          font-size: 22px;
          margin-right: 10px;
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
