<!--
 * @Author      : Mr.bin
 * @Date        : 2022-12-12 21:31:50
 * @LastEditTime: 2022-12-13 11:58:34
 * @Description : 腹式呼吸训练-导出PDF
-->
<template>
  <div>腹式呼吸训练-导出PDF</div>
</template>

<script>
export default {
  name: 'train-abdominal-respiration-pdf',

  data() {
    return {
      /* 路由传参 */
      dataId: JSON.parse(this.$route.query.dataId),
      routerName: JSON.parse(this.$route.query.routerName)
    }
  }
}
</script>

<style lang="scss" scoped></style>
