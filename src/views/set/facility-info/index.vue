<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-07 17:51:54
 * @LastEditTime: 2022-12-08 14:50:03
 * @Description : 设备信息
-->
<template>
  <div class="facility-info">
    <div class="wrapper">
      <el-page-header
        class="page"
        title="返回首页"
        content="设备信息"
        @back="handleToHome"
      ></el-page-header>

      <el-descriptions class="descriptions" :column="2" border>
        <!-- 设备编号 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-cpu"></i>
            设备编号
          </template>
          <el-tag class="text" type="success">{{
            this.$store.state.facilityID
          }}</el-tag>
        </el-descriptions-item>

        <!-- 联系方式 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            联系方式
          </template>
          <el-tag class="text">0750-6318728</el-tag>
        </el-descriptions-item>

        <!-- 设备到期时间 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            设备到期时间
          </template>
          <el-tag class="text" type="danger">{{
            this.$store.state.facilityDeadline
          }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
export default {
  name: 'facility-info',

  methods: {
    /**
     * @description: 回到首页
     */
    handleToHome() {
      this.$router.push({
        path: '/home'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.facility-info {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 86%;
    height: 90%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 40px;
    @include flex(column, center, center);
    position: relative;

    .page {
      position: absolute;
      top: 20px;
      left: 30px;
    }

    .descriptions {
      width: 70%;
      .text {
        font-size: 20px;
      }
    }
  }
}
</style>
