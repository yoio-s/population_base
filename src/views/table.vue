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
        <el-button v-if="AdminData.mobile === '18202315651'" size="mini" style="margin-right: 8px" type="primary"
                   @click="handleEntry">
          跨系统录入
        </el-button>
      </div>
      <div style="display: flex">
        <div style="display: flex" v-if="$store.state.permissions_add">
          <el-dropdown style="margin-right: 16px; cursor: pointer" @command="handleCommand">
            <span class="el-dropdown-link btn_delete">
              <i class="el-icon-delete"></i> 批量删除
            </span>
            <el-dropdown-menu class="drop_delete" slot="dropdown">
              <el-dropdown-item command="all">删除全部</el-dropdown-item>
              <el-dropdown-item command="check">删除选中 ({{ checkNum }}条)</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown style="margin-right: 16px; cursor: pointer" :hide-on-click="false" @command="handleCheckCommand">
            <span class="el-dropdown-link btn_field_show">
              <i class="el-icon-s-grid"></i> 显示字段
            </span>
            <el-dropdown-menu class="drop_field_filter" slot="dropdown">
              <el-dropdown-item v-for="field in tableFields" :key="field.id" :command="field.key"
                                :style="tableFieldsCheck.some(e => e.key === field.key) ? 'color: #2f80ed':''">
                {{ field.name }}<i v-if="tableFieldsCheck.some(e => e.key === field.key)" class="el-icon-check"></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button class="btn_add_data" style="margin-right: 16px" icon="el-icon-plus" type="primary" plain
                     size="mini"
                     @click="addClick()">添加
          </el-button>
          <ExcelBtn></ExcelBtn>
        </div>
        <!--        <el-button style="margin-left: 16px" plain size="mini" >下载数据</el-button>-->
        <Download :filter="filterObj"></Download>
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
        v-for="items in tableFieldsCheck"
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
    <el-dialog class="filter_dialog" title="添加筛选" :modal="false" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="100px">
        <el-form-item label="选择" label-position="left">
          <el-select size="small" v-model="region" placeholder="选择筛选类别" style="width: 100%">
            <el-option v-for="item in this.filterFields" :key="item.name" :label="item.name"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="filter_select_item" label="筛选内容" label-position="left">
          <el-select style="min-width: 30px; max-width: 90px" v-model="filterValueType" size="small" placeholder="请选择">
            <el-option label="包含" value="contains"></el-option>
            <el-option label="为空" value="null"></el-option>
            <el-option label="不为空" value="notNull"></el-option>
          </el-select>
          <el-input v-if="filterValueType==='contains'" size="small" v-model="filterName" placeholder="请输入内容"
                    style="width: 100%; margin-left: 16px"></el-input>
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
import { Toast } from 'vant'

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
      tableFieldsCheck: [],
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
      filterValueType: '',
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
    const pop_cached_filters = sessionStorage.getItem('pop_cached_filters')
    if (pop_cached_filters) {
      this.dynamicTags = JSON.parse(pop_cached_filters)
    }
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
          this.tableFieldsCheck = JSON.parse(JSON.stringify(fields))
          this.filterFieldsmain = JSON.parse(JSON.stringify(fields))
          this.filterFields = JSON.parse(JSON.stringify(fields))
          // console.log(JSON.parse(JSON.stringify(this.tableFields)))
          // 存储字段隐藏数据
          const tableFields = this.common.getLocalStorage(this.tableName + 'TABLE_HIDDEN')
          if (tableFields) {
            this.tableFieldsCheck = tableFields
          } else {
            this.common.setLocalStorage(this.tableName + 'TABLE_HIDDEN', this.tableFieldsCheck)
          }
        } else {
          if (listFields.data.meta.errcode === 4103) {
            Toast('账户验证失败，请重新登录')
            this.$router.push('/loginRkk')
          } else {
            this.$message.error(listFields.data.meta.errmsg)
          }
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
        loading.close()
        if (listData.data.meta.status_code === 200) {
          this.listCount = listData.data.pagination.total
          this.tableData = listData.data.data
        } else {
          if (listData.data.meta.errcode === 4103) {
            Toast('账户验证失败，请重新登录')
            this.$router.push('/loginRkk')
          } else {
            this.$message.error(listData.data.meta.errmsg)
          }
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
          if (listData.data.meta.errcode === 4103) {
            Toast('账户验证失败，请重新登录')
            this.$router.push('/loginRkk')
          } else {
            this.$message.error(listData.data.meta.errmsg)
          }
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
    handleCheckCommand(command) {
      const index = this.tableFieldsCheck.findIndex(field => {
        return field.key === command
      })
      if (index !== -1) {
        this.tableFieldsCheck.splice(index, 1)
      } else {
        const findIndex = this.tableFields.findIndex(field => {
          return field.key === command
        })
        const item = this.tableFields.find(field => {
          return field.key === command
        })
        this.tableFieldsCheck.splice(findIndex, 0, item)
        // this.tableFieldsCheck.push()
      }
      this.common.setLocalStorage(this.tableName + 'TABLE_HIDDEN', this.tableFieldsCheck)
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
          if (resData.data.meta.errcode === 4103) {
            Toast('账户验证失败，请重新登录')
            _this.$router.push('/loginRkk')
          } else {
            _this.$message.error(resData.data.meta.errmsg)
          }
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
          if (resData.data.meta.errcode === 4103) {
            Toast('账户验证失败，请重新登录')
            _this.$router.push('/loginRkk')
          } else {
            _this.$message.error(resData.data.meta.errmsg)
          }
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

    async handleEntry() {
      const parames = {
        userName: this.tableData[0].Name,
        mPhone: this.tableData[0].PhoneNum,
        cardId: this.tableData[0].CertificateNum,
        bljc: this.tableData[0].test1,
        styc: this.tableData[0].test2,
        jkm: this.tableData[0].test3,
        jwlj: this.tableData[0].test4,
        swlj: this.tableData[0].test5,
        houseNumber: this.tableData[0].test6,
        lydz: this.tableData[0].test7,
        cfrq: this.tableData[0].test8,
        darq: this.tableData[0].test9,
        jzd: this.tableData[0].test10,
        jzdz: this.tableData[0].test11,
        jtgj: this.tableData[0].test12,
        bblx: this.tableData[0].test14,
        hsbg: this.tableData[0].test6,
      }
      await this.api.postEntry(parames)
    },

    handleClose(tag) {
      let deleteKey = '';
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)

      for (const objKey in this.filterObj) {
        if (objKey.includes(tag.tagName)) {
          deleteKey = objKey
        }
      }
      delete this.filterObj[deleteKey]
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
      // NM__in:[null] 为空
      // NM__nin:[null] 不为空
      let filterKey;
      const filterShow = {};
      switch (this.filterValueType) {
        case 'contains' :
          if (this.filterName) {
            filterKey = this.region + '__contains'
            filterShow['tagName'] = this.region
            filterShow['tagValue'] = this.filterName
            this.dynamicTags.push(filterShow)
            this.filterObj[filterKey] = this.filterName
          }
          break
        case 'null':
          filterKey = this.region + '__in'
          filterShow['tagName'] = this.region
          filterShow['tagValue'] = '空'
          this.dynamicTags.push(filterShow)
          this.filterObj[filterKey] = [null]
          break
        case 'notNull':
          filterKey = this.region + '__nin'
          filterShow['tagName'] = this.region
          filterShow['tagValue'] = '非空'
          this.dynamicTags.push(filterShow)
          this.filterObj[filterKey] = [null]
          break
        default:
          return false
          break
      }

      for (const items of this.filterFields) {
        if (items.key === this.region) {
          this.filterFields.splice(this.filterFields.indexOf(items), 1)
        }
      }
      this.dialogFormVisible = false
      this.filterName = ''
      this.region = ''
      this.filterValueType = ''
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
          if (resData.data.meta.errcode === 4103) {
            Toast('账户验证失败，请重新登录')
            _this.$router.push('/loginRkk')
          } else {
            _this.$message.error(resData.data.meta.errmsg)
          }
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

.drop_delete {
  .el-dropdown-menu__item {
    color: #EB5757;
  }
}

.drop_field_filter {
  .el-dropdown-menu__item {
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333333;
    font-size: 14px;
    font-weight: 500;
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

    .btn_field_show {
      font-size: 14px;
      color: #333333;
      font-weight: 500;
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

::v-deep {
  .filter_dialog {
    .el-dialog {
      min-width: 450px;
    }
  }

  .filter_select_item {
    .el-form-item__content {
      margin-left: 100px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
}


</style>
