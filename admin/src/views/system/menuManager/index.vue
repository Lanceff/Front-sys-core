<template>
  <div style="padding: 30px">
    <el-button type="primary" icon="el-icon-plus" style="margin-bottom:1%" @click="addRootMenu">添加菜单</el-button>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border :cell-style="cellStyle" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" ref="table">
      <el-table-column prop="title" label="菜单标题" align="center"></el-table-column>
      <el-table-column prop="menuType" label="类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menuType === 'MENU'" type="success" effect="dark" size="small">菜单</el-tag>
          <el-tag v-else-if="scope.row.menuType === 'CATALOGUE'" type="warning" effect="dark" size="small">目录</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon" v-if="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" align="center"></el-table-column>
      <el-table-column prop="path" label="组件路径" align="center">
      </el-table-column>
      <el-table-column prop="component" label="菜单组件" align="center"> </el-table-column>
      <el-table-column prop="hidden" label="是否隐藏" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.hidden" active-color="#13ce66" @change="updateMenuHidden(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100%">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleAdd(scope.row)">新增</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑菜单" :visible.sync="isShowEditDialog" center v-if="isShowEditDialog" width="32%">
      <el-form ref="form" :model="form" :rules="editRules" label-width="150px" style="width:90%;padding-bottom:0px">
        <el-form-item label="上级菜单id" required prop="pid" v-show="false">
          <el-input v-model="form.pid"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="pTitle">
          <el-input v-if="form.pTitle" v-model="form.pTitle" disabled></el-input>
          <el-input v-else value="根菜单" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单标题：" required prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="类型：" required prop="menuType">
          <el-radio-group v-model="form.menuType">
            <el-radio label="CATALOGUE">目录</el-radio>
            <el-radio label="MENU">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单图标：" prop="icon">
          <e-icon-picker v-model="form.icon" :options="options" />
        </el-form-item>
        <el-form-item label="菜单排序：" prop="orderNum">
          <el-input v-model="form.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径：" required prop="path">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="组件路径：" required prop="component">
          <el-input v-model="form.component"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form',form.opType)">提交</el-button>
        <el-button @click="isShowEditDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getAllMenus } from "@/api/menu";
import { createMenu, updateMenu, deleteMenu, updateMenuHidden } from "@/api/menu";
import { EIconPicker } from 'e-icon-picker';
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      tableData: [],
      isShowEditDialog: false,
      form: {},
      editRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        menuType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }]
      },
      options: {
        FontAwesome: false,
        ElementUI: true,
        eIcon: false,//自带的图标，来自阿里妈妈
        eIconSymbol: false,//是否开启彩色图标
        addIconList: [],
        removeIconList: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  components: { EIconPicker },
  created() {
    getAllMenus().then((res) => {
      this.tableData = res.data;
    })
  },
  methods: {
    reloadTable() {
      getAllMenus().then((res) => {
        this.tableData = res.data;
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        return "text-align:left;padding-left:2% !important;"
      } else {
        return '';
      }
    },
    //修改隐藏
    updateMenuHidden(row) {
      let that = this;
      this.$confirm('此操作将隐藏该菜单和所有子菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return updateMenuHidden(row.id, row.hidden);
      }).then(res => {
        that.$message({
          type: 'success',
          message: '操作成功!'
        });
        setTimeout(function () {
          location.reload();
        }, 500)

      }).catch(err => {
        //还原
        row.hidden = !row.hidden
      })
    },
    addRootMenu() {
      this.form = {
        pid: 0,
        opType: 'add'
      }
      this.isShowEditDialog = true
    },
    handleAdd(row) {
      this.form = {
        pid: row.id,
        pTitle: row.title,
        opType: 'add'
      }
      this.isShowEditDialog = true
    },
    handleEdit(row) {
      this.form = _.cloneDeep(row)
      this.form.opType = 'edit'
      this.isShowEditDialog = true
    },
    handleDelete(id) {
      let that = this
      this.$confirm('此操作将删除此菜单以及菜单和所有子菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteMenu(id)
      }).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        setTimeout(function () {
          that.reloadTable();
        }, 500)
      })
    },
    //新增或修改菜单
    submitForm(formName, opType) {
      let that = this
      let { children, pTitle, ...formData } = this.form;
      formData.updateBy = this.userInfo.username
      delete formData.opType
      console.log(formData)
      this.$refs[formName].validate(valid => {
        if (valid) {
          let asyncRequest;
          if (opType == 'add') {
            asyncRequest = createMenu(formData);
          } else {
            asyncRequest = updateMenu(formData);
          }
          asyncRequest.then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            setTimeout(function () {
              that.reloadTable();
              that.isShowEditDialog = false
            }, 500)
          })
        } else {
          this.$message({
            type: 'error',
            message: '校验失败!'
          })
          return false;
        }
      })
    }
  }
}
</script>
<style lang="css" scoped>
@import "~e-icon-picker/lib/index.css";
@import "~font-awesome/css/font-awesome.min.css";
@import "~element-ui/lib/theme-chalk/icon.css";
</style>
