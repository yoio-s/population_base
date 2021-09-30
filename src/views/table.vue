<template>
  <div class="table-container">
    <div class="table_search">
      <div>
        筛选：
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag.tagName"
          closable
          size="small"
          @close="handleClose(tag)">
          <span class="tag_title">{{ tag.tagName|filterName(filterFieldsmain) }}:</span>{{ tag.tagValue }}
        </el-tag>
        <el-button class="button-new-tag" @click="showInput">+</el-button>
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          @click="handleQuery"
        >
          查询
        </el-button>
      </div>
      <div style="display: flex">
        <div style="display: flex" v-if="$store.state.permissions_add">
          <el-dropdown style="margin-right: 16px; cursor: pointer" @command="handleCommand">
            <span class="el-dropdown-link btn_delete">
              <i class="el-icon-delete"></i> 批量删除
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">删除全部</el-dropdown-item>
              <el-dropdown-item command="check">删除选中 ({{ checkNum }}条)</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button class="btn_add_data" style="margin-right: 16px" icon="el-icon-plus" type="primary" plain
                     size="mini"
                     @click="addClick()">添加
          </el-button>
          <ExcelBtn></ExcelBtn>
        </div>
        <!--        <el-button style="margin-left: 16px" plain size="mini" >下载数据</el-button>-->
        <Download></Download>
      </div>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      :max-height="tableHeight"
      border
      @cell-dblclick="celldblClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        v-for="items in tableFields"
        :key="items.id"
        :prop="items.key"
        :label="items.name"
        min-width="165"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="148">
        <template slot-scope="scope">
          <el-button v-if="$store.state.permissions_cat" @click="handleClick(scope.row, 'view')" type="text"
                     size="small">查看
          </el-button>
          <el-button v-if="$store.state.permissions_edi" @click="handleClick(scope.row, 'editor')" type="text"
                     size="small">编辑
          </el-button>
          <el-button v-if="$store.state.permissions_del" @click="deleteClick(scope.row)" type="text"
                     style="color: #f00" size="mini">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                     :page-sizes="[5, 10, 20, 50, 100]" :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="listCount"></el-pagination>
    </div>
    <!--    添加筛选dialog-->
    <el-dialog title="添加筛选" :modal="false" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="选择" label-position="left">
          <el-select size="small" v-model="region" placeholder="选择筛选类别" style="width: 100%">
            <el-option v-for="item in this.filterFields" :key="item.name" :label="item.name"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入筛选内容" label-position="left">
          <el-input size="small" v-model="filterName" placeholder="请输入内容" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>-->
        <el-button size="mini" type="primary" @click="addFilter">添 加</el-button>
        <el-button size="mini" type="primary" @click="sureFilter">查 询</el-button>
      </div>
    </el-dialog>
    <div class="dialog_container">
      <Editor :table_data="tableData" ref="edit"/>
    </div>
  </div>
</template>
<script>
import ExcelBtn from '../views/excel/index'
import Editor from '../views/editor/index'
import Download from './download/index'

export default {
  name: 'home',
  components: {
    ExcelBtn,
    Editor,
    Download,
  },
  data() {
    return {
      tableNameType: 'rkk',
      // tableHeight: (664 / 890) * window.innerHeight,
      tableHeight: window.innerHeight - 238,
      drawer: false,
      // 表格
      tableName: this.common.getLocalStorage('TABLE_NAME'), // 表格名字
      tableData: [], // 表格数据
      tableFields: [], // 表头数据
      // 分页器
      currentPage: 1,
      pageSize: 50,
      listCount: 0,
      AdminData: this.common.getLocalStorage('Token'),
      dynamicTags: [],
      regionData: [],
      region: '',
      dialogFormVisible: false,
      filterName: '',
      filterFieldsmain: [], // 筛选参数选择主
      filterFields: [], // 筛选参数选择
      filterObj: {}, // 筛选条件
      filterSlot: ['GXSJ'], // 排序
      multipleSelection: [], // 批量删除
      checkNum: 0,
    }
  },
  async mounted() {
    this.tableNameType = this.$route.query.type
    // this.tableHeight = (650/900)*window.innerHeight
    // console.log('tableName', this.$store.state.tableName)
    // this.$store.commit('edit','wllz')
    this.getTableLabel()
  },
  filters: {
    filterName(val, filterFields) {
      for (const items of filterFields) {
        if (val === items.key) {
          return items.name
        }
      }
    },
  },
  methods: {
    async getTableLabel() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)',
      })
      // this.tableName = this.$route.query.name
      // const AdminData = this.common.getLocalStorage('Token')
      if (this.AdminData) {
        const fieldData = {
          token: this.AdminData.token,
        }
        const listFields = await this.api.getListStructure(this.tableName, this.tableNameType, fieldData)
        if (listFields.data.meta.status_code == 200) {
          const fields = listFields.data.data.fields
          this.tableFields = JSON.parse(JSON.stringify(fields))
          this.filterFieldsmain = JSON.parse(JSON.stringify(fields))
          this.filterFields = JSON.parse(JSON.stringify(fields))
          // console.log(JSON.parse(JSON.stringify(this.tableFields)))
        } else {
          this.$message.error(listFields.data.meta.errmsg)
        }

        const data = {
          token: this.AdminData.token,
          filter: {},
          order_by: [
            'GXSJ',
          ],
          serializer: 'default',
        }
        const tableJson = {
          name: this.tableName,
          type: this.globals.typeName.rkk,
          page: this.currentPage,
          pageSize: this.pageSize,
        }
        const listData = await this.api.getListData(tableJson, data)
        // const AllData = await this.api.getAllListData(this.tableName, this.globals.typeName.rkk, data)
        // console.log(AllData)
        // console.log(listData)
        loading.close()
        if (listData.data.meta.status_code === 200) {
          this.listCount = listData.data.pagination.total
          this.tableData = listData.data.data
        } else {
          this.$message.error(listData.data.meta.errmsg)
        }
      }

    },
    async getTableData() {
      // eslint-disable-next-line no-unused-vars
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)',
      })
      // const AdminData = this.common.getLocalStorage('Token')
      if (this.AdminData) {
        const data = {
          token: this.AdminData.token,
          filter: this.filterObj,
          order_by: this.filterSlot,
          serializer: 'default',
        }
        const tableJson = {
          name: this.tableName,
          type: this.globals.typeName.rkk,
          page: this.currentPage,
          pageSize: this.pageSize,
        }
        // console.log(tableJson)
        const listData = await this.api.getListData(tableJson, data)
        loading.close()
        if (listData.data.meta.status_code === 200) {
          this.listCount = listData.data.pagination.total
          this.tableData = listData.data.data
        } else {
          this.$message.error(listData.data.meta.errmsg)
        }
      }
    },
    // 多选
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
      this.checkNum = this.multipleSelection.length
    },
    handleCommand(command) {
      // all check
      if (command === 'all') {
        this.deteleAllData()
      } else {
        this.deteleCheckData()
      }
    },
    async deteleAllData() {
      const _this = this
      this.$confirm(`您确定要删除全部数据吗?`, '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async () => {
        const fieldData = {
          token: _this.AdminData.token,
        }
        const resData = await _this.api.deleteAllDataApi(_this.tableName, this.tableNameType, fieldData)
        if (resData.data.meta.errcode === 0) {
          _this.$message.success('删除成功！')
          _this.getTableData()
        } else {
          _this.$message.error(resData.data.meta.errmsg)
        }
      })
    },
    deteleCheckData() {
      console.log(this.multipleSelection)
      const Ids = []
      for (const itemIds of this.multipleSelection) {
        Ids.push(itemIds.id)
      }

      const _this = this
      this.$confirm(`您确定要删除${this.multipleSelection.length}条数据吗?`, '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async () => {
        const fieldData = {
          token: _this.AdminData.token,
          ids: Ids,
        }
        const resData = await _this.api.deleteListData(_this.tableName, this.tableNameType, fieldData)
        if (resData.data.meta.errcode === 0) {
          _this.$message.success('删除成功！')
          for (const itemIds of this.multipleSelection) {
            _this.DeleteTableData(itemIds)
          }
          _this.listCount = _this.listCount - _this.multipleSelection.length
        } else {
          _this.$message.error(resData.data.meta.errmsg)
        }
      })

    },
    // 分页器方法  每页显示条数
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getTableData()
    },
    // 分页器方法  跳转页数执行
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData()
    },
    handleQuery() {
      this.currentPage = 1
      this.searchFilter()
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      delete this.filterObj[tag.tagName + '__contains']
      for (const items of this.filterFieldsmain) {
        if (items.key === tag.tagName) {
          this.filterFields.splice(this.filterFieldsmain.indexOf(items), 0, items)
        }
      }
      this.currentPage = 1
      this.searchFilter()
    },
    showInput() {
      this.dialogFormVisible = true
    },
    // 添加筛选条件
    addFilter() {
      const filterKey = this.region + '__contains'
      const filterShow = {
        tagName: this.region,
        tagValue: this.filterName,
      }
      if (this.filterName) {
        this.dynamicTags.push(filterShow)
        this.filterObj[filterKey] = this.filterName
        for (const items of this.filterFields) {
          if (items.key === this.region) {
            this.filterFields.splice(this.filterFields.indexOf(items), 1)
          }
        }
      }
      this.dialogFormVisible = false
      this.filterName = ''
      this.region = ''
    },
    // 添加筛选条件并查询
    sureFilter() {
      this.addFilter()
      this.searchFilter()
    },
    // 调用筛选
    async searchFilter() {
      this.getTableData()
    },
    // 辅助单元格内容
    celldblClick(row, column, cell, event) {
      const _this = this
      this.$copyText(row[column.property]).then(function (e) {
        _this.$message({
          showClose: true,
          message: '内容已复制',
          type: 'success',
        })
      }, function (e) {
      })
    },
    // 修改/查看
    handleClick(rowValue, status) {
      this.$refs['edit'].showEdit(this.tableFields, rowValue, status)
    },
    // 删除
    async deleteClick(rowValue) {
      const _this = this

      this.$confirm('您确定要删除1条数据吗吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async () => {
        const fieldData = {
          token: _this.AdminData.token,
          ids: [
            rowValue.id,
          ],
        }
        const resData = await _this.api.deleteListData(_this.tableName, this.tableNameType, fieldData)
        if (resData.data.meta.errcode === 0) {
          _this.$message.success('删除成功！')
          _this.DeleteTableData(rowValue)
          _this.listCount--
        } else {
          _this.$message.error(resData.data.meta.errmsg)
        }
      })
    },
    // 添加
    addClick() {
      this.$refs['edit'].showEdit(this.tableFields)
    },
    // 修改本地table数据
    ModifyTableData(modifyData) {
      // modifyData.id
      for (let items of this.tableData) {
        if (items.id === modifyData.id) {
          items = modifyData
        }
      }
      // this.tableData.shift()
      // console.log(this.tableData)
    },
    // 删除本地table数据
    DeleteTableData(deleteData) {
      if (this.tableData.length - 1 > 0) {
        const index = this.tableData.findIndex(function (items) {
          return items.id === deleteData.id
        })
        this.tableData.splice(index, 1)
        console.log('删除后数组sss', this.tableData)
      } else {
        if (this.currentPage - 1 <= 0) {
          this.currentPage = 1
          this.getTableData()
        } else {
          this.currentPage -= 1
          this.getTableData()
        }
      }
    },
    // 添加本地数据
    AddTableData(addData) {
      if (this.tableData.length < 50) {
        this.tableData.push(addData)
        this.listCount++
      } else {
        this.currentPage += 1
        this.getTableData()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import "src/assets/css/rpx";

.el-dropdown-menu {
  .el-dropdown-menu__item {
    color: #EB5757;
  }
}

.table-container {
  padding: 24px getVw(120);
  font-size: 12px;
  background: #fff;

  .table_search {
    //text-align: right;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;

    .tag_title {
      color: #aaaaaa;
    }

    .el-tag + .el-tag {
      margin-left: 10px;
    }

    .button-new-tag {
      margin-left: 10px;
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
    }

    .btn_delete {
      font-size: 14px;
      border: none;
      background: #FFFFFF;
      color: #EB5757;
      padding: 0;
      //&:hover {
      //  border: solid 1px #EB5757;
      //}
    }

    .btn_add_data {
      font-size: 14px;
      padding: 0;
      border: none;
      background: #FFFFFF;
      color: #333333;

      &:hover {
        color: #2F80ED;
      }
    }
  }
}

.pagination {
  text-align: right;
  padding: 20px;
}

.icon {
  width: 50px;
  height: 50px;
}

.dialog_container {
  background: #F2F2F2;
}

</style>
