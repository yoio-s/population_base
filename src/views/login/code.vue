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
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      host: 'https://gxzh.cdht.gov.cn',
      url:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8080/pop_base/skylark_login'
          : 'https://gxzh.cdht.gov.cn/pop_base/skylark_login',
      client_id: 'fe773aaaa04530c1cd45aa8e008fd3cd8932a94adad50fc67a1d301df1ab36a5',
      TableValue:[],
      typeValue:'',
      loading: false,
      chooseView: false
    }
  },
  async mounted() {
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.3)',
    })
    this.code = this.$route.query.code
    if (!this.code) {
      window.location.href = `${this.host}/oauth/authorize?client_id=${this.client_id}&redirect_uri=${this.url}&response_type=code`
    } else {
      await this.postOauthTokenAPI()
      loading.close()
    }
  },
  methods: {
    async postOauthTokenAPI() {
      const params = {
        code: this.code,
      }
      const { data } = await this.api.postSkylarkCode(params)
      this.common.setLocalStorage('Token', data.data)
      const fieldData = {
        token: data.data.token,
      }
      const tableList = await this.api.getAllTable(fieldData)
      this.TableValue = tableList.data.data
      this.chooseView = true
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
    box-sizing: border-box;
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
