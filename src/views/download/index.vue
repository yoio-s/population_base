<template>
  <div>
    <el-button class="btn_add_data" style="margin-left: 16px" plain @click="downloadTable()" icon="el-icon-download" size="mini">下载数据
    </el-button>
    <el-dialog title="数据准备中" :modal="false" :visible.sync="downloadFormVisible" width="30%">
      <!--      <el-form label-width="100px">-->
      <!--        <el-form-item label="输入筛选内容" label-position="left">-->
      <!--          <el-input size="small" v-model="filterName" placeholder="请输入内容" style="width: 100%"></el-input>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
      <!--      <div slot="footer" class="dialog-footer">-->
      <!--        &lt;!&ndash;        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>&ndash;&gt;-->
      <!--        &lt;!&ndash;      <el-button size="mini" type="primary" @click="addFilter">添 加</el-button>&ndash;&gt;-->
      <!--        &lt;!&ndash;      <el-button size="mini" type="primary" @click="sureFilter">查 询</el-button>&ndash;&gt;-->
      <!--      </div>-->
      <el-progress :percentage="100" :format="format"></el-progress>
    </el-dialog>
    <a style="display: none" id="downTable"></a>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  name: 'download',
  data() {
    return {
      downloadFormVisible: false,
      filterName: '',
      AdminData: this.common.getLocalStorage('Token'),
      tableName: this.common.getLocalStorage('TABLE_NAME'), // 表格名字
      thisPage: 0,
      allData: [],
    }
  },
  mounted() {
    // this.getTableData()
    this.tableNameType = this.$route.query.type
    this.outFile = document.getElementById('downTable')
  },
  methods: {
    async downloadTable() {
      // this.downloadFormVisible = true
      if (this.AdminData) {
        const fieldData = {
          token: this.AdminData.token,
        }
        const listFields = await this.api.getListStructure(this.tableName, this.tableNameType, fieldData)
        // console.log('listFields', listFields)
        if (listFields.data.meta.status_code == 200) {
          const TableName = listFields.data.data.name
          const fields = listFields.data.data.fields
          if (fields) {
            const labelArr = []
            // const excelArr = []
            // const excelObj = {}
            for (const items of fields) {
              const labelObj = {}
              labelObj.key = items.key
              labelObj.name = items.name
              labelArr.push(labelObj)
              // excelObj[items.name] = ''
            }
            // excelArr.push(excelObj)

            const returnAll = await this.getAllTableData()
            const AllTable = []
            // console.log(returnAll)
            for (const Element of this.allData) {
              // console.log(Element)
              const Obj = {}
              for (const labelItem of labelArr) {
                if (Element[labelItem.key]) {
                  Obj[labelItem.name] = Element[labelItem.key]
                } else {
                  Obj[labelItem.name] = ''
                }
              }
              AllTable.push(Obj)
            }
            // const AllTable = excelArr.concat(returnAll)
            // console.log('excelArrexcelArr', AllTable)
            this.downloadFile(AllTable, TableName)
          }

        } else {
          this.$message.error(listFields.data.meta.errmsg)
        }
        // return listFields.data.data.fields

      }

    },
    async getAllTableData() {
      this.thisPage++
      const data = {
        token: this.AdminData.token,
      }
      const tableJson = {
        name: this.tableName,
        type: this.globals.typeName.rkk,
        page: this.thisPage,
        pageSize: 100,
      }
      const listData = await this.api.getListData(tableJson, data)
      this.allData = this.allData.concat(listData.data.data)
      if (listData.data.pagination.next) {
        await this.getAllTableData()
      } else {
        const data = this.allData
        // console.log(data)
        return data
      }
    },
    format(percentage) {
      return percentage === 100 ? '满' : `${percentage}%`
    },
    async downloadFile(rs, name) { // 点击导出按钮
      // const rs = await this.downloadTable()
      let data = [{}]
      for (const k in rs[0]) {
        data[0][k] = k
      }
      data = data.concat(rs)
      this.downloadExl(data, name)
    },
    downloadExl(json, downName, type) { // 导出到excel
      const keyMap = [] // 获取键

      for (const k in json[0]) {
        keyMap.push(k)
      }

      // console.info('keyMap', keyMap, json)

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
    s2ab(s) { // 字符串转字符流
      var buf = new ArrayBuffer(s.length)

      var view = new Uint8Array(buf)

      for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
      }

      return buf
    },
  },
}
</script>

<style scoped>
.btn_add_data {
  padding: 0;
  border: none;
  background: #FFFFFF;
  color: #333333;
  font-size: 14px;
}
</style>
