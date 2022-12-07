<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-28 11:35:59
 * @LastEditTime: 2022-12-07 23:14:36
 * @Description : 用户
-->
<template>
  <div class="user" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="wrapper">
      <!-- 顶部部分 -->
      <div class="top">
        <!-- 返回 -->
        <el-page-header
          title="返回首页"
          content="用户页面"
          @back="handleToHome"
        ></el-page-header>
        <!-- 搜索栏 -->
        <el-autocomplete
          :style="{ width: '40%' }"
          v-model="searchText"
          placeholder="请输入姓名"
          prefix-icon="el-icon-search"
          clearable
          :maxlength="100"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          value-key="userName"
          @select="handleSearchSelect"
          @clear="handleSearchResect"
          @input="handleSearchResect"
        >
          <template slot="prepend">搜索</template>
        </el-autocomplete>
        <!-- 导出Excel按钮 -->
        <el-button
          :loading="exportExcelLoading"
          icon="el-icon-download"
          type="warning"
          @click="handleExportExcel"
          >导出 Excel</el-button
        >
      </div>

      <!-- 表格 -->
      <el-table
        class="table"
        :data="showData"
        style="width: 100%"
        height="auto"
        :default-sort="{ prop: 'userId', order: 'descending' }"
        :stripe="true"
        :border="false"
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <!-- 详细内容展开行 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="出生日期：">
                <span>{{ props.row.birthday }}</span>
              </el-form-item>
              <el-form-item label="身高(cm)：">
                <span>{{ props.row.height }}</span>
              </el-form-item>
              <el-form-item label="体重(kg)：">
                <span>{{ props.row.weight }}</span>
              </el-form-item>
              <el-form-item label="生育方式：">
                <span>{{ props.row.bearWay }}</span>
              </el-form-item>
              <el-form-item label="产后时间：">
                <span>{{ props.row.postpartumTime }}</span>
              </el-form-item>
              <el-form-item label="用户注册日期：">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{ props.row.remarks }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <!-- No -->
        <el-table-column
          align="center"
          type="index"
          width="50"
        ></el-table-column>
        <!-- ID -->
        <el-table-column
          align="center"
          prop="userId"
          label="ID"
          width="200"
          sortable
        ></el-table-column>
        <!-- 姓名 -->
        <el-table-column
          align="center"
          prop="userName"
          label="姓名"
          width="200"
        ></el-table-column>
        <!-- 性别 -->
        <el-table-column
          align="center"
          prop="sex"
          label="性别"
          width="100"
        ></el-table-column>
        <!-- 最后登录时间 -->
        <el-table-column
          align="center"
          prop="lastLoginTime"
          label="最后登录时间"
          sortable
        ></el-table-column>

        <!-- 编辑按钮 -->
        <el-table-column align="center" label="编辑" width="140">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              round
              icon="el-icon-edit"
              @click="handleEditUser(scope.$index, scope.row)"
              >编 辑</el-button
            >
          </template>
        </el-table-column>
        <!-- 删除按钮 -->
        <el-table-column align="center" label="删除" width="140">
          <template slot-scope="scope">
            <el-button
              type="danger"
              plain
              round
              icon="el-icon-delete"
              @click="handleDeleteUser(scope.$index, scope.row)"
              >删 除</el-button
            >
          </template>
        </el-table-column>
        <!-- 选择按钮 -->
        <el-table-column align="center" label="选择" width="140">
          <template slot-scope="scope">
            <el-button
              type="success"
              plain
              round
              icon="el-icon-check"
              @click="handleSelectUser(scope.$index, scope.row)"
              >登 录</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 按钮 -->
      <div class="btn">
        <el-button
          class="item"
          type="success"
          icon="el-icon-user"
          @click="handleAddUser"
          >添加用户</el-button
        >
        <el-button class="item" type="info" @click="handleRefresh"
          >刷 新</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'user',

  data() {
    return {
      searchText: '', // 搜索框内容
      exportExcelLoading: false, // 导出Excel加载动画
      tableLoading: true, // 表格加载动画
      fullscreenLoading: false, // 全屏加载动画

      allUserData: [], // user表的所有用户数据
      showData: [] // 表格显示的数据
    }
  },

  created() {
    this.getAllUsers()
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
     * @description: 获取所有user信息数据
     */
    getAllUsers() {
      const facilityID = window.localStorage.getItem('facilityID')
      this.tableLoading = true
      this.$axios
        .post('/getUserList_v2', {
          devices_name: facilityID
        })
        .then(res => {
          const data = res.data
          if (data.status === 1) {
            /* 把key名改一下，与后端松耦合 */
            const newData = []
            for (let i = 0; i < data.result.length; i++) {
              const total = {}
              const element = data.result[i]
              total.userId = element.user_id
              total.userName = element.user_name
              total.sex = element.sex === 1 ? '男' : '女'
              total.birthday = element.birthday
              total.height = element.height
              total.weight = element.weight
              total.bearWay = element.bearWay
              total.postpartumTime = element.postpartumTime
              total.remarks = element.remarks
              total.lastLoginTime = element.login_time ? element.login_time : ''
              total.createTime = element.create_time
              newData.push(total)
            }
            /* 渲染表格数据 */
            this.allUserData = newData
            this.showData = newData
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
          } else if (data.status === -10) {
            /* 用户数据列表为空 */
            this.$confirm(
              `[状态码为 ${data.status}] 用户列表为空，请先注册新用户！`,
              '提示',
              {
                type: 'info',
                center: true,
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                confirmButtonText: '注册新用户',
                cancelButtonText: '取消'
              }
            )
              .then(() => {
                this.$router.push({ path: '/user-add' })
              })
              .catch(() => {})
          }
        })
        .catch(err => {
          this.$confirm(
            `[从后端获取全部用户数据环节] ${err}。请确保网络连接正常！`,
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
     * @description: 带输入建议的搜索框
     * @param {String} queryString 输入的值
     * @param {Function} cb 回调函数
     */
    querySearch(queryString, cb) {
      const inputAdvices = this.allUserData // 建议列表
      // 建议结果
      const results = queryString
        ? inputAdvices.filter(this.createFilter(queryString))
        : inputAdvices
      // 调用 callback 返回建议结果的数据
      cb(results)
    },
    // 建议方法
    createFilter(queryString) {
      // inputAdvice是建议列表的单项
      return inputAdvice => {
        return (
          inputAdvice.userName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) !== -1
        )
      }
    },
    // item是选中的建议结果中的对象
    handleSearchSelect(item) {
      this.showData = [item]
    },

    /**
     * @description: 重置表格数据（即清空搜索条件）
     */
    handleSearchResect() {
      this.showData = this.allUserData
    },

    /**
     * @description: 跳转至编辑用户页面
     * @param {Number} index 该行索引
     * @param {Object} row 某一行数据
     */
    handleEditUser(index, row) {
      this.$router.push({
        path: '/user-edit',
        query: {
          userId: JSON.stringify(row.userId),
          userName: JSON.stringify(row.userName),
          sex: JSON.stringify(row.sex),
          height: JSON.stringify(row.height),
          weight: JSON.stringify(row.weight),
          birthday: JSON.stringify(row.birthday),
          bearWay: JSON.stringify(row.bearWay),
          postpartumTime: JSON.stringify(row.postpartumTime),
          remarks: JSON.stringify(row.remarks),
          lastLoginTime: JSON.stringify(row.lastLoginTime)
        }
      })
    },

    /**
     * @description: 删除用户，密码是 energy
     * @param {Number} index 该行索引
     * @param {Object} row 某一行数据
     */
    handleDeleteUser(index, row) {
      this.$prompt('该操作将"永久删除"该用户，请谨慎！', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^energy$/,
        inputErrorMessage: '密码不正确',
        inputPlaceholder: '请输入删除密码' // 输入框的占位符
      })
        .then(() => {
          const facilityID = window.localStorage.getItem('facilityID')
          this.fullscreenLoading = true
          this.$axios
            .post('/userDelete_v2', {
              devices_name: facilityID,
              user_id: row.userId
            })
            .then(res => {
              const data = res.data
              if (data.status === 1) {
                /* 删除成功 */
                // 如果目前这个人是登陆状态，则同步更新下Vuex
                if (row.userId === this.$store.state.currentUserInfo.userId) {
                  this.$store.dispatch('changeCurrentUserInfo', {
                    userId: '',
                    userName: '',
                    height: '',
                    weight: '',
                    sex: '',
                    birthday: '',
                    bearWay: '',
                    postpartumTime: '',
                    remarks: '',
                    lastLoginTime: ''
                  })
                }

                this.$message({
                  message: `用户[${row.userName}]，删除成功`,
                  type: 'success',
                  duration: 3000
                })
                this.handleRefresh()
              } else if (data.status === 0) {
                /* 删除失败 */
                this.$alert(
                  `[状态码为 ${data.status}] 删除失败，请刷新页面！`,
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
                  `[状态码为 ${data.status}] 该用户ID不存在，请刷新页面！`,
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
                `[删除用户环节] ${err}。请确保网络连接正常！`,
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
              this.fullscreenLoading = false
            })
        })
        .catch(() => {})
    },

    /**
     * @description: 用户登录
     * @param {Number} index 该行索引
     * @param {Object} row 某一行数据
     */
    handleSelectUser(index, row) {
      const facilityID = window.localStorage.getItem('facilityID')
      this.fullscreenLoading = true
      this.$axios
        .post('/userLogin_v2', {
          devices_name: facilityID,
          user_id: row.userId
        })
        .then(res => {
          const data = res.data
          if (data.status === 1) {
            /* 登录成功 */
            // 同步更新Vuex
            this.$store
              .dispatch('changeCurrentUserInfo', {
                userId: row.userId,
                userName: row.userName,
                sex: row.sex,
                height: row.height,
                weight: row.weight,
                birthday: row.birthday,
                bearWay: row.bearWay,
                postpartumTime: row.postpartumTime,
                remarks: row.remarks,
                lastLoginTime: data.result.login_time
              })
              .then(() => {
                this.$message({
                  message: `用户[${row.userName}]，登录成功`,
                  type: 'success',
                  duration: 2000
                })
              })
              .then(() => {
                this.handleToHome()
              })
              .catch(() => {
                this.$alert(
                  `设置Vuex失败，请刷新页面，然后重新登录！`,
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
              })
          } else if (data.status === 0) {
            /* 登录失败 */
            this.$alert(
              `[状态码为 ${data.status}] 登录失败，请刷新页面，然后重新登录！`,
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
            /* 用户ID不存在 */
            this.$alert(
              `[状态码为 ${data.status}] 该用户ID不存在，请刷新页面，然后重新登录！`,
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
            `[用户登录环节] ${err}。请确保网络连接正常！`,
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
              this.handleRefresh()
            })
            .catch(() => {
              this.handleToHome()
            })
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    },

    /**
     * @description: 跳转至添加用户页面
     */
    handleAddUser() {
      this.$router.push({
        path: '/user-add'
      })
    },

    /**
     * @description: 导出Excel按钮
     */
    handleExportExcel() {
      if (this.allUserData.length) {
        this.exportExcelLoading = true
        // 此处使用懒加载的方式
        import('@/utils/Export2Excel.js')
          .then(excel => {
            const excelTitle = {
              userId: 'ID',
              userName: '姓名',
              sex: '性别',
              height: '身高(cm)',
              weight: '体重(kg)',
              birthday: '出生日期',
              bearWay: '生育方式',
              postpartumTime: '产后时间',
              lastLoginTime: '最后登录时间',
              createTime: '用户注册时间',
              remarks: '备注'
            }
            const tHeader = Object.values(excelTitle)
            // 会根据key键的顺序、属性值等动态变化
            const filterVal = Object.keys(excelTitle)
            const exportData = this.formatJson(filterVal, this.allUserData)
            excel.export_json_to_excel({
              header: tHeader, // 表头 必填
              data: exportData, // 具体数据 必填
              filename:
                '核心稳定训练系统-网络版-所有用户信息 ' +
                this.$moment().format('YYYY-MM-DD HH_mm_ss'), // 导出文件名，非必填
              autoWidth: true, // 自适应列宽，非必填
              bookType: 'xlsx' // 导出格式，非必填
            })
          })
          .then(() => {
            this.$message({
              message: '导出Excel成功',
              type: 'success',
              duration: 3000
            })
          })
          .catch(err => {
            this.$message({
              message: `导出Excel失败：${err}`,
              type: 'error',
              duration: 5000
            })
          })
          .finally(() => {
            this.exportExcelLoading = false
          })
      } else {
        this.$message({
          message: '表格数据不能为空！',
          type: 'error',
          duration: 3000
        })
      }
    },
    /**
     * @description: 数据格式化，将 [{},{},...] => [[],[],...]
     * @param {Array} filterVal key键
     * @param {Array} jsonData [{},{},...]
     * @return {Array} 二维数组 [[],[],...]
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/user'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
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
    @include flex(column, stretch, stretch);

    /* 顶部部分 */
    .top {
      margin-bottom: 20px;
      @include flex(row, space-between, center);
    }

    /* 表格 */
    .table {
      flex: 1;
      /* 覆盖element-ui */
      // 表格展开行
      & /deep/ .table-expand {
        font-size: 0;
      }
      & /deep/ .table-expand label {
        width: 150px;
        color: #99a9bf;
      }
      & /deep/ .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
      }
    }

    /* 按钮 */
    .btn {
      margin-top: 20px;
      @include flex(row, center, center);
      .item {
        font-size: 24px;
        margin: 0 80px;
      }
    }
  }
}
</style>
