<!--
 * @Author      : Mr.bin
 * @Date        : 2022-10-17 17:38:01
 * @LastEditTime: 2022-12-14 11:06:46
 * @Description : home
-->
<template>
  <div class="home">
    <div class="wrapper">
      <div class="main-photo">
        <el-image class="item0" :src="src0" fit="scale-down"></el-image>
      </div>
      <div class="one">
        <el-image
          class="item item3"
          :src="src3"
          fit="scale-down"
          @click.native="handleClick('src3')"
        ></el-image>
      </div>
      <div class="two">
        <el-image
          class="item item2"
          :src="src2"
          fit="scale-down"
          @click.native="handleClick('src2')"
        ></el-image>
        <el-image
          class="item item4"
          :src="src4"
          fit="scale-down"
          @click.native="handleClick('src4')"
        ></el-image>
      </div>
      <div class="three">
        <el-image
          class="item item1"
          :src="src1"
          fit="scale-down"
          @click.native="handleClick('src1')"
        ></el-image>
        <el-image
          class="item item5"
          :src="src5"
          fit="scale-down"
          @click.native="handleClick('src5')"
        ></el-image>
      </div>

      <!-- 数据记录选择弹窗 -->
      <el-dialog
        :visible.sync="centerDialogVisible"
        width="45%"
        center
        top="35vh"
        :show-close="false"
      >
        <div class="record-select-wrapper">
          <el-button class="btn" type="success" @click="handleGoTestRecord"
            >测试记录</el-button
          >
          <el-button class="btn" type="primary" @click="handleGoTrainRecord"
            >训练记录</el-button
          >
        </div>
      </el-dialog>

      <!-- 语音相关 -->
      <div class="audio-control">
        <div class="title">语音功能</div>
        <el-switch
          v-model="switchValue"
          active-text="开"
          inactive-text="关"
          @change="handleSwitchChange"
        >
        </el-switch>
      </div>
    </div>

    <!-- 设备信息 -->
    <div class="foot__info">
      <span class="foot__info--item">
        设备编号：{{
          this.$store.state.facilityID ? this.$store.state.facilityID : '未注册'
        }}
      </span>
      <span class="foot__info--item">
        设备期限：{{
          this.$store.state.facilityDeadline
            ? this.$store.state.facilityDeadline
            : '无'
        }}
      </span>
    </div>

    <!-- 打开控制台按钮 -->
    <el-button
      class="btn-control"
      type="info"
      size="mini"
      @click="handleOpenDev"
      >Open Dev</el-button
    >
  </div>
</template>

<script>
/* 用于打开控制台 */
import { remote } from 'electron'

export default {
  name: 'home',

  data() {
    return {
      src0: require('@/assets/img/Home/设备实物.png'),
      src1: require('@/assets/img/Home/用户.png'),
      src2: require('@/assets/img/Home/测试模块.png'),
      src3: require('@/assets/img/Home/训练模块.png'),
      src4: require('@/assets/img/Home/数据记录.png'),
      src5: require('@/assets/img/Home/游戏.png'),

      centerDialogVisible: false, // 数据记录选择弹窗

      /* 语音相关 */
      switchValue: null
    }
  },

  created() {
    this.switchValue = this.$store.state.voiceSwitch
  },

  methods: {
    /**
     * @description: 页面跳转
     * @param {String} src
     */
    handleClick(src) {
      if (src === 'src1') {
        this.$router.push({
          path: '/user'
        })
      } else if (src === 'src2') {
        if (this.$store.state.currentUserInfo.userId) {
          this.$router.push({
            path: '/test-flexibility-show'
          })
        } else {
          this.$confirm(
            `检测到您还没有选择用户，请先到用户页面进行选择！`,
            '提示',
            {
              type: 'warning',
              center: true,
              showCancelButton: false,
              confirmButtonText: '确 定'
            }
          )
            .then(() => {
              this.$router.push({
                path: '/user'
              })
            })
            .catch(() => {})
        }
      } else if (src === 'src3') {
        if (this.$store.state.currentUserInfo.userId) {
          if (
            this.$store.state.bothFlexibility.maxDepth !== null &&
            this.$store.state.bothFlexibility.minDepth !== null
          ) {
            this.$router.push({
              path: '/train-select/core-activation-set'
            })
          } else {
            this.$confirm(
              `检测到您没有最大和最小灵活度测量值，请先进行"骨盆灵活度测试"`,
              '提示',
              {
                type: 'warning',
                center: true,
                showCancelButton: false,
                confirmButtonText: '确 定'
              }
            )
              .then(() => {
                this.$router.push({
                  path: '/test-flexibility-show'
                })
              })
              .catch(() => {})
          }
        } else {
          this.$confirm(
            `检测到您还没有选择用户，请先到用户页面进行选择！`,
            '提示',
            {
              type: 'warning',
              center: true,
              showCancelButton: false,
              confirmButtonText: '确 定'
            }
          )
            .then(() => {
              this.$router.push({
                path: '/user'
              })
            })
            .catch(() => {})
        }
      } else if (src === 'src4') {
        if (this.$store.state.currentUserInfo.userId) {
          this.centerDialogVisible = true
        } else {
          this.$confirm(
            `检测到您还没有选择用户，请先到用户页面进行选择！`,
            '提示',
            {
              type: 'warning',
              center: true,
              showCancelButton: false,
              confirmButtonText: '确 定'
            }
          )
            .then(() => {
              this.$router.push({
                path: '/user'
              })
            })
            .catch(() => {})
        }
      } else if (src === 'src5') {
        if (this.$store.state.currentUserInfo.userId) {
          this.$router.push({
            path: '/game'
          })
        } else {
          this.$confirm(
            `检测到您还没有选择用户，请先到用户页面进行选择！`,
            '提示',
            {
              type: 'warning',
              center: true,
              showCancelButton: false,
              confirmButtonText: '确 定'
            }
          )
            .then(() => {
              this.$router.push({
                path: '/user'
              })
            })
            .catch(() => {})
        }
      }
    },

    /**
     * @description: 语音开关
     */
    handleSwitchChange() {
      if (this.switchValue === true) {
        this.$store.dispatch('setVoiceSwitch', true)
      } else {
        this.$store.dispatch('setVoiceSwitch', false)
      }
    },

    /**
     * @description: 打开控制台
     */
    handleOpenDev() {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^htpm$/,
        inputErrorMessage: '密码不正确',
        showClose: true,
        closeOnClickModal: false
      })
        .then(() => {
          try {
            remote.getCurrentWebContents().openDevTools()
          } catch (err) {
            this.$message({
              type: 'error',
              message: `打开控制台失败：${err}`
            })
          }
        })
        .catch(() => {})
    },

    /**
     * @description: 跳转至测试记录页
     */
    handleGoTestRecord() {
      this.$router.push({ path: '/test-record' })
    },
    /**
     * @description: 跳转至训练记录页
     */
    handleGoTrainRecord() {
      this.$router.push({ path: '/train-record' })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 86%;
    height: 90%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    position: relative;

    .item0 {
      width: 560px;
    }
    .item {
      width: 130px;
    }

    .main-photo {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
    }
    .one {
      margin-top: 30px;
      @include flex(row, center, center);
    }
    .two {
      @include flex(row, center, center);
      .item2 {
        margin-right: 260px;
      }
      .item4 {
        margin-left: 260px;
      }
    }
    .three {
      margin-top: 60px;
      @include flex(row, center, center);
      .item1 {
        margin-right: 420px;
      }
      .item5 {
        margin-left: 420px;
      }
    }

    /* 数据记录选择弹窗 */
    .record-select-wrapper {
      @include flex(row, space-around, center);
      .btn {
        font-size: 30px;
        margin-bottom: 15px;
      }
    }

    /* 语音相关 */
    .audio-control {
      @include flex(column, center, center);
      position: absolute;
      left: 30px;
      top: 20px;
      .title {
        margin-bottom: 10px;
        font-size: 22px;
        font-weight: 700;
      }
    }
  }

  /* 设备信息 */
  .foot__info {
    position: absolute;
    left: 10px;
    bottom: 5px;
    .foot__info--item {
      padding-right: 20px;
      color: green;
      font-weight: 700;
    }
  }

  /* 打开控制台按钮 */
  .btn-control {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
