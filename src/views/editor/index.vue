<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    fullscreen
    :show-close="false"
    :before-close="handleClose">
    <div class="from_title">
      <el-page-header @back="goBack" :content="headerTitle">
      </el-page-header>
    </div>
    <el-form label-position="right" label-width="200px" ref="ValidateForm" :model="fromData" :rules="rules">
      <el-form-item v-for="items in flowLabel" :key="items.id" :label="items.name + ':'" :prop="items.key">
        <el-date-picker
          v-if="items.type === 'DateTimeField'"
          v-model="fromData[items.key]"
          :disabled="fromStatus === 'view'"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
        <el-date-picker
          v-else-if="items.type === 'DateField'"
          v-model="fromData[items.key]"
          :disabled="fromStatus === 'view'"
          type="datetime"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <el-input v-else v-model="fromData[items.key]" :readonly="fromStatus === 'view'"
                  style="border: none"></el-input>
      </el-form-item>
      <el-form-item v-if="fromStatus === 'editor'">
        <el-button type="primary" size="small" style="height: 32px; width: 60px; font-size: 14px" @click="submitForm()">确认</el-button>
      </el-form-item>
      <el-form-item v-if="fromStatus === 'add'">
        <el-button type="primary" size="small" style="height: 32px; width: 60px; font-size: 14px"  @click="submitAddForm()">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

// 身份证验证
const checkIDCard = (rule, value, callback) => {
  const IDCardReg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/
  // const sfzhReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value) {
    if (IDCardReg.test(value)) {
      callback()
    } else {
      callback(new Error('身份证号格式不正确'))
    }
  } else {
    callback(new Error('请输入身份证号'))
  }
}

export default {
  name: 'editor',
  props: {
    table_data: {
      type: Array,
    },
  },
  data() {
    return {
      dialogVisible: false,
      tableName: this.common.getLocalStorage('TABLE_NAME'), // 表格名字
      TheTableData: [],
      headerTitle: '查看',
      flowLabel: [],
      rules: {},
      fromData: {},
      fromStatus: 'view',
      AdminData: this.common.getLocalStorage('Token'),
    }
  },
  watch: {
    table_data(value) {
      this.TheTableData = value
      // console.log('0.0', value)

      // value.shift()
    },
  },
  async mounted() {

    // console.log('aaaass', this.table_data)
    // this.TheTableData.shift()
    // console.log( this.TheTableData)
    // this.flowLabel =  await this.getFromLabel()
    // this.fromData = this.$route.params.value
    // this.fromStatus = this.$route.params.status
    // console.log('dadatata', this.fromData)
  },
  methods: {
    CreateRules(label) {
      const ObjRules = {}
      const ArrRules = [{
        required: true,
        message: '请输入内容',
        trigger: 'blur',
      }]
      for (const labelElement of label) {
        // labelElement.key is_readonly
        if (labelElement.is_readonly) {
          if (labelElement.type == 'Idcard') {
            ObjRules[labelElement.key] = [{
              required: true,
              message: '请输入内容',
              trigger: 'blur',
            }, {
              validator: checkIDCard,
              trigger: 'blur',
            }]
          } else {
            ObjRules[labelElement.key] = ArrRules
          }
        }
      }
      this.rules = ObjRules
      console.log(this.rules)

    },
    showEdit(label, value, status) {
      this.dialogVisible = true
      this.flowLabel = label
      if (value) {
        this.fromData = value
        this.fromStatus = status
        if (status === 'editor') {
          this.CreateRules(label)
          this.headerTitle = '修改'
        } else if (status === 'view') {
          this.headerTitle = '查看'
        }
      } else {
        this.CreateRules(label)
        this.headerTitle = '添加'
        this.fromStatus = 'add'
        this.fromData = {}
      }
    },
    handleClose() {

    },
    async getFromLabel() {
      if (this.AdminData) {
        const fieldData = {
          token: this.AdminData.token,
        }
        const listFields = await this.api.getListStructure(this.tableName, 'rkk', fieldData)
        return listFields.data.data.fields
        console.log(listFields.data.data.fields)
      }
    },
    // 确认修改
    async submitForm() {
      const _this = this
      console.log(this.fromData)

      this.$refs['ValidateForm'].validate(async (valid) => {
        if (valid) {
          const params = {
            token: _this.AdminData.token,
            data: _this.fromData,
          }
          const modifyRes = await _this.api.modifyListData(this.tableName, 'rkk', params)
          if (modifyRes.data.meta.errcode === 0) {
            _this.$message.success('修改成功 ！')
            _this.$parent.ModifyTableData(_this.fromData)
            _this.dialogVisible = false
          } else {
            _this.$message.error(modifyRes.data.meta.errmsg)
          }
        } else {
          _this.$message.error('有必填项未填写 ！')
        }
        // console.log('ValidateForm',valid)
      })
    },
    async submitAddForm() {
      const _this = this
      console.log(this.fromData)

      this.$refs['ValidateForm'].validate(async (valid) => {
        if (valid) {
          const params = {
            token: _this.AdminData.token,
            data: _this.fromData,
          }
          const addRes = await _this.api.addListData(this.tableName, 'rkk', params)
          if (addRes.data.meta.errcode === 0) {
            _this.$message.success('添加成功 ！')
            _this.$parent.AddTableData(_this.fromData)
            _this.dialogVisible = false
          } else {
            _this.$message.error(addRes.data.meta.errmsg)
          }
        } else {
          _this.$message.error('有必填项未填写 ！')
        }
      })
    },
    goBack() {
      this.dialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.main_container {
  padding: 24px;
}

.dialog_container {
  .el-form {
    .el-input {
      border: none;

    }
  }
}

::v-deep {
  .el-form {
    .el-form-item {
      height: 32px;
      margin-bottom: 24px;
      .el-form-item__label {
        height: 32px;
        font-size: 14px;
        color: #000000;
      }
      .el-form-item__content {
        height: 32px;
        .el-input {
          height: 32px;
          input{
            height: 32px;
          }
        }

      }
    }
  }
}

</style>
<style>
.dialog_container .el-dialog .el-dialog__header {
  display: none;
  padding: 0;
}

.dialog_container .el-dialog {
  background: #F2F2F2;
}

.dialog_container .el-dialog .el-dialog__body {
  padding: 0 24px 24px;
  width: 694px;
  /*height: 872px;*/
  border-radius: 8px;
  background: #ffffff;
  margin: 15px auto;
}

.dialog_container .el-dialog .el-dialog__body .from_title {
  padding: 24px 0;
}


</style>
