<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-09 16:54:56
 * @LastEditTime: 2024-01-04 15:13:50
 * @Description : 训练-项目选择
-->
<template>
  <div class="train-select">
    <div class="btn">
      <el-button
        class="item"
        :class="[isActiveAbdominalRespiration]"
        :icon="
          isActiveAbdominalRespiration === 'btn__active'
            ? 'el-icon-circle-check'
            : ''
        "
        type="primary"
        round
        @click="handleAbdominalRespiration"
        >腹式呼吸训练</el-button
      >

      <el-button
        class="item"
        :class="[isActiveActivityImprovement]"
        :icon="
          isActiveActivityImprovement === 'btn__active'
            ? 'el-icon-circle-check'
            : ''
        "
        type="danger"
        round
        @click="handleActivityImprovement"
        >活动度训练</el-button
      >

      <el-button
        class="item"
        :class="[isStabilizerActivation]"
        :icon="
          isStabilizerActivation === 'btn__active' ? 'el-icon-circle-check' : ''
        "
        type="warning"
        round
        @click="handleStabilizerActivation"
        >内核心激活训练</el-button
      >

      <el-button
        :style="{ display: 'none' }"
        class="item"
        :class="[isDeepSensory]"
        :icon="isDeepSensory === 'btn__active' ? 'el-icon-circle-check' : ''"
        type="success"
        round
        @click="handleDeepSensory"
        >本体感觉训练</el-button
      >

      <el-button
        class="item"
        :class="[isActiveStatic]"
        :icon="isActiveStatic === 'btn__active' ? 'el-icon-circle-check' : ''"
        type="info"
        round
        @click="handleStatic"
        >静态稳定训练</el-button
      >

      <el-button
        class="item"
        :class="[isActiveDynamic]"
        :icon="isActiveDynamic === 'btn__active' ? 'el-icon-circle-check' : ''"
        type="info"
        round
        @click="handleDynamic"
        >动态稳定训练</el-button
      >
    </div>

    <div class="wrapper">
      <transition mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'train-select',

  data() {
    return {
      /* 动态css */
      isActiveAbdominalRespiration: '',
      isActiveActivityImprovement: '',
      isStabilizerActivation: '',
      isDeepSensory: '',
      isActiveStatic: '',
      isActiveDynamic: ''
    }
  },

  watch: {
    '$route.path': {
      handler(newVal, oldval) {
        if (newVal === '/train-select/abdominal-respiration-set') {
          this.isActiveAbdominalRespiration = 'btn__active'
        } else {
          this.isActiveAbdominalRespiration = ''
        }
        if (newVal === '/train-select/activity-improvement-set') {
          this.isActiveActivityImprovement = 'btn__active'
        } else {
          this.isActiveActivityImprovement = ''
        }
        if (newVal === '/train-select/stabilizer-activation-set') {
          this.isStabilizerActivation = 'btn__active'
        } else {
          this.isStabilizerActivation = ''
        }
        if (newVal === '/train-select/deep-sensory-set') {
          this.isDeepSensory = 'btn__active'
        } else {
          this.isDeepSensory = ''
        }
        if (newVal === '/train-select/static-set') {
          this.isActiveStatic = 'btn__active'
        } else {
          this.isActiveStatic = ''
        }
        if (newVal === '/train-select/dynamic-set') {
          this.isActiveDynamic = 'btn__active'
        } else {
          this.isActiveDynamic = ''
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * @description: 腹式呼吸训练
     */
    handleAbdominalRespiration() {
      this.$router.push({ path: '/train-select/abdominal-respiration-set' })
    },

    /**
     * @description: 活动度训练
     */
    handleActivityImprovement() {
      this.$router.push({ path: '/train-select/activity-improvement-set' })
    },

    /**
     * @description: 内核心激活训练
     */
    handleStabilizerActivation() {
      this.$router.push({ path: '/train-select/stabilizer-activation-set' })
    },

    /**
     * @description: 本体感觉训练
     */
    handleDeepSensory() {
      this.$router.push({ path: '/train-select/deep-sensory-set' })
    },

    /**
     * @description: 静态稳定训练
     */
    handleStatic() {
      this.$router.push({ path: '/train-select/static-set' })
    },

    /**
     * @description: 动态稳定训练
     */
    handleDynamic() {
      this.$router.push({ path: '/train-select/dynamic-set' })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 路由过渡动效 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}

.train-select {
  width: 100%;
  height: 100%;
  position: relative;
  @include flex(row, center, center);

  .btn {
    position: absolute;
    left: -16px;
    top: 0;
    margin-top: 13px;
    @include flex(column, stretch, stretch);
    .item {
      margin: 6px 0;
      width: 190px;
      font-size: 22px;
    }
    .btn__active {
      width: 240px;
    }
  }

  .wrapper {
    width: 96%;
    height: 96%;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 20px 20px 20px 198px;
  }
}
</style>
