<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-08 17:55:19
 * @LastEditTime: 2023-11-08 15:15:39
 * @Description : 活动度测试-导出PDF
-->
<template>
  <div
    class="test-flexibility-pdf"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <!-- PDF区域 -->
    <div id="pdf" class="pdf-wrapper">
      <div class="top">
        <el-image class="logo" :src="logoSrc" fit="scale-down"></el-image>

        <div class="title">活动度测试报告</div>

        <div class="divider"></div>

        <div class="info">
          <div class="item">{{ hospital }}</div>
          <div class="item">姓名：{{ pdfData.userName }}</div>
          <div class="item">性别：{{ pdfData.sex }}</div>
          <div class="item">测试日期：{{ pdfData.pdfTime }}</div>
        </div>

        <div class="divider"></div>
      </div>

      <div class="main">
        <div class="score">
          <el-image :src="lv" fit="scale-down"></el-image>
          <div class="content">
            <div class="title" :style="{ color: colorLv }">{{ textLv }}</div>
            <div class="item">当前值：{{ pdfData.flexibility }}</div>
            <div class="item">推荐值：<span class="item-val">30~40</span></div>
          </div>
        </div>

        <div class="advice">
          <div class="title">建议：</div>
          <div class="item" v-if="textLv === '小' || textLv === '很小'">
            <span class="item-title">过低</span
            >：活动度过低，可能会出现弯腰活动受限或腰背酸痛等症状，首先需要首先进行内核心肌活和活动度改善，增加腰椎活动度的同时，掌握肌肉发力。
          </div>
          <div class="item" v-else-if="textLv === '适中'">
            <span class="item-title">适中</span
            >：活动度在正常范围内，建议加强训练，保持活动度。
          </div>
          <div class="item" v-else>
            <span class="item-title">过高</span
            >：活动度过高，与腰椎不稳、遗传等因素有关，可能会导致慢性腰痛、腰椎间盘突出、骶髂关节疼痛等问题，需要加强腰椎的静态训练和对骨盆的控制。
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
  name: 'test-flexibility-pdf',

  data() {
    return {
      /* 路由传参 */
      dataId: JSON.parse(this.$route.query.dataId),
      routerName: JSON.parse(this.$route.query.routerName),

      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司商标
      lv: require('@/assets/img/Test/Flexibility/PDF/很大.png'),
      oneLv: require('@/assets/img/Test/Flexibility/PDF/很大.png'), // 很大
      twoLv: require('@/assets/img/Test/Flexibility/PDF/大.png'), // 大
      threeLv: require('@/assets/img/Test/Flexibility/PDF/适中.png'), // 适中
      fourLv: require('@/assets/img/Test/Flexibility/PDF/小.png'), // 小
      fiveLv: require('@/assets/img/Test/Flexibility/PDF/很小.png'), // 很小
      textLv: '',
      colorLv: '#000000',

      fullscreenLoading: false,

      pdfData: {
        userName: '',
        sex: '',
        pdfTime: '',
        flexibility: ''
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
     * @description: 从后端通过 test_record_id 获取一条测试数据
     */
    getOnlyData() {
      this.fullscreenLoading = true
      this.$axios
        .post('/getOneTestRecord_v3', {
          test_record_id: this.dataId
        })
        .then(res => {
          const data = res.data
          if (data.status === 1) {
            /* 成功 */
            this.pdfData.userName = data.result.user_name
            this.pdfData.sex = data.result.sex === 1 ? '男' : '女'
            this.pdfData.pdfTime = data.result.create_time
            this.pdfData.flexibility = data.result.flexibility

            // 根据不同灵活度动态变化显示
            if (
              this.pdfData.flexibility >= 50 &&
              this.pdfData.flexibility <= 100
            ) {
              this.lv = this.oneLv
              this.textLv = '很大'
              this.colorLv = '#FA5151'
            } else if (
              this.pdfData.flexibility >= 40 &&
              this.pdfData.flexibility < 50
            ) {
              this.lv = this.twoLv
              this.textLv = '大'
              this.colorLv = '#FFC300'
            } else if (
              this.pdfData.flexibility >= 30 &&
              this.pdfData.flexibility < 40
            ) {
              this.lv = this.threeLv
              this.textLv = '适中'
              this.colorLv = '#00B578'
            } else if (
              this.pdfData.flexibility >= 20 &&
              this.pdfData.flexibility < 30
            ) {
              this.lv = this.fourLv
              this.textLv = '小'
              this.colorLv = '#FFC300'
            } else {
              this.lv = this.fiveLv
              this.textLv = '很小'
              this.colorLv = '#FA5151'
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
            `[骨盆灵活度测试-PDF报告环节] ${err}。请确保网络连接正常！`,
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
        `活动度测试报告 ${this.$moment().format('YYYY-MM-DD HH_mm_ss')}`,
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
.test-flexibility-pdf {
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
      @include flex(row, stretch, center);
      .score {
        width: 50%;
        padding-left: 6%;
        @include flex(row, center, center);
        .content {
          margin-left: 60px;
          .title {
            font-size: 70px;
            margin-bottom: 50px;
          }
          .item {
            margin-bottom: 20px;
            font-weight: 700;
            font-size: 18px;
            .item-val {
              color: green;
            }
          }
        }
      }

      .advice {
        width: 50%;
        padding-right: 6%;
        @include flex(column, center, stretch);
        .title {
          font-size: 48px;
          color: green;
        }
        .item {
          font-size: 28px;
          margin-top: 15px;
          .item-title {
            font-weight: 700;
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
