import {
  Button,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  Input,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Drawer,
  Dialog,
  Select,
  Option,
  Tag,
  PageHeader,
  DatePicker,
  Cascader,
  Progress,
  Loading,
  MessageBox,
  Message,
  Notification,
} from 'element-ui'

const element = {
  install: function (Vue) {
    Vue.use(Button)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Pagination)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(Dropdown)
    Vue.use(DropdownMenu)
    Vue.use(DropdownItem)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Drawer)
    Vue.use(Dialog)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Tag)
    Vue.use(PageHeader)
    Vue.use(DatePicker)
    Vue.use(Cascader)
    Vue.use(Progress)
    Vue.prototype.$loading = Loading.service
    Vue.prototype.$message = Message
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$notify = Notification
  },
}

export default element
