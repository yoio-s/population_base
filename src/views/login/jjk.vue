<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          label-position="left"
        >
          <div class="title">hello !</div>
          <div class="title-tips">{{ title }}</div>
          <el-form-item style="margin-top: 40px" prop="account">
            <span class="svg-container svg-container-admin">
              <i class="el-icon-user"></i>
            </span>
            <el-input
              v-model.trim="form.account"
              v-focus
              placeholder="请输入用户名"
              tabindex="1"
              type="text"
            />
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
              placeholder="请输入密码"
              @keyup.enter.native="handleLogin"
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
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            @click="handleLogin"
          >
            登录
          </el-button>
          <router-link to="/registerJjk">
            <div style="margin-top: 20px">注册</div>
          </router-link>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'jjk',
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
    const validatePassword = (rule, value, callback) => {
      if (!this.common.isPassword(value)) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      title: '经济库',
      form: {
        account: '',
        password: '',
      },
      rules: {
        account: [
          {
            required: true,
            trigger: 'blur',
            validator: validateusername,
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword,
          },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = (route.query && route.query.redirect) || '/'
      },
      immediate: true,
    },
  },
  created() {
    document.body.style.overflow = 'hidden'
  },
  beforeDestroy() {
    document.body.style.overflow = 'auto'
  },
  mounted() {
    this.form.account = 'admin'
    this.form.password = '123456'
    // setTimeout(() => {
    //   this.handleLogin()
    // }, 3000)
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
    handleLogin() {
      const _this = this
      // this.axios.post('/api/v4/yaw/flows/1053/journeys', dataSure, {headers: this.headers});
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const accountAdmin = await _this.api.getAdminLogin(this.globals.tableName.user, this.globals.typeName.jjk, this.form)
          if (accountAdmin.data.meta.status_code === 200) {
            _this.common.setLocalStorage('Token', accountAdmin.data.data)
            this.$router.push({
              path: '/home',
              // query: {
              //   // name: '经济库',
              //   name: _this.globals.typeName.jjk
              // },
            })
          } else {
            this.$message.error(accountAdmin.data.meta.errmsg)
          }
          this.loading = false
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
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

  .login-form {
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
