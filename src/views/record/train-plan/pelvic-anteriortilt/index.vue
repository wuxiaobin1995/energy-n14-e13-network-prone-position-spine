<!--
 * @Author      : Mr.bin
 * @Date        : 2023-05-20 10:25:24
 * @LastEditTime: 2023-11-07 16:21:13
 * @Description : 盆骨前倾-数据记录
-->
<template>
  <div class="train-plan-pelvic-anteriortilt-record">
    <!-- 顶部 -->
    <div class="top">
      <!-- 标题 -->
      <el-page-header
        title="返回首页"
        content="盆骨前倾"
        @back="handleToHome"
      ></el-page-header>
    </div>

    <!-- 表格 -->
    <el-table
      class="table"
      :data="showData"
      style="width: 100%"
      height="100%"
      :default-sort="{ prop: 'pdfTime', order: 'descending' }"
      :stripe="false"
      :border="true"
      :highlight-current-row="true"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- No -->
      <el-table-column align="center" type="index" width="50"></el-table-column>
      <!-- 训练方案时间 -->
      <el-table-column
        align="center"
        prop="pdfTime"
        label="训练方案时间"
        sortable
      ></el-table-column>

      <!-- 查看报告按钮 -->
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            @click="handleToPdf(scope.$index, scope.row)"
            >查看报告</el-button
          >
        </template>
      </el-table-column>
      <!-- 删除报告按钮 -->
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="danger"
            plain
            @click="handleDelete(scope.$index, scope.row)"
            >删除报告</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 按钮组 -->
    <div class="btn">
      <el-button class="item" type="primary" @click="handleRefresh"
        >刷 新 表 格</el-button
      >
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'train-plan-pelvic-anteriortilt-record',

  data() {
    return {
      tableLoading: true, // 表格加载动画
      showData: [] // 表格显示的数据
    }
  },

  created() {
    this.getTypeData()
  },

  methods: {
    /**
     * @description: 返回首页
     */
    handleToHome() {
      this.$router.push({
        path: '/home'
      })
    },

    /**
     * @description: 从后端通过 type 获取全部记录
     */
    getTypeData() {
      this.tableLoading = true
      const facilityID = window.localStorage.getItem('facilityID')
      this.$axios
        .post('/getTrainPlanRecordByType_v3', {
          devices_name: facilityID,
          user_id: this.$store.state.currentUserInfo.userId,
          type: '盆骨前倾'
        })
        .then(res => {
          const data = res.data
          if (data.status === 1) {
            /* 把key名改一下，与后端松耦合 */
            const newData = []
            for (let i = 0; i < data.result.length; i++) {
              const total = {}
              const element = data.result[i]

              total.dataId = element.train_plan_record_id
              total.pdfTime = element.create_time

              newData.push(total)
            }

            /* 渲染表格数据 */
            this.showData = newData
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
                cancelButtonText: '返回首页'
              }
            )
              .then(() => {
                this.getTypeData()
              })
              .catch(() => {
                this.handleToHome()
              })
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
          this.$confirm(
            `[盆骨前倾-数据记录环节] ${err}。请确保网络连接正常！`,
            '网络请求错误',
            {
              type: 'error',
              center: true,
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              confirmButtonText: '刷新页面',
              cancelButtonText: '返回首页'
            }
          )
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.handleToHome()
            })
        })
        .finally(() => {
          this.tableLoading = false
        })
    },

    /**
     * @description: 查看报告
     * @param {*} index
     * @param {*} row
     */
    handleToPdf(index, row) {
      this.$router.push({
        path: '/plan-pdf',
        query: {
          dataId: JSON.stringify(row.dataId),
          routerName: JSON.stringify('/train-plan-record/pelvic-anteriortilt')
        }
      })
    },

    /**
     * @description: 删除报告
     * @param {*} index
     * @param {*} row
     */
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      })
        .then(() => {
          this.tableLoading = true
          this.$axios
            .post('/deleteTrainPlanRecord_v3', {
              train_plan_record_id: row.dataId
            })
            .then(res => {
              const data = res.data
              if (data.status === 1) {
                /* 成功 */
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                this.getTypeData()
              } else if (data.status === 0) {
                /* 失败 */
                this.$alert(
                  `[状态码为 ${data.status}] 删除失败，请刷新页面后重试！`,
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
                `[盆骨前倾-删除数据环节] ${err}。请确保网络连接正常，刷新页面后重试！`,
                '网络请求错误',
                {
                  type: 'error',
                  showClose: false,
                  confirmButtonText: '刷新页面',
                  callback: () => {
                    this.handleRefresh()
                  }
                }
              )
            })
            .finally(() => {
              this.tableLoading = false
            })
        })
        .catch(() => {})
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/train-plan-record/pelvic-anteriortilt'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.train-plan-pelvic-anteriortilt-record {
  width: 100%;
  height: 90%;
  @include flex(column, stretch, center);

  /* 顶部 */
  .top {
    width: 100%;
    margin: 10px 0;
    @include flex(row, space-between, center);
    // 标题
    .text {
      font-size: 32px;
      color: green;
    }
  }

  /* 表格 */
  .table {
    flex: 1;
  }

  /* 按钮组 */
  .btn {
    margin-top: 20px;
    @include flex(row, center, center);
    .item {
      margin: 0 40px;
    }
  }
}
</style>
