<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-12 21:31:50
 * @LastEditTime: 2023-11-20 09:56:43
 * @Description : 腹式呼吸训练-导出PDF
-->
<template>
  <div
    class="train-abdominal-respiration-pdf"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <!-- PDF区域 -->
    <div id="pdf" class="pdf-wrapper">
      <div class="top">
        <el-image class="logo" :src="logoSrc" fit="scale-down"></el-image>

        <div class="title">腹式呼吸训练报告</div>

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
            <div class="item">训练时长：{{ pdfData.trainTime }}</div>
            <div class="item">{{ advice }}</div>
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
  name: 'train-abdominal-respiration-pdf',

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

        midpoint: '', // 活动度中点
        trainTime: '', // 训练时长

        depthArray: [], // 数据数组
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
     * @description: 从后端通过 train_plan_record_id 获取一条训练数据
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
            this.pdfData.midpoint = data.result.midpoint
            this.pdfData.trainTime = data.result.trainTime
            this.pdfData.bgUpArray = JSON.parse(data.result.bgUpArray)
            this.pdfData.bgDownArray = JSON.parse(data.result.bgDownArray)

            this.pdfData.depthArray = JSON.parse(data.result.depthArray)
            this.pdfData.completion = data.result.completion

            this.pdfData.pdfTime = data.result.create_time

            /* 根据不同的评分动态变化显示 */
            if (this.pdfData.completion < 40) {
              this.advice = '腹式呼吸差，建议加强腹式呼气训练'
              this.lv = this.fourLv
              this.textLv = '差'
              this.colorLv = '#FA5151'
            } else if (
              this.pdfData.completion >= 40 &&
              this.pdfData.completion <= 59
            ) {
              this.advice = '腹式呼吸较差，建议加强腹式呼气训练'
              this.lv = this.threeLv
              this.textLv = '较差'
              this.colorLv = '#FFC300'
            } else if (
              this.pdfData.completion >= 60 &&
              this.pdfData.completion <= 79
            ) {
              this.advice = '腹式呼吸良好，建议加强腹式呼气训练'
              this.lv = this.twoLv
              this.textLv = '良好'
              this.colorLv = '#00B578'
            } else {
              this.advice = '腹式呼气优秀，建议加强静态训练'
              this.lv = this.oneLv
              this.textLv = '优秀'
              this.colorLv = '#07B9B9'
            }

            // 渲染图像
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
            `[腹式呼吸训练-PDF报告环节] ${err}。请确保网络连接正常！`,
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
      this.xData = []
      for (let i = 0; i < this.pdfData.trainTime * 10; i++) {
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
          min: this.pdfData.midpoint - 10 >= 0 ? this.pdfData.midpoint - 10 : 0,
          max: this.pdfData.midpoint + 10
        },
        legend: {},
        series: [
          {
            name: '轨迹',
            data: this.pdfData.depthArray,
            color: 'red',
            type: 'line',
            smooth: true,
            showSymbol: false
          },
          {
            name: `上限曲线(${this.pdfData.midpoint + 5})`,
            data: this.pdfData.bgUpArray,
            color: 'green',
            type: 'line',
            smooth: false,
            showSymbol: false
          },
          {
            name: `下限曲线(${this.pdfData.midpoint - 5})`,
            data: this.pdfData.bgDownArray,
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
     * @description: 保存PDF
     */
    handlePdf() {
      this.$htmlToPdf(
        'pdf',
        `腹式呼吸训练报告 ${this.$moment().format('YYYY-MM-DD HH_mm_ss')}`,
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
.train-abdominal-respiration-pdf {
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
