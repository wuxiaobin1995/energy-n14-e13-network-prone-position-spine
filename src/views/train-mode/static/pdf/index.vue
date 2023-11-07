<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-12 21:31:50
 * @LastEditTime: 2023-11-06 17:11:53
 * @Description : 静态稳定训练-导出PDF
-->
<template>
  <div class="train-static-pdf" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- PDF区域 -->
    <div id="pdf" class="pdf-wrapper">
      <div class="top">
        <el-image class="logo" :src="logoSrc" fit="scale-down"></el-image>

        <div class="title">静态稳定训练-综合报告</div>

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
        <div class="left">
          <div class="item">
            <div class="text">训练目标：</div>
            <div class="val">{{ pdfData.target }}</div>
          </div>
          <div class="item">
            <div class="text">目标范围：</div>
            <div class="val">{{ pdfData.scope }}</div>
          </div>
          <div class="item">
            <div class="text">训练时长：</div>
            <div class="val">{{ pdfData.keepTime }}s</div>
          </div>
          <div class="item">
            <div class="text">组间休息时长：</div>
            <div class="val">{{ pdfData.groupRestTime }}s</div>
          </div>
          <div class="item">
            <div class="text">训练组数：</div>
            <div class="val">{{ pdfData.groups }}</div>
          </div>
          <div class="item">
            <div class="text">动作：</div>
            <div class="val">{{ pdfData.action }}</div>
          </div>
          <div class="item">
            <div class="text">训练评分：</div>
            <div class="val">{{ pdfData.completion }}</div>
          </div>
        </div>

        <div class="center">
          <table border="1" class="table">
            <tr :style="{ height: '40px' }" bgcolor="#E7E6E6" align="center">
              <th>训练组数</th>
              <th>训练完成度%</th>
            </tr>
            <tr
              :style="{ height: '30px' }"
              align="center"
              v-for="(item, index) in pdfData.completionResultArray"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item }}</td>
            </tr>
          </table>
        </div>

        <div class="right">
          <el-image :src="showSrc" fit="scale-down"></el-image>
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
  name: 'train-static-pdf',

  data() {
    return {
      /* 路由传参 */
      dataId: JSON.parse(this.$route.query.dataId),
      routerName: JSON.parse(this.$route.query.routerName),

      fullscreenLoading: false,
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标

      showSrc: require('@/assets/img/Train/Static/1.png'),
      oneSrc: require('@/assets/img/Train/Static/1.png'),
      twoSrc: require('@/assets/img/Train/Static/2.png'),
      threeSrc: require('@/assets/img/Train/Static/3.png'),

      pdfData: {
        userName: '',
        sex: '',

        scope: '', // 目标范围
        target: '', // 训练目标
        keepTime: '', // 训练时长
        groups: '', // 训练组数
        groupRestTime: '', // 组间休息时长
        action: '', // 动作

        completionResultArray: [], // 多组的完成度数组
        completion: '', // 平均完成度

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

            this.pdfData.scope = data.result.scope
            this.pdfData.target = data.result.target
            this.pdfData.keepTime = data.result.keepTime
            this.pdfData.groups = data.result.groups
            this.pdfData.groupRestTime = data.result.groupRestTime
            this.pdfData.action = data.result.action

            this.pdfData.completionResultArray = JSON.parse(
              data.result.completionResultArray
            )
            this.pdfData.completion = data.result.completion

            this.pdfData.pdfTime = data.result.create_time

            /* 根据不同的类型展示不同图片 */
            if (this.pdfData.action === '1') {
              this.showSrc = this.oneSrc
            } else if (this.pdfData.action === '2') {
              this.showSrc = this.twoSrc
            } else if (this.pdfData.action === '3') {
              this.showSrc = this.threeSrc
            }
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
            `[静态稳定训练-PDF报告环节] ${err}。请确保网络连接正常！`,
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
     * @description: 保存PDF
     */
    handlePdf() {
      this.$htmlToPdf(
        'pdf',
        `静态稳定训练-综合报告 ${this.$moment().format('YYYY-MM-DD HH_mm_ss')}`,
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
.train-static-pdf {
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
      flex: 1;
      @include flex(row, space-around, center);
      .left {
        @include flex(column, stretch, stretch);
        .item {
          @include flex(row, flex-start, center);
          margin-bottom: 25px;
          .text {
            font-size: 28px;
            font-weight: 700;
          }
          .val {
            font-size: 28px;
          }
        }
      }

      .center {
        .table {
          width: 350px;
          font-size: 22px;
        }
      }

      .right {
        width: 26%;
        @include flex(row, center, center);
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
