<template>
  <div>
    <input type="file" @change="importFile(this)" id="imFile" style="display: none"
           accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    <a id="downlink"></a>
    <div class="btn_main">
      <el-button class="btn_add_data" plain size="mini" icon="el-icon-upload" @click="openFileUpload()">数据上传</el-button>
      <el-button class="btn_add_data" plain size="mini" icon="el-icon-upload2" @click="openLog">上传记录</el-button>
    </div>

    <!--    查看记录-->
    <div>
      <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :with-header="false">
        <span>暂无上传记录</span>
      </el-drawer>
      <el-drawer
        title="表格上传记录"
        :visible.sync="drawer"
        direction="rtl"
        size="35%">
        <el-table :data="gridData" border>
          <el-table-column property="success_num" label="成功条数" width="100" align="center"></el-table-column>
          <el-table-column property="failed_num" label="失败条数" width="100" align="center"></el-table-column>
          <el-table-column property="status" label="上传状态" width="100" align="center"></el-table-column>
          <el-table-column property="time" label="上传时间" align="center"></el-table-column>
        </el-table>
      </el-drawer>
    </div>

    <el-dialog
      title="数据上传"
      :visible.sync="dialogUpload"
      width="490px"
      top="18%"
      :before-close="handleClose">
      <el-button class="upload_button" @click="uploadFile()">数据上传</el-button>
      <div class="upload_tips">支持xls、xlsx文件</div>
      <div class="uploaded_file">
        <img class="flie_data_frame" src="@/assets/img/Frame.svg" alt=""/>
        <div class="file_data_title">{{ uploadFileName || '暂无文件' }} <span
          style="color: #666666; margin-left: 8px">{{ uploadFlieSize }}</span></div>
        <img class="flie_data_delete" src="@/assets/img/delete.svg" @click="cleraFile()" alt=""/>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button plain size="mini" @click="downloadFile()">下载模版</el-button>
    <el-button plain type="primary" size="mini" @click="putExcelList()">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import XLSX from 'xlsx'
import axios from 'axios'

export default {
  name: 'excelBtn',
  props: {
    dataExcel: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      drawer: false,
      imFile: '', // 导入文件el
      outFile: '', // 导出文件el
      excelData: this.dataExcel,
      importExcelData: [],
      tableName: this.common.getLocalStorage('TABLE_NAME'), // 表格名字,
      AdminData: this.common.getLocalStorage('Token'),
      tableNameType: '',
      fildes: [],
      gridData: [],
      dialogUpload: false,
      uploadFileName: '',
      uploadFlieSize: '',
      fileData: [],
      loadingInstance:{} //loading加载
    }
  },
  // watch: {
  //   dataExcel(curVal, oldVal) {
  //     if (curVal) {
  //       this.fildes = curVal
  //       const excelArr = []
  //       const excelObj = {}
  //       for (const items of curVal) {
  //         excelObj[items.name] = ''
  //       }
  //       excelArr.push(excelObj)
  //       console.log('excelArr',excelArr)
  //       this.excelData = excelArr
  //       // console.log('pppqqQQ', this.fildes)
  //       // console.log('dododod', this.excelData)
  //     }
  //   },
  // },
  mounted() {
    // console.log('this.dataExcel',this.dataExcel)
    this.tableNameType = this.$route.query.type
    // console.log('asasaswwww', this.excelData)
    this.imFile = document.getElementById('imFile')
    this.outFile = document.getElementById('downlink')
  },
  methods: {
    cleraFile() {
      this.uploadFileName = ''
      this.uploadFlieSize = ''
      this.fileData = []
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    openFileUpload() {
      this.dialogUpload = true
    },
    uploadFile() { // 点击导入按钮
      this.imFile.click()
    },
    async downloadFile() { // 点击导出按钮
      const rs = await this.getDataFields()
      let data = [{}]
      for (const k in rs[0]) {
        data[0][k] = k
      }
      data = data.concat(rs)
      this.downloadExl(data, '表格数据模版')
    },

    async getDataFields() {
      const fieldData = {
        token: this.AdminData.token,
      }
      const listFields = await this.api.getListStructure(this.tableName, this.tableNameType, fieldData)
      if (listFields.data.meta.status_code == 200) {
        const fields = listFields.data.data.fields
        if (fields) {
          const excelArr = []
          const excelObj = {}
          for (const items of fields) {
            excelObj[items.name] = ''
          }
          excelArr.push(excelObj)
          return excelArr
        }

      } else {
        this.$message.error(listFields.data.meta.errmsg)
      }
    },

    importFile() { // 导入excel
      // this.fullscreenLoading = true
      this.loadingInstance =  this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)',
      })
      const obj = this.imFile
      if (!obj.files) {
        this.fullscreenLoading = false
        this.loadingInstance.close()
        return
      }

      const f = obj.files[0]
      this.uploadFileName = obj.files[0].name
      this.uploadFlieSize = `( ${parseInt(obj.files[0].size / 1000)}k )`
      var reader = new FileReader()
      const $t = this
      reader.onload = function (e) {
        const data = e.target.result
        if ($t.rABS) {
          // eslint-disable-next-line no-undef
          $t.wb = XLSX.read(btoa(this.fixdata(data)), { // 手动转化
            type: 'base64',
            cellDates: true,
          })
        } else {
          // eslint-disable-next-line no-undef
          $t.wb = XLSX.read(data, {
            type: 'binary',
            cellDates: true,
          })
        }
        // XLSX.parse(data, { cellDates: true })
        // sheet_to_json 方法的第二个参数中设置  defval  字段，对空数据设置默认值
        // XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]],{range:1,defval:'缺考'})
        // eslint-disable-next-line no-undef
        const json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
        $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
      }

      if (this.rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },

    downloadExl(json, downName, type) { // 导出到excel
      const keyMap = [] // 获取键

      for (const k in json[0]) {
        keyMap.push(k)
      }

      console.info('keyMap', keyMap, json)

      const tmpdata = [] // 用来保存转换好的json

      json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {

        v: v[k],

        position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1),

      }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
        tmpdata[v.position] = {

          v: v.v,

        }
      })

      const outputPos = Object.keys(tmpdata) // 设置区域,比如表格从A1到D10

      const tmpWB = {

        SheetNames: ['mySheet'], // 保存的表标题

        Sheets: {
          mySheet: Object.assign({},
            tmpdata, // 内容

            {

              '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1], // 设置填充区域

            }),

        },

      }

      // eslint-disable-next-line no-undef
      const tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,

        {
          bookType: (type === undefined ? 'xlsx' : type),
          bookSST: false,
          type: 'binary',
        }, // 这里的数据是用来定义导出的格式类型

      ))], {

        type: '',

      }) // 创建二进制对象写入转换好的字节流

      var href = URL.createObjectURL(tmpDown) // 创建对象超链接

      this.outFile.download = downName + '.xlsx' // 下载名称

      this.outFile.href = href // 绑定a标签

      this.outFile.click() // 模拟点击实现下载

      setTimeout(function () { // 延时释放
        URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
      }, 100)
    },

    analyzeData(data) { // 此处可以解析导入数据
      return data
    },

    async dealFile(data) { // 处理导入的数据
      console.log('data', data)
      for (const datum of data) {
        for (const dataKey in datum) {
          if (typeof datum[dataKey] === 'object') {
            const newDate = this.$moment(datum[dataKey]).add(1, 'days').format('YYYY-MM-DD')
            datum[dataKey] = newDate
            // console.log('o.o.o.o', dataKey, newDate)
            // console.log('0.0.0.0', this.formatDate(44300, '-'))
          }
        }
      }
      this.imFile.value = ''
      this.fullscreenLoading = false
      if (data.length <= 0) {
        this.errorDialog = true

        this.errorMsg = '请导入正确信息'
      } else {
        // this.importExcelData = data
        // console.log(this.importExcelData)

        const fieldData = {
          token: this.AdminData.token,
        }
        const listFields = await this.api.getListStructure(this.tableName, this.tableNameType, fieldData)
        if (listFields.data.meta.status_code == 200) {
          const fields = listFields.data.data.fields
          const dataArr = []
          for (const items of data) {
            const obj = {}
            for (const dataItems of fields) {
              obj[dataItems.key] = items[dataItems.name]
            }
            dataArr.push(obj)
          }
          this.fileData = dataArr
          this.loadingInstance.close()
          // this.putExcelList(dataArr)
        }
      }
    },

    s2ab(s) { // 字符串转字符流
      var buf = new ArrayBuffer(s.length)

      var view = new Uint8Array(buf)

      for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
      }

      return buf
    },

    getCharCol(n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
      let s = ''

      let m = 0

      while (n > 0) {
        m = n % 26 + 1

        s = String.fromCharCode(m + 64) + s

        n = (n - m) / 26
      }

      return s
    },

    fixdata(data) { // 文件流转BinaryString
      var o = ''

      var l = 0

      var w = 10240

      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      }

      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))

      return o
    },
    formatDate(numb, format = '-') {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },
    excelDate(time) {
      const year = time.getFullYear()
      const month = time.getMonth() + 1
      const date = time.getDate()
      return year + '-' + month + '-' + date
    },
    async putExcelList(excelData) {
      if (this.fileData.length != 0) {
        console.log(this.fileData)
        this.loadingInstance =  this.$loading({
          lock: true,
          text: '正在上传中。。',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)',
        })
        const content = JSON.stringify(this.fileData)
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }) // 把数据转化成blob对象
        // console.log(blob, "blob");
        let file = new File([blob], this.uploadFileName, { lastModified: Date.now() }); // blob转file

        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', this.common.getLocalStorage('Token').token);
        const statusDate = await this.api.putListDataFile(this.tableName, this.tableName, formData)

        // var config = {
        //   onUploadProgress: progressEvent => {
        //     var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
        //     this.progress = complete
        //   }
        // }
        // axios.post('/apis/dwh/' + this.tableName + '/importFile?proj=' + this.tableName,
        //   formData, config).then((res) => {
        //   if (res.data.status === 200) {
        //     console.log('上传成功')
        //   }
        // })

        if (statusDate.status === 200) {
          this.loadingInstance.close()
          if (statusDate.data.meta.status_code === 200) {
            this.dialogUpload = false
            this.$router.go(0)
            this.$message({
              showClose: true,
              message: '上传' + statusDate.data.meta.errmsg,
              type: 'success',
            })
          } else {
            this.$message.error(statusDate.data.meta.errmsg)
          }
        }
      } else {
        this.$message.error('数据未导入 ！')
      }

    },
    async importLog() {
      const data = {
        token: this.common.getLocalStorage('Token').token,
      }
      const logDate = await this.api.importQueryLog(this.tableName, this.tableNameType, data)
      // console.log(logDate.data.data)
      for (const items of logDate.data.data) {
        const obj = {}
        obj.time = items.created_at
        if (items.status === 'SUCCESS') {
          obj.status = '成功'
        } else if (items.status === 'READY') {
          obj.status = '待处理'
        } else {
          obj.status = '失败'
        }
        if (items.result) {
          obj.failed_num = items.result.failed_num
          obj.success_num = items.result.success_num
        }
        this.gridData.push(obj)
      }
      // console.log('666666', this.gridData)
      // const newData = {
      //   token: this.common.getLocalStorage('Token').token,
      //   task_id: '6f44636d-4442-4904-9535-af31f305e0e3',
      // }
      // const logDateline = await this.api.importStatus(this.globals.tableName[this.tableName], this.globals.typeName[this.tableName], newData)
      // console.log('oooooo0ooooo', logDateline)
    },
    openLog() {
      this.drawer = true
      this.gridData = []
      this.importLog()
    },
  },
}
</script>

<style lang="scss" scoped>
.btn_main {
  .btn_add_data {
    padding: 0;
    border: none;
    background: #FFFFFF;
    color: #333333;
    font-size: 14px;
    &:hover {
      color: #2F80ED;
    }
  }
}

.aa:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 71px;
  height: 11px;
  background: linear-gradient(180deg, #F6894C 0%, #F96715 100%);
  opacity: 0.2;
}

::v-deep {
  .el-drawer__wrapper {
    .el-drawer__header {
      span {
        font-weight: 500;
        font-size: 16px;
        color: #000000;
      }
    }
  }
}

::v-deep {
  .el-dialog__wrapper {
    .el-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0px 16px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-dialog__title {
        font-size: 12px;
        color: #333333;
      }

      .el-dialog__headerbtn {
        position: initial;
        width: 16px;
        height: 16px;
        display: flex;
      }

    }

    .el-dialog__body {
      padding: 24px;
      text-align: center;

      .upload_button {
        width: 140px;
        height: 32px;
        line-height: 22px;
        background: #FFFFFF;
        border: 1px dashed #2F80ED;
        box-sizing: border-box;
        box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
        border-radius: 2px;

        padding: 5px 25px;

        font-size: 14px;
        color: #2F80ED;

      }

      .upload_tips {
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        color: #828282;
        margin-top: 8px;
      }

      .uploaded_file {
        //height: 48px;
        width: 390px;
        box-sizing: border-box;
        background: #F2F2F2;
        border-radius: 4px;
        font-size: 16px;
        color: #000000;
        padding: 12px 18px;
        margin: 0 auto;
        margin-top: 24px;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .flie_data_frame {
          width: 24px;
          height: 24px;
        }

        .file_data_title {
          margin-left: 16px;
          width: 100%;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .flie_data_delete {
          height: 16px;
          width: 16px;
          cursor: pointer;
        }
      }

    }

    .el-dialog__footer {
      height: 48px;
      line-height: 48px;
      padding: 0 16px;

    }
  }
}
</style>
<style lang="scss">
.loading_class {
  .el-loading-spinner {
    //i {
    //  color: rgb(255, 152, 0);
    //}

    .el-loading-text {
      font-size: 16px;
    }
  }
}
</style>
