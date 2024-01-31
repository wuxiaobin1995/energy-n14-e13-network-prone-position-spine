<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-08 16:13:32
 * @LastEditTime: 2024-01-12 17:10:34
 * @Description : 活动度测试-测量页面
-->
<template>
  <div
    class="test-flexibility-measure"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div class="wrapper">
      <!-- 左半部 -->
      <div class="left">
        <div class="top">
          <div class="title">活动度测试</div>
          <div class="text">
            <div class="item">
              缓慢上抬腰腹部至最高，随后缓慢下压至最低，重复3次
            </div>
            <div class="item">注意：保持肩部和臀部紧贴软垫</div>
          </div>
        </div>

        <div class="chart">
          <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
        </div>

        <div class="btn">
          <el-button
            class="item"
            plain
            type="primary"
            :disabled="isOpened"
            @click="handleStart"
            >开 始</el-button
          >
          <el-button
            class="item"
            plain
            type="danger"
            :disabled="!isOpened"
            @click="handleFinish"
            >结 束</el-button
          >
          <el-button
            class="item"
            type="success"
            :disabled="!isFinished"
            @click="handleToPdf"
            >查看报告</el-button
          >
          <el-button class="item" plain type="info" @click="handleRefresh"
            >刷新页面</el-button
          >
          <el-button class="item" plain type="warning" @click="handleGoBack"
            >返 回</el-button
          >
        </div>
      </div>

      <!-- 右半部 -->
      <div class="right">
        <div class="text">示意动作</div>
        <div class="img">
          <el-image
            :src="imgSrc"
            fit="scale-down"
            @click.native="handleAmplify"
          ></el-image>
        </div>

        <div class="result">
          <div>活动度：{{ flexibility ? flexibility : '待测量' }}</div>
          <div :style="{ 'margin-top': '20px', color: 'green' }">
            推荐值：30~40
          </div>
        </div>
      </div>

      <!-- 图示放大弹窗 -->
      <el-dialog
        title="图 示"
        :visible.sync="imgDialogVisible"
        width="30%"
        center
      >
        <div class="img-dialog">
          <el-image :src="imgSrc" fit="scale-down"></el-image>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* 串口通信库 */
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

import { ipcRenderer } from 'electron'

export default {
  name: 'test-flexibility-measure',

  data() {
    return {
      /* 串口相关变量 */
      usbPort: null,
      parser: null,
      scmBaudRate: 115200, // 默认波特率115200

      /* 图形相关变量 */
      myChart: null,
      option: {},
      xData: [], // 横坐标数组

      /* 控制相关 */
      isOpened: false, // 是否串口开启成功
      isFinished: false, // 是否完成该次测试

      /* 其他 */
      imgSrc: require('@/assets/img/Test/Flexibility/活动度测试-动作展示.gif'),
      fullscreenLoading: false,

      imgDialogVisible: false, // 图示弹窗

      depthArray: [], // 数据数组
      flexibility: '', // 活动度
      dataId: '' // 后端数据库中数据的唯一id
    }
  },

  created() {
    this.initSerialPort()
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    // 关闭串口
    if (this.usbPort) {
      if (this.usbPort.isOpen) {
        this.usbPort.close()
      }
    }
  },

  methods: {
    /**
     * @description: 图示放大
     */
    handleAmplify() {
      this.imgDialogVisible = true
    },

    /**
     * @description: 初始化串口对象
     */
    initSerialPort() {
      SerialPort.list()
        .then(ports => {
          /* 遍历设备的USB串口，目标设备需安装驱动 */
          let comPath = ''
          for (const port of ports) {
            if (/^USB/.test(port.pnpId)) {
              comPath = port.path
              break
            }
          }

          /* 验证USB有没有连接到电脑，但不能验证有无数据发送给上位机 */
          if (comPath) {
            /**
             * @description: 创建串口实例
             * @param {String} comPath 串行端口的系统路径。例如：在Mac、Linux上的/dev/tty.XXX或Windows上的COM1
             * @param {Object} 配置项
             */
            this.usbPort = new SerialPort(comPath, {
              baudRate: this.scmBaudRate,
              autoOpen: false // 是否自动开启串口
            })
            /* 调用 this.usbPort.open() 成功时触发（开启串口成功） */
            this.usbPort.on('open', () => {
              this.isOpened = true
            })
            /* 调用 this.usbPort.open() 失败时触发（开启串口失败） */
            this.usbPort.on('error', () => {
              this.$confirm(
                `请重新连接USB线，然后点击"刷新页面"按钮！`,
                '串口开启失败',
                {
                  type: 'error',
                  showClose: false,
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  center: true,
                  confirmButtonText: '刷新页面',
                  cancelButtonText: '返回上一页'
                }
              )
                .then(() => {
                  this.handleRefresh()
                })
                .catch(() => {
                  this.handleGoBack()
                })
            })

            this.parser = this.usbPort.pipe(new Readline({ delimiter: '\n' }))
            this.parser.on('data', data => {
              const depth = parseInt(data)
              /* 只允许正整数和0，且[0, 100] */
              if (/^-?[0-9]\d*$/.test(depth) && depth >= 0 && depth <= 100) {
                this.depthArray.push(depth)
                // 渲染图形
                this.option.series[0].data = this.depthArray
                this.myChart.setOption(this.option)
                // 完成
                if (this.depthArray.length === 250) {
                  this.saveData()
                }
              }
            })
          } else {
            this.$confirm(
              `请重新连接USB线，然后点击"刷新页面"按钮！`,
              '没有检测到USB连接',
              {
                type: 'error',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                center: true,
                confirmButtonText: '刷新页面',
                cancelButtonText: '返回上一页'
              }
            )
              .then(() => {
                this.handleRefresh()
              })
              .catch(() => {
                this.handleGoBack()
              })
          }
        })
        .catch(err => {
          this.$confirm(
            `${err}。请重新连接USB线，然后点击"刷新页面"按钮！`,
            `初始化SerialPort.list失败`,
            {
              type: 'error',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              center: true,
              confirmButtonText: '刷新页面',
              cancelButtonText: '返回上一页'
            }
          )
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.handleGoBack()
            })
        })
    },

    /**
     * @description: 初始化echarts图形
     */
    initChart() {
      // 计算横坐标数组
      this.xData = []
      for (let i = 0; i < 250; i++) {
        this.xData.push(parseFloat((i * 0.1).toFixed(1)))
      }

      this.myChart = this.$echarts.init(document.getElementById('chart'))
      this.option = {
        xAxis: {
          type: 'category',
          name: '秒',
          data: this.xData
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100
        },
        series: [
          {
            data: [],
            type: 'line',
            areaStyle: {
              color: 'rgba(174, 217, 206, 1)'
            },
            lineStyle: {
              color: 'rgba(43, 151, 122, 1)'
            },
            smooth: true,
            showSymbol: false
          }
        ],
        animation: false
      }

      this.myChart.setOption(this.option)
    },

    /**
     * @description: 测试完成逻辑函数
     */
    saveData() {
      if (this.usbPort) {
        if (this.usbPort.isOpen) {
          this.usbPort.close()

          this.isOpened = false

          // 计算上限、下限、活动度
          const maxDepth = Math.max(...this.depthArray)
          const minDepth = Math.min(...this.depthArray)
          this.flexibility = maxDepth - minDepth

          /* 保存到云端 */
          this.fullscreenLoading = true
          const facilityID = window.localStorage.getItem('facilityID')
          this.$axios
            .post('/saveTestRecord_v3', {
              devices_name: facilityID,
              user_id: this.$store.state.currentUserInfo.userId,
              flexibility: this.flexibility, // 活动度
              maxDepth: maxDepth, // 上限
              minDepth: minDepth, // 下限
              type: 'flexibility'
            })
            .then(res => {
              const data = res.data
              if (data.status === 1) {
                /* 成功 */
                this.dataId = data.result.test_record_id
                this.isFinished = true // 允许点击查看报告按钮
                this.$message({
                  message: `[状态码为 ${data.status}] 数据保存成功`,
                  type: 'success',
                  duration: 2000
                })
                this.$store
                  .dispatch('setBothFlexibility', {
                    maxDepth: maxDepth,
                    minDepth: minDepth
                  })
                  .catch(() => {
                    this.$alert(
                      `设置最大、最小灵活度Vuex失败，请重新测试！`,
                      '警告',
                      {
                        type: 'error',
                        center: false,
                        showClose: false,
                        confirmButtonText: '确 定',
                        callback: () => {}
                      }
                    )
                  })
              } else if (data.status === 0) {
                /* 失败 */
                this.$alert(
                  `[状态码为 ${data.status}] 数据保存失败，请点击"刷新页面"按钮，然后重新测试！`,
                  '警告',
                  {
                    type: 'error',
                    showClose: false,
                    confirmButtonText: '刷新页面',
                    callback: () => {
                      this.handleRefresh()
                    }
                  }
                )
              } else if (data.status === -6) {
                /* 该用户ID不存在 */
                this.$alert(
                  `[状态码为 ${data.status}] 该用户ID不存在，请重启软件！`,
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
              } else if (data.status === -9) {
                /* 该设备编号不存在 */
                this.$alert(
                  `[状态码为 ${data.status}] 该设备编号不存在，请重启软件！`,
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
              this.$alert(
                `[骨盆灵活度测试环节] ${err}。请确保网络连接正常，然后重新测试！`,
                '网络请求错误',
                {
                  type: 'error',
                  showClose: false,
                  confirmButtonText: '重新测试',
                  callback: () => {
                    this.handleRefresh()
                  }
                }
              )
            })
            .finally(() => {
              this.fullscreenLoading = false
            })
        }
      }
    },

    /**
     * @description: 开始按钮
     */
    handleStart() {
      this.isOpened = false
      this.isFinished = false
      this.depthArray = []
      this.flexibility = ''
      this.dataId = ''

      if (this.usbPort) {
        if (!this.usbPort.isOpen) {
          this.usbPort.open()
        }
      }
    },

    /**
     * @description: 结束按钮
     */
    handleFinish() {
      this.saveData()
    },

    /**
     * @description: 查看PDF按钮
     */
    handleToPdf() {
      this.$router.push({
        path: '/test-flexibility-pdf',
        query: {
          dataId: JSON.stringify(this.dataId),
          routerName: JSON.stringify('/test-flexibility-show')
        }
      })
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/test-flexibility-measure'),
          duration: JSON.stringify(300)
        }
      })
    },

    /**
     * @description: 返回上一页
     */
    handleGoBack() {
      this.$router.push({
        path: '/test-flexibility-show'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.test-flexibility-measure {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 96%;
    height: 94%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 26px 40px;
    @include flex(row, stretch, stretch);

    .left {
      flex: 1;
      @include flex(column, stretch, stretch);
      .top {
        @include flex(row, stretch, center);
        .title {
          font-size: 50px;
        }
        .text {
          font-size: 18px;
          margin-left: 50px;
          .item {
            margin-top: 4px;
          }
        }
      }
      .chart {
        flex: 1;
      }
      .btn {
        @include flex(row, center, center);
        .item {
          font-size: 28px;
          margin: 0 30px;
        }
      }
    }

    .right {
      @include flex(column, center, center);
      width: 300px;
      .text {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 10px;
      }
      .img {
        box-shadow: 0 0 8px #929292;
      }
      .result {
        margin-top: 12vh;
        font-size: 22px;
      }
    }

    .img-dialog {
      @include flex(row, center, center);
      transform: scale(2);
    }
  }
}
</style>
