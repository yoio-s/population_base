<template>
  <div class="login-container">

    <div class="login_right_images" style="color: transparent">
      <img src="@/assets/img/Rectangle.png">
    </div>
    <el-form
      v-if="chooseView"
      class="login-form"
      label-position="left"
    >
      <div class="title">社区小脑</div>
      <el-form-item style="margin-top: 48px">
        <el-select v-model="typeValue" placeholder="请选择数据库">
          <el-option
            v-for="item in TableValue"
            :key="item.keyname"
            :label="item.name"
            :value="item.keyname">
            <span style="float: left">{{ item.name }}</span>
            <!--            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.keyname }}</span>  -->
          </el-option>
        </el-select>
      </el-form-item>
      <el-button
        :loading="loading"
        class="login-btn"
        type="primary"
        @click="sureTable"
      >
        确定
      </el-button>
    </el-form>
    <el-form
      v-else
      ref="form"
      :model="form"
      :rules="rules"
      class="login-form"
      label-position="left"
    >
      <div class="title">社区小脑</div>
      <!--      <div class="title-tips">{{ title }}</div>-->
      <el-form-item style="margin-top: 48px" prop="account">
            <span class="svg-container svg-container-admin">
<!--              <vab-icon :icon="['fas', 'user']"/>-->
              <i class="el-icon-user"></i>
            </span>
        <el-input
          v-model.trim="form.account"
          v-focus
          placeholder="请输入手机号"
          tabindex="1"
          type="text"
        />
      </el-form-item>
      <!--      <el-form-item prop="password">-->
      <!--            <span class="svg-container">-->
      <!--&lt;!&ndash;              <vab-icon :icon="['fas', 'lock']"/>&ndash;&gt;-->
      <!--              <i class="el-icon-lock"></i>-->
      <!--            </span>-->
      <!--        <el-input-->
      <!--          :key="passwordType"-->
      <!--          ref="password"-->
      <!--          v-model.trim="form.password"-->
      <!--          :type="passwordType"-->
      <!--          tabindex="2"-->
      <!--          placeholder="请输入密码"-->
      <!--          @keyup.enter.native="handleLogin"-->
      <!--        />-->
      <!--        <span-->
      <!--          v-if="passwordType === 'password'"-->
      <!--          class="show-password"-->
      <!--          @click="handlePassword"-->
      <!--        >-->
      <!--               <i class="el-icon-view"></i>-->
      <!--          &lt;!&ndash;              <vab-icon :icon="['fas', 'eye-slash']"></vab-icon>&ndash;&gt;-->
      <!--        </span>-->
      <!--        <span v-else class="show-password" @click="handlePassword">-->
      <!--&lt;!&ndash;              <vab-icon :icon="['fas', 'eye']"></vab-icon>&ndash;&gt;-->
      <!--              <i class="el-icon-view"></i>-->
      <!--         </span>-->
      <!--      </el-form-item> -->
      <el-form-item prop="code">
            <span class="svg-container svg-container-admin">
              <i class="el-icon-user"></i>
            </span>
        <el-input placeholder="请输入验证码" v-model.trim="form.code">
          <template slot="append">
            <div class="send_sms_code" v-if="iSCode" @click="sendSMSCode()">{{ getSmsCode }}</div>
            <div class="send_sms_code" style="color: #DCDFE6" v-else>{{ codeSecond }}</div>
          </template>
        </el-input>
      </el-form-item>
      <el-button
        :loading="loading"
        class="login-btn"
        type="primary"
        @click="handleLogin"
      >
        登录
      </el-button>
      <!--      <router-link to="/registerRkk">-->
      <!--        <div style="margin-top: 20px">注册</div>-->
      <!--      </router-link>-->
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'Login',
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
        callback(new Error('验证码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      title: '人口库',
      chooseView: false,
      TableValue: [{
        keyname: 'Beijing',
        name: '北京',
      }],
      typeValue: '',
      form: {
        account: '',
        code: '',
      },
      rules: {
        account: [
          {
            required: true,
            trigger: 'blur',
            validator: validateusername,
          },
        ],
        code: [
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
      getSmsCode: '获取验证码',
      iSCode: true,
      codeSecond: '60S后可重发',
      countdownTime: 60,
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
    this.form.account = ''
    this.form.code = ''
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
    // 短信验证码
    async sendSMSCode() {
      console.log('短信验证码')

      console.log(this.form.account)
      if (this.form.account) {
        this.iSCode = false
        this.countDown()
        const params = {
          'action': 'sign_in',
          'mobile': this.form.account, //账户或手机号
        }
        const resData = await this.api.postSMSCode(this.globals.tableName.user, this.globals.typeName.rkk, params)
        if (resData.data.meta.status_code !== 200) {
          this.$message.error('手机号码错误！')
        }
      } else {
        this.$message.error('请输入手机号！')
      }

    },
    countDown() {
      const _this = this
      if (this.countdownTime == 0) {
        this.iSCode = true
        this.countdownTime = 60
      } else {
        this.countdownTime--
        this.codeSecond = this.countdownTime + 'S后可重发'
        setTimeout(function () {
          _this.countDown()
        }, 1000)
      }
    },
    handleLogin() {
      const _this = this
      // this.axios.post('/api/v4/yaw/flows/1053/journeys', dataSure, {headers: this.headers});
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true

          const accountAdmin = await _this.api.getAdminLogin(this.globals.tableName.user, this.globals.typeName.rkk, this.form)
          console.log(accountAdmin)
          if (accountAdmin.data.meta.status_code === 200) {
            this.loading = false
            _this.common.setLocalStorage('Token', accountAdmin.data.data)
            // _this.common.setLocalStorage('TABLE_NAME', 'citizen')
            const fieldData = {
              token: accountAdmin.data.data.token,
            }
            this.chooseView = true
            const tableList = await this.api.getAllTable(fieldData)
            this.TableValue = tableList.data.data
          } else {
            // console.log(accountAdmin.data.meta.errmsg)
            this.$message.error(accountAdmin.data.meta.errmsg)
            this.loading = false
          }
          // this.$router.push('index')
        } else {
          return false
        }
      })
    },
    sureTable() {
      this.common.setLocalStorage('TABLE_NAME', this.typeValue)
      this.$store.commit('cat', false)
      this.$store.commit('edit', false)
      this.$store.commit('add', false)
      this.$store.commit('del', false)
      this.TableValue.forEach((val, index) => {
        if (val.keyname == this.typeValue) {
          for (const items of val.permissions) {
            switch (items) {
              case 'r':
                this.$store.commit('cat', true)
                break
              case 'e':
                this.$store.commit('edit', true)
                break
              case 'a':
                this.$store.commit('add', true)
                break
              case 'd':
                this.$store.commit('del', true)
                break
            }
          }
        }
      })
      this.$router.push({
        path: '/home',
        query: {
          // name: '人口库',
          type: this.globals.typeName.rkk,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/rpx";

.login-container {
  width: 100%;
  height: 100vh;
  //background: url('~@/assets/img/background.jpg') center center fixed no-repeat;
  //background-size: cover;
  display: flex;
  justify-content: space-between;

  .title {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 600;
    font-size: getVw(64);
    line-height: getVw(64);
    color: #000000;
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
    width: 100%;
    height: getVw(40);
    //margin-top: 5px;
    border: 0;
    font-size: getVw(14);
    padding: 0;

    &:hover {
      opacity: 0.9;
    }
  }

  .login_right_images {
    width: getVw(965);
    height: 100vh;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .login-form {
    width: getVw(475);
    background: #fff;
    position: relative;
    height: 100vh;
    max-width: 100%;
    //padding: calc((100vh - 425px) / 2) 10% 10%;
    padding: getVw(338) getVw(70) 0 getVw(67);
    overflow: hidden;

    .forget-password {
      width: 100%;
      margin-top: getVw(40);
      text-align: left;

      .forget-pass {
        width: getVw(129);
        height: getVw(19);
        font-size: getVw(20);
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
    height: getVw(40);
    line-height: getVw(40);
    position: absolute;
    //top: getVw(6);
    left: getVw(15);
    z-index: $base-z-index;
    font-size: getVw(16);
    color: #B4BCCC;
    cursor: pointer;
    user-select: none;
  }

  .show-password {
    height: getVw(40);
    line-height: getVw(40);
    position: absolute;
    //top: getVw(6);
    right: getVw(20);
    font-size: getVw(16);
    color: #B4BCCC;
    cursor: pointer;
    user-select: none;
  }

  ::v-deep {
    .el-form-item {
      padding-right: 0;
      margin: getVw(16) 0;
      color: #7D8087;;
      background: #FFFFFF;
      border: 1px solid #DCDFE6;
      border-radius: getVw(4);

      &__content {
        min-height: $base-input-height;
        line-height: $base-input-height;
      }

      &__error {
        position: absolute;
        top: 96%;
        left: getVw(18);
        font-size: $base-font-size-small;
        line-height: getVw(18);
        color: $base-color-red;
      }
    }

    .el-form-item__content {
      min-height: auto;
      line-height: getVw(40);
    }

    .el-input {
      box-sizing: border-box;
      height: getVw(40);

      input {
        height: getVw(40);
        padding-left: getVw(45);
        font-size: $base-font-size-default;
        line-height: getVw(40);
        color: $base-font-color;
        background: #ffffff;
        border: 0;
        caret-color: $base-font-color;
      }

      .el-input-group__append {
        background: #fff;
        border: none;
        padding: 0;

        .send_sms_code {
          font-size: 12px;
          color: #409EFF;
          background: #ffffff;
          padding: 8px;
          cursor: pointer;
        }
      }
    }

    .el-select {
      width: 100%;

      .el-input {
        input {
          padding-left: getVw(16);
          font-size: getVw(14);
        }

        .el-input__suffix {
          right: getVw(5);
          line-height: getVw(40);

          .el-input__icon {
            line-height: getVw(40);
          }
        }

        .el-input__inner {
          padding-right: getVw(35)
        }
      }
    }
  }
}
</style>
