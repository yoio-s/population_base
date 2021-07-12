<template>
  <div class="nav-bar-container">
    <el-row :gutter="15">
      <el-col :xs="4" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="left-panel">
          当前数据：
          <i class="el-icon-refresh icon_ref"></i>
          <el-select v-model="tableValue" @change="TableChange" placeholder="表格选择">
            <el-option
              v-for="item in TableOptions"
              :key="item.keyname"
              :label="item.name"
              :value="item.keyname"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="right-panel">
          <!--          <vab-error-log/>-->
          <!--          <vab-full-screen-bar @refresh="refreshRoute"/>-->
          <!--          <vab-theme-bar class="hidden-xs-only"/>-->
          <!--          <vab-icon-->
          <!--            title="重载所有路由"-->
          <!--            :pulse="pulse"-->
          <!--            :icon="['fas', 'redo']"-->
          <!--            @click="refreshRoute"-->
          <!--          />-->
          <Vatar/>
          <!--  <vab-icon
            title="退出系统"
            :icon="['fas', 'sign-out-alt']"
            @click="logout"
          />-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vatar from './vatar'

export default {
  name: 'Top',
  components: { Vatar },
  data() {
    return {
      pulse: false,
      TableOptions: [],
      tableValue: '',
      AdminData: this.common.getLocalStorage('Token'),
    }
  },
  async mounted() {
    const fieldData = {
      token: this.AdminData.token,
    }
    const tableList = await this.api.getAllTable(fieldData)
    this.TableOptions = tableList.data.data
    // this.$store.commit('edit', false)
    if (this.common.getLocalStorage('TABLE_NAME')){
      this.tableValue = this.common.getLocalStorage('TABLE_NAME')

      this.TableOptions.forEach((val,index)=>{
        if (val.keyname == this.tableValue){
          for (const items of val.permissions) {
            switch (items){
              case 'r':
                this.$store.commit('cat', true)
                break;
              case 'e':
                this.$store.commit('edit', true)
                break;
              case 'a':
                this.$store.commit('add', true)
                break;
              case 'd':
                this.$store.commit('del', true)
                break;
            }
          }
        }
      })
    }else {
      this.tableValue = this.TableOptions[0].keyname
      // this.TableOptions[0].permissions
      for (const items of this.TableOptions[0].permissions) {
        switch (items){
          case 'r':
            this.$store.commit('cat', true)
            break;
          case 'e':
            this.$store.commit('edit', true)
            break;
          case 'a':
            this.$store.commit('add', true)
            break;
          case 'd':
            this.$store.commit('del', true)
            break;
        }
      }
    }
  },
  methods: {
    TableChange(value) {
      this.common.setLocalStorage('TABLE_NAME', value)
      this.$router.go('0')
      // this.reload();
    },
    handleCollapse() {
      // this.changeCollapse()
    },
    async refreshRoute() {
      // this.$baseEventBus.$emit('reload-router-view')
      this.pulse = true
      setTimeout(() => {
        this.pulse = false
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/rpx";
.nav-bar-container {
  padding: 0 getVw(120);
  position: relative;
  height: $base-nav-bar-height;
  //padding-right: $base-padding;
  //padding-left: $base-padding;
  overflow: hidden;
  user-select: none;
  background: $base-color-white;
  box-shadow: $base-box-shadow;

  .left-panel {
    display: flex;
    align-items: center;
    justify-items: center;
    height: $base-nav-bar-height;
    font-weight: 500;
    font-size: 16px;
    color: #000000;
    .icon_ref {
      color: #2F80ED;
      margin: 0 5px;
    }

    ::v-deep {
      .el-select {
        //width: auto;
        text-align: left;

        .el-input {
          input {
            text-align: left;
            border: none;
            padding: 0;
            font-size: 16px;
            color: #2F80ED;

          }

          .el-input__suffix {
            display: none;
          }
        }
      }
    }

    .fold-unfold {
      color: $base-color-gray;
      cursor: pointer;
    }

    ::v-deep {
      .breadcrumb-container {
        margin-left: 10px;
      }
    }
  }

  .right-panel {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
    height: $base-nav-bar-height;

    ::v-deep {
      svg {
        width: 1em;
        height: 1em;
        margin-right: 15px;
        font-size: $base-font-size-small;
        color: $base-color-gray;
        cursor: pointer;
        fill: $base-color-gray;
      }

      button {
        svg {
          margin-right: 0;
          color: $base-color-white;
          cursor: pointer;
          fill: $base-color-white;
        }
      }

      .el-badge {
        margin-right: 15px;
      }
    }
  }
}
</style>
