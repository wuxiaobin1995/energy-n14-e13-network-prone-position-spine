<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-12 21:31:50
 * @LastEditTime: 2023-10-25 17:22:03
 * @Description : 活动度训练-导出PDF
-->
<template>
  <div
    class="train-activity-improvement-pdf"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <!-- PDF区域 -->
    <div id="pdf" class="pdf-wrapper">
      <div class="top">
        <el-image class="logo" :src="logoSrc" fit="scale-down"></el-image>

        <div class="title">活动度训练报告</div>

        <div class="divider"></div>

        <div class="info">
          <div class="item">{{ hospital }}</div>
          <div class="item">姓名：{{ pdfData.userName }}</div>
          <div class="item">性别：{{ pdfData.sex }}</div>
          <div class="item">训练日期：{{ pdfData.pdfTime }}</div>
        </div>

        <div class="divider"></div>
      </div>

      <div class="main">
        <div class="chart">
          <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
        </div>

        <div class="other">
          <el-image :src="lv" fit="scale-down"></el-image>
          <div class="val">
            <div class="title" :style="{ color: colorLv }">{{ textLv }}</div>
            <div class="item">综合训练评分：{{ pdfData.completion }}分</div>
            <div class="item">训练次数：{{ pdfData.num }}</div>
            <div class="item">训练组数：{{ pdfData.groups }}</div>
            <div class="item">间隔时长：{{ pdfData.intervalTime }}秒</div>
            <div class="item">组间休息时长：{{ pdfData.groupRestTime }}秒</div>
            <div class="advice">{{ advice }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button class="item" type="primary" @click="handlePdf"
        >保存PDF</el-button
      >
      <el-button class="item" type="warning" @click="handleGoBack"
        >返 回</el-button
      >
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'train-activity-improvement-pdf',

  data() {
    return {
      /* 路由传参 */
      dataId: JSON.parse(this.$route.query.dataId),
      routerName: JSON.parse(this.$route.query.routerName),

      /* 图形相关变量 */
      myChart: null,
      option: {},
      xData: [], // 横坐标数组

      /* 其他 */
      fullscreenLoading: false,

      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标
      lv: require('@/assets/img/Train/PDF/优秀.png'),
      oneLv: require('@/assets/img/Train/PDF/优秀.png'), // 优秀
      twoLv: require('@/assets/img/Train/PDF/良好.png'), // 良好
      threeLv: require('@/assets/img/Train/PDF/较差.png'), // 较差
      fourLv: require('@/assets/img/Train/PDF/差.png'), // 差
      textLv: '',
      colorLv: '#000000',
      advice: '', // 建议

      pdfData: {
        userName: '',
        sex: '',

        targetUp: '', // 上限
        targetDown: '', // 下限

        num: '', // 训练次数
        groups: '', // 训练组数
        intervalTime: '', // 间隔时间
        groupRestTime: '', // 组间休息时长

        bgPdfArray: [], // 报告参考曲线数组

        comprehensiveArray: [], // 综合曲线轨迹
        completion: '', // 完成度

        pdfTime: ''
      },

      hospital: window.localStorage.getItem('hospital')
        ? window.localStorage.getItem('hospital')
        : '未设置医院'
    }
  },

  created() {
    this.getOnlyData()
  },

  methods: {
    /**
     * @description: 从后端通过 train_record_id 获取一条训练数据
     */
    getOnlyData() {
      this.fullscreenLoading = true
      this.$axios
        .post('/getOneTrainRecord_v3', {
          train_record_id: this.dataId
        })
        .then(res => {
          const data = res.data
          if (data.status === 1) {
            /* 成功 */
            this.pdfData.userName = data.result.user_name
            this.pdfData.sex = data.result.sex === 1 ? '男' : '女'

            this.pdfData.targetUp = data.result.targetUp
            this.pdfData.targetDown = data.result.targetDown
            this.pdfData.num = data.result.num
            this.pdfData.groups = data.result.groups
            this.pdfData.intervalTime = data.result.intervalTime
            this.pdfData.groupRestTime = data.result.groupRestTime

            this.pdfData.bgPdfArray = JSON.parse(data.result.bgPdfArray)

            this.pdfData.comprehensiveArray = JSON.parse(
              data.result.comprehensiveArray
            )
            this.pdfData.completion = data.result.completion

            this.pdfData.pdfTime = data.result.create_time

            /* 根据不同的评分动态变化显示 */
            if (this.pdfData.completion < 40) {
              this.advice = '腰椎灵活性差，建议加强活动度训练'
              this.lv = this.fourLv
              this.textLv = '差'
              this.colorLv = '#FA5151'
            } else if (
              this.pdfData.completion >= 40 &&
              this.pdfData.completion <= 59
            ) {
              this.advice = '腰椎灵活性较差，建议加强活动度训练'
              this.lv = this.threeLv
              this.textLv = '较差'
              this.colorLv = '#FFC300'
            } else if (
              this.pdfData.completion >= 60 &&
              this.pdfData.completion <= 79
            ) {
              this.advice = '腰椎灵活性良好，建议加强活动度训练'
              this.lv = this.twoLv
              this.textLv = '良好'
              this.colorLv = '#00B578'
            } else {
              this.advice = '腰椎灵活性优秀，建议加强静态训练'
              this.lv = this.oneLv
              this.textLv = '优秀'
              this.colorLv = '#07B9B9'
            }

            /* 渲染图形 */
            this.initChart()
          } else if (data.status === 0) {
            /* 失败 */
            this.$confirm(
              `[状态码为 ${data.status}] 获取数据失败，请重试！`,
              '警告',
              {
                type: 'error',
                center: true,
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                confirmButtonText: '重 试',
                cancelButtonText: '返 回'
              }
            )
              .then(() => {
                this.getOnlyData()
              })
              .catch(() => {
                this.handleGoBack()
              })
          } else if (data.status === -11) {
            /* 传参错误 */
            this.$alert(
              `[状态码为 ${data.status}] [${data.message}] 传参错误，请重启软件！`,
              '警告',
              {
                type: 'error',
                showClose: false,
                confirmButtonText: '关闭软件',
                callback: () => {
                  ipcRenderer.send('close') // 关闭整个程序
                }
              }
            )
          }
        })
        .catch(err => {
          this.$confirm(
            `[活动度训练-PDF报告环节] ${err}。请确保网络连接正常！`,
            '网络请求错误',
            {
              type: 'error',
              center: true,
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              confirmButtonText: '刷新页面',
              cancelButtonText: '返 回'
            }
          )
            .then(() => {
              this.getOnlyData()
            })
            .catch(() => {
              this.handleGoBack()
            })
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    },

    /**
     * @description: 初始化echarts图形
     */
    initChart() {
      /* x轴 */
      for (let i = 0; i < this.pdfData.comprehensiveArray.length; i++) {
        this.xData.push(parseFloat((i * 0.1).toFixed(1)))
      }

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
          min:
            this.pdfData.targetDown - 10 >= 0
              ? this.pdfData.targetDown - 10
              : 0,
          max:
            this.pdfData.targetUp + 10 <= 100 ? this.pdfData.targetUp + 10 : 100
        },
        legend: {},
        series: [
          {
            name: '运动轨迹',
            data: this.pdfData.comprehensiveArray,
            color: 'red',
            type: 'line',
            smooth: true,
            showSymbol: false
          },
          {
            name: `参考曲线(${this.pdfData.targetDown}~${this.pdfData.targetUp})`,
            data: this.pdfData.bgPdfArray,
            color: 'rgba(0, 255, 0, 0.5)',
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
     * @description: 保存PDF
     */
    handlePdf() {
      this.$htmlToPdf(
        'pdf',
        `活动度训练报告 ${this.$moment().format('YYYY-MM-DD HH_mm_ss')}`,
        500
      )
    },

    /**
     * @description: 返回上一页
     */
    handleGoBack() {
      this.$router.push({
        path: this.routerName
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.train-activity-improvement-pdf {
  width: 100vw;
  height: 100vh;
  padding: 10px;
  @include flex(column, stretch, stretch);

  /* PDF区域 */
  .pdf-wrapper {
    flex: 1;
    @include flex(column, stretch, stretch);

    .top {
      position: relative;
      @include flex(column, stretch, center);
      .logo {
        position: absolute;
        top: 10px;
        right: 5px;
        width: 180px;
      }
      .title {
        font-size: 50px;
      }
      .divider {
        margin-top: 15px;
        border: 1px solid rgb(204, 204, 204);
        width: 100%;
      }
      .info {
        width: 100%;
        margin-top: 15px;
        @include flex(row, space-around, center);
        .item {
          font-size: 20px;
        }
      }
    }

    .main {
      margin-top: 15px;
      flex: 1;
      @include flex(row, space-between, stretch);
      .chart {
        flex: 1;
      }
      .other {
        @include flex(row, space-between, center);
        width: 360px;
        margin-right: 20px;
        .val {
          width: 240px;
          font-size: 20px;
          font-weight: 700;
          .title {
            font-size: 46px;
            margin-bottom: 30px;
          }
          .item {
            margin-bottom: 3px;
          }
        }
      }
    }
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    margin: 20px 0;
    .item {
      font-size: 28px;
      margin: 0 50px;
    }
  }
}
</style>
