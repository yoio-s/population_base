<template>
  <div class="register-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-form
          ref="registerForm"
          :model="form"
          class="register-form"
          :rules="registerRules"
          size="mini"
        >
          <div class="title-tips">账号注册(经济库)</div>
          <el-form-item  style="margin-top: 20px"  prop="name">
            <span class="svg-container  svg-container-admin">
              <i class="el-icon-user"></i>
            </span>
            <el-input
              v-model.trim="form.name"
              v-focus
              type="text"
              placeholder="请输入用户名"
              auto-complete="off"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="account">
            <span class="svg-container">
              <i class="el-icon-user"></i>
            </span>
            <el-input
              v-model.trim="form.account"
              type="text"
              placeholder="请输入账号"
              auto-complete="off"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <i class="el-icon-lock"></i>
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :type="passwordType"
              tabindex="2"
              placeholder="设置密码"
              @keyup.enter.native="handlePassword"
            />
            <span
              v-if="passwordType === 'password'"
              class="show-password"
              @click="handlePassword"
            >
               <i class="el-icon-view"></i>
            </span>
            <span v-else class="show-password" @click="handlePassword">
              <i class="el-icon-view"></i>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="register-btn"
              type="primary"
              @click.native.prevent="handleReister"
            >
              注册
            </el-button>
            <router-link to="/loginJjk">
              <div style="margin-top: 20px">登录</div>
            </router-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  username: 'Register',
  directives: {
    focus: {
      inserted(el) {
        el.querySelector('input').focus()
      },
    },
  },
  data() {
    const validateusername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validateaccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!this.common.isPassword(value)) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      getPhoneIntval: null,
      showRegister: false,
      form: {},
      registerRules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入用户名',
          },
          {
            max: 20,
            trigger: 'blur',
            message: '最多不能超过20个字',
          },
          {
            validator: validateaccount,
            trigger: 'blur',
          },
        ],
        account: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入账号',
          },
          {
            max: 20,
            trigger: 'blur',
            message: '账号最多不能超过20个字',
          },
          {
            validator: validateusername,
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入密码',
          },
          {
            validator: validatePassword,
            trigger: 'blur',
          },
        ],
      },
      loading: false,
      passwordType: 'password',
    }
  },
  created() {
    document.body.style.overflow = 'hidden'
  },
  mounted() {
    // this.tableName = this.$route.query.name
  },
  beforeDestroy() {
    document.body.style.overflow = 'auto'
    this.getPhoneIntval = null
    clearInterval(this.getPhoneIntval)
  },
  methods: {
    handlePassword() {
      this.passwordType === 'password'
        ? (this.passwordType = '')
        : (this.passwordType = 'password')
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleReister() {
      const data = this.from
      this.loading = true
      const reisterData = this.api.getAdminRegister(this.globals.tableName.user, this.globals.typeName.jjk, data)
      if (reisterData.data.meta.status_code === 200) {
        this.$message({
          message: '注册成功！',
          type: 'success',
        })
        this.$router.push('/loginJjk')
      } else {
        this.$message.error(reisterData.data.meta.errmsg)
      }
      this.loading = false
    },
  },
}
</script>
<style lang="scss" scoped>
.register-container {
  height: 100vh;
  background: url('~@/assets/img/Rectangle.png') center center fixed no-repeat;
  background-size: cover;

  .title {
    font-size: 54px;
    font-weight: 500;
    color: $base-color-white;
  }

  .title-tips {
    margin-top: 29px;
    font-size: 26px;
    font-weight: 400;
    color: $base-color-white;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .login-btn {
    display: inherit;
    width: 220px;
    height: 60px;
    margin-top: 5px;
    border: 0;

    &:hover {
      opacity: 0.9;
    }
  }

  .register-form {
    position: relative;
    max-width: 100%;
    margin: calc((100vh - 425px) / 2) 10% 10%;
    overflow: hidden;

    .forget-password {
      width: 100%;
      margin-top: 40px;
      text-align: left;

      .forget-pass {
        width: 129px;
        height: 19px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(92, 102, 240, 1);
      }
    }
  }

  .tips {
    margin-bottom: 10px;
    font-size: $base-font-size-default;
    color: $base-color-white;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px auto;
      font-size: 34px;
      font-weight: bold;
      color: $base-color-blue;
      text-align: center;
    }
  }

  .svg-container {
    position: absolute;
    top: 14px;
    left: 15px;
    z-index: $base-z-index;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  .show-password {
    position: absolute;
    top: 14px;
    right: 25px;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  ::v-deep {
    .el-form-item {
      padding-right: 0;
      margin: 20px 0;
      color: #454545;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 2px;

      &__content {
        min-height: $base-input-height;
        line-height: $base-input-height;
      }

      &__error {
        position: absolute;
        top: 100%;
        left: 18px;
        font-size: $base-font-size-small;
        line-height: 18px;
        color: $base-color-red;
      }
    }

    .el-input {
      box-sizing: border-box;

      input {
        height: 58px;
        padding-left: 45px;
        font-size: $base-font-size-default;
        line-height: 58px;
        color: $base-font-color;
        background: #f6f4fc;
        border: 0;
        caret-color: $base-font-color;
      }
    }
  }
}
</style>
