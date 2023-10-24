<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-28 11:39:15
 * @LastEditTime: 2023-10-24 16:24:07
 * @Description : 用户注册
-->
<template>
  <div class="user-register" v-loading.fullscreen.lock="fullscreenLoading">
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
          <el-divider content-position="center">用户注册</el-divider>
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
            icon="el-icon-edit-outline"
            class="btn-item"
            @click="handleRegister"
            >确认注册</el-button
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
  name: 'user-register',

  data() {
    return {
      manImg: require('@/assets/img/User/男.png'),
      womanImg: require('@/assets/img/User/女.png'),

      fullscreenLoading: false,

      /* 表单 */
      formData: {
        userName: '', // 姓名
        sex: '男', // 性别
        height: '', // 身高
        weight: '', // 体重
        birthday: '', // 出生日期
        bearWay: '无', // 生育方式（顺产、剖腹产、无）
        postpartumTime: '无', // 产后时间（6个月及以内，超过6个月、无）
        remarks: '' // 备注
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
     * @description: 用户注册
     */
    handleRegister() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.fullscreenLoading = true
          const facilityID = window.localStorage.getItem('facilityID')
          this.$axios
            .post('/registerUserName_v3', {
              devices_name: facilityID,
              user_name: this.formData.userName,
              sex: this.formData.sex === '男' ? 1 : 0,
              birthday: this.formData.birthday,
              height: this.formData.height,
              weight: this.formData.weight,
              bearWay: this.formData.bearWay,
              postpartumTime: this.formData.postpartumTime,
              remarks: this.formData.remarks
            })
            .then(res => {
              const data = res.data
              if (data.status === 1) {
                /* 注册成功 */
                this.$message({
                  message: `[状态码为 ${data.status}] 用户注册成功`,
                  type: 'success',
                  duration: 2000
                })
                this.$router.push({
                  path: '/user'
                })
              } else if (data.status === 0) {
                /* 注册失败 */
                this.$alert(
                  `[状态码为 ${data.status}] 注册失败，请重试！`,
                  '警告',
                  {
                    type: 'error',
                    showClose: false,
                    confirmButtonText: '确 定',
                    callback: () => {}
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
                `[注册新用户环节] ${err}。请确保网络连接正常，然后重新注册！`,
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
.user-register {
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
