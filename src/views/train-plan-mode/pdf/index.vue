<!--
 * @Author      : Mr.bin
 * @Date        : 2023-06-05 16:25:35
 * @LastEditTime: 2023-11-09 09:50:48
 * @Description : 方案报告-导出PDF
-->
<template>
  <div class="plan-pdf" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="wrapper" v-if="trainType.includes('腹式呼吸训练')">
      <top :data="top" />
      <abdominal-respiration :data="abdominalRespirationData" />
    </div>

    <div class="wrapper" v-if="trainType.includes('活动度训练')">
      <top :data="top" />
      <activity-improvement :data="activityImprovementData" />
    </div>

    <div class="wrapper" v-if="trainType.includes('内核心激活训练')">
      <top :data="top" />
      <stabilizer-activation :data="stabilizerActivationData" />
    </div>

    <div class="wrapper" v-if="trainType.includes('本体感觉训练')">
      <top :data="top" />
      <deep-sensory :data="deepSensoryData" />
    </div>

    <div class="wrapper" v-if="trainType.includes('静态稳定训练')">
      <top :data="top" />
      <static :data="staticData" />
    </div>

    <div class="wrapper" v-if="trainType.includes('动态稳定训练')">
      <top :data="top" />
      <dynamic :data="dynamicData" />
    </div>

    <!-- 按钮组 -->
    <div class="btn-print btn">
      <el-button type="primary" class="item" @click="handlePrint"
        >打 印</el-button
      >
      <el-button type="danger" class="item" @click="handleGoBack"
        >返 回</el-button
      >
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

/* 子组件 */
import Top from '@/views/train-plan-mode/pdf/components/Top'
import AbdominalRespiration from '@/views/train-plan-mode/pdf/components/AbdominalRespiration'
import ActivityImprovement from '@/views/train-plan-mode/pdf/components/ActivityImprovement'
import StabilizerActivation from '@/views/train-plan-mode/pdf/components/StabilizerActivation'
import DeepSensory from '@/views/train-plan-mode/pdf/components/DeepSensory'
import Static from '@/views/train-plan-mode/pdf/components/Static'
import Dynamic from '@/views/train-plan-mode/pdf/components/Dynamic'

export default {
  name: 'plan-pdf',

  components: {
    Top, // 顶部信息
    AbdominalRespiration, // 腹式呼吸训练
    ActivityImprovement, // 活动度训练
    StabilizerActivation, // 内核心激活训练
    DeepSensory, // 本体感觉训练
    Static, // 静态稳定训练
    Dynamic // 动态稳定训练
  },

  data() {
    return {
      /* 路由传参 */
      dataId: JSON.parse(this.$route.query.dataId),
      routerName: JSON.parse(this.$route.query.routerName),

      fullscreenLoading: false, // 全屏加载

      /* 处理后的数据 */
      trainType: [],

      top: {},

      abdominalRespirationData: {},
      activityImprovementData: {},
      stabilizerActivationData: {},
      deepSensoryData: {},
      staticData: {},
      dynamicData: {}
    }
  },

  created() {
    this.getPlanData()
  },

  methods: {
    /**
     * @description: 从后端通过 train_plan_record_id 获取一条方案数据
     */
    getPlanData() {
      this.fullscreenLoading = true
      this.$axios
        .post('/getOneTrainPlanRecord_v3', {
          train_plan_record_id: this.dataId
        })
        .then(res => {
          const data = res.data
          if (data.status === 1) {
            /* 成功 */
            this.top.userName = data.result.user_name
            this.top.sex = data.result.sex === 1 ? '男' : '女'
            this.top.pdfTime = data.result.create_time
            this.top.type = data.result.type
            const planDataArray = JSON.parse(data.result.planDataArray)

            for (let i = 0; i < planDataArray.length; i++) {
              const type = planDataArray[i].type
              this.trainType.push(type)

              const obj = planDataArray[i]
              if (type === '腹式呼吸训练') {
                this.abdominalRespirationData = obj
              } else if (type === '活动度训练') {
                this.activityImprovementData = obj
              } else if (type === '内核心激活训练') {
                this.stabilizerActivationData = obj
              } else if (type === '本体感觉训练') {
                this.deepSensoryData = obj
              } else if (type === '静态稳定训练') {
                this.staticData = obj
              } else if (type === '动态稳定训练') {
                this.dynamicData = obj
              }
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
                this.getPlanData()
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
            `[方案报告-PDF报告环节] ${err}。请确保网络连接正常！`,
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
              this.getPlanData()
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
     * @description: 打印报告
     */
    handlePrint() {
      window.print()
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
/* 打印时触发的CSS */
@media print {
  @page {
    // size: portrait; // 纵向打印
    size: landscape; // 横向打印
  }
  .btn-print {
    display: none !important;
  }
}

.plan-pdf {
  width: 100%;

  .wrapper {
    width: 100%;
    height: 100vh; // 若打印布局有问题，调整此值
    border-bottom: 1px solid black;
  }

  .btn {
    @include flex(row, center, center);
    .item {
      margin: 10px 50px;
      font-size: 30px;
    }
  }
}
</style>
