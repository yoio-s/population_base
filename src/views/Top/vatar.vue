<template>
  <el-dropdown size="small"  @command="handleCommand">
    <span class="avatar-dropdown">
      <!--<el-avatar class="user-avatar" :src="avatar"></el-avatar>-->
      <!--      <img class="user-avatar" :src="avatar" alt=""/>-->
      <div class="user-name">
        {{ username }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
    </span>

    <el-dropdown-menu  slot="dropdown">
      <el-dropdown-item command="logout">退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'VabAvatar',
  data() {
    return {
      username: '姓名',
      avatar: '',
      tableNameType: '',
      options: [],
    }
  },
  mounted() {
    this.tableNameType = this.$route.query.type
    const AdminData = this.common.getLocalStorage('Token')
    if (AdminData) {
      this.username = AdminData.name
    }
  },
  methods: {
    handleChange() {

    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'personalCenter':
          this.personalCenter()
      }
    },
    personalCenter() {
      this.$router.push('/personalCenter/personalCenter')
    },
    logout() {
      // this.$router.push('/')

      this.$confirm('您确定要退出' + this.username + '吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async () => {
        const data = {
          token: this.common.getLocalStorage('Token').token,
        }
        const quitAdmin = await this.api.getAdminQuit(this.globals.tableName.user, this.tableNameType, data)

        if (quitAdmin.data.meta.status_code === 200) {
          this.$message({
            type: 'success',
            message: '退出' + quitAdmin.data.meta.errmsg,
          })
          localStorage.clear('Token')
          localStorage.clear('TABLE_NAME')
          switch (this.tableNameType) {
            case this.globals.typeName.rkk:
              this.$router.push('/loginRkk')
              break
            case this.globals.typeName.jjk:
              this.$router.push('/loginJjk')
              break
          }
          // this.$router.go(0)
        } else {
          this.$message({
            type: 'error',
            message: quitAdmin.data.meta.errmsg,
          })
        }

        console.log(quitAdmin)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    changeTable() {
      console.log('o.o 0.0 !.! -.- (o).(o)')

    },
  },
}
</script>
<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 50px;
  padding: 0;

  .user-avatar {
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-name {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: normal;
    position: relative;
    margin-left: 5px;
    margin-left: 5px;
    cursor: pointer;
    font-size: 16px;
    color: #000000;
  }
}
</style>
