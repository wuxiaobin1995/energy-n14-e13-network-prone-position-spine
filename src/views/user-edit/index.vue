<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-28 11:40:23
 * @LastEditTime: 2022-12-08 10:58:55
 * @Description : 用户信息修改
-->
<template>
  <div class="user-edit" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="wrapper">
      <!-- 表单 -->
      <el-form
        class="form"
        :model="formData"
        ref="form"
        :rules="rules"
        label-width="auto"
      >
        <!-- 分割线 -->
        <el-row>
          <el-divider content-position="center">用户信息修改</el-divider>
        </el-row>

        <!-- 个人信息 -->
        <el-row type="flex" justify="space-around" class="form-main">
          <el-col :span="10">
            <!-- 姓名 -->
            <el-form-item label="姓名：" prop="userName">
              <el-input
                v-model="formData.userName"
                placeholder="请输入姓名（必填，限20字符）"
                clearable
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
            <!-- 性别 -->
            <el-form-item label="性别：" prop="sex">
              <el-radio-group v-model="formData.sex">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 生育方式 -->
            <el-form-item label="生育方式：" prop="bearWay">
              <el-radio-group v-model="formData.bearWay">
                <el-radio label="顺产">顺产</el-radio>
                <el-radio label="剖腹产">剖腹产</el-radio>
                <el-radio label="无">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 产后时间 -->
            <el-form-item label="产后时间：" prop="postpartumTime">
              <el-radio-group v-model="formData.postpartumTime">
                <el-radio label="6个月及以内">6个月及以内</el-radio>
                <el-radio label="超过6个月">超过6个月</el-radio>
                <el-radio label="无">无</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 身高 -->
            <el-form-item label="身高(cm)：" prop="height">
              <el-input-number
                v-model="formData.height"
                :precision="0"
                :min="1"
                :max="1000"
              ></el-input-number>
            </el-form-item>
            <!-- 体重 -->
            <el-form-item label="体重(kg)：" prop="weight">
              <el-input-number
                v-model="formData.weight"
                :precision="0"
                :min="1"
                :max="1000"
              ></el-input-number>
            </el-form-item>
            <!-- 出生日期 -->
            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker
                v-model="formData.birthday"
                type="date"
                placeholder="请选择日期（必填）"
                :editable="false"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <!-- 图片 -->
            <el-form-item>
              <el-image
                class="sex-img"
                v-show="formData.sex === '男'"
                :src="manImg"
                fit="scale-down"
              ></el-image>
              <el-image
                class="sex-img"
                v-show="formData.sex === '女'"
                :src="womanImg"
                fit="scale-down"
              ></el-image>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item label="备注：" prop="remarks">
              <el-input
                type="textarea"
                v-model="formData.remarks"
                placeholder="请输入备注（限200字符）"
                :rows="6"
                resize="none"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 分割线 -->
        <el-row>
          <el-divider content-position="center"></el-divider>
        </el-row>

        <!-- 按钮组 -->
        <el-row class="btn">
          <el-button
            type="success"
            icon="el-icon-edit"
            class="btn-item"
            @click="handleEdit"
            >确认修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-circle-close"
            class="btn-item"
            @click="handleCancel"
            >取 消</el-button
          >
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'user-edit',

  data() {
    return {
      /* 其他 */
      manImg: require('@/assets/img/User/男.png'),
      womanImg: require('@/assets/img/User/女.png'),
      fullscreenLoading: false, // 全屏加载

      /* 表单 */
      formData: {
        userId: JSON.parse(this.$route.query.userId), // 唯一id
        userName: JSON.parse(this.$route.query.userName), // 姓名
        sex: JSON.parse(this.$route.query.sex), // 性别
        height: JSON.parse(this.$route.query.height), // 身高
        weight: JSON.parse(this.$route.query.weight), // 体重
        birthday: JSON.parse(this.$route.query.birthday), // 出生日期
        bearWay: JSON.parse(this.$route.query.bearWay), // 生育方式（顺产、剖腹产、无）
        postpartumTime: JSON.parse(this.$route.query.postpartumTime), // 产后时间（6个月及以内，超过6个月、无）
        remarks: JSON.parse(this.$route.query.remarks), // 备注
        lastLoginTime: JSON.parse(this.$route.query.lastLoginTime) // 最后登录时间
      },

      rules: {
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '性别必选', trigger: 'change' }],
        bearWay: [
          { required: true, message: '生育方式必选', trigger: 'change' }
        ],
        postpartumTime: [
          { required: true, message: '产后时间必选', trigger: 'change' }
        ],
        height: [
          { required: true, message: '身高不能为空', trigger: 'change' }
        ],
        weight: [
          { required: true, message: '体重不能为空', trigger: 'change' }
        ],
        birthday: [
          {
            required: true,
            message: '出生日期不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },

  methods: {
    /**
     * @description: 用户信息修改
     */
    handleEdit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.fullscreenLoading = true
          const facilityID = window.localStorage.getItem('facilityID')
          this.$axios
            .post('/userMessageChange_v2', {
              devices_name: facilityID,
              user_id: this.formData.userId,
              user_name: this.formData.userName,
              sex: this.formData.sex === '男' ? 1 : 0,
              height: this.formData.height,
              weight: this.formData.weight,
              birthday: this.formData.birthday,
              bearWay: this.formData.bearWay,
              postpartumTime: this.formData.postpartumTime,
              remarks: this.formData.remarks
            })
            .then(res => {
              const data = res.data
              if (data.status === 1) {
                /* 更新成功 */
                if (
                  this.formData.userId ===
                  this.$store.state.currentUserInfo.userId
                ) {
                  // 如果目前这个人是登陆状态，则同步更新下Vuex
                  this.$store
                    .dispatch('changeCurrentUserInfo', {
                      userId: this.formData.userId,
                      userName: this.formData.userName,
                      height: this.formData.height,
                      weight: this.formData.weight,
                      sex: this.formData.sex,
                      birthday: this.formData.birthday,
                      bearWay: this.formData.bearWay,
                      postpartumTime: this.formData.postpartumTime,
                      remarks: this.formData.remarks,
                      lastLoginTime: this.formData.lastLoginTime
                    })
                    .then(() => {
                      this.$message({
                        message: `[状态码为 ${data.status}] 个人信息更新成功`,
                        type: 'success',
                        duration: 3000
                      })
                    })
                    .then(() => {
                      this.$router.push({
                        path: '/user'
                      })
                    })
                    .catch(() => {
                      this.$alert(`同步更新Vuex失败，请重试！`, '警告', {
                        type: 'error',
                        showClose: false,
                        confirmButtonText: '返回上一页',
                        callback: () => {
                          this.$router.push({
                            path: '/user'
                          })
                        }
                      })
                    })
                } else {
                  this.$message({
                    message: `[状态码为 ${data.status}] 个人信息更新成功`,
                    type: 'success',
                    duration: 3000
                  })
                  this.$router.push({
                    path: '/user'
                  })
                }
              } else if (data.status === 0) {
                /* 更新失败 */
                this.$alert(
                  `[状态码为 ${data.status}] 更新失败，请重试！`,
                  '警告',
                  {
                    type: 'error',
                    showClose: false,
                    confirmButtonText: '确 定',
                    callback: () => {}
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
                `[更新个人信息环节] ${err}。请确保网络连接正常，然后重试！`,
                '网络请求错误',
                {
                  type: 'error',
                  showClose: false,
                  confirmButtonText: '确 定',
                  callback: () => {}
                }
              )
            })
            .finally(() => {
              this.fullscreenLoading = false
            })
        } else {
          return false
        }
      })
    },

    /**
     * @description: 取消
     */
    handleCancel() {
      this.$router.push({
        path: '/user'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-edit {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 86%;
    height: 90%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 26px;

    /* 表单 */
    .form {
      width: 100%;
      height: 100%;
      @include flex(column, stretch, stretch);

      // 个人信息
      .form-main {
        flex: 1;
        .sex-img {
          width: 200px;
        }
      }
      // 按钮组
      .btn {
        @include flex(row, center, center);
        .btn-item {
          font-size: 24px;
          margin: 0 80px;
        }
      }
    }
  }
}
</style>
