<template>
  <div style="padding: 30px">
    <el-button type="primary" icon="el-icon-plus" style="margin-bottom:1%" @click="addRootMenu">添加菜单</el-button>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
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
          <el-switch v-model="scope.row.hidden" active-color="#13ce66"></el-switch>
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

    <el-dialog title="编辑" :visible.sync="isShowEditDialog" center width="35%" destroy-on-close>
      <el-form ref="form" :model="form" :rules="editRules" label-width="150px" style="width:90%">
        <el-form-item label="上级菜单id" required prop="pid" v-show="false">
          <el-input v-model="form.pid"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" required>
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
        <el-form-item label="菜单图标：">
          <el-input v-model="form.icon">
            <el-button slot="append" icon="el-icon-s-grid"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="菜单排序：">
          <el-input v-model="form.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径：" required prop="path">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="组件路径：" required prop="component">
          <el-input v-model="form.component" :disabled="form.pid==0"></el-input>
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="submitForm('form',form.opType)">提交</el-button>
          <el-button @click="isShowEditDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getAllMenus } from "@/api/system";
import { createMenu, updateMenu, deleteMenu } from "@/api/menu";
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
      }
    }
  },
  created() {
    getAllMenus().then((res) => {
      console.log(res.data)
      this.tableData = res.data;
    })
  },
  methods: {
    addRootMenu() {
      this.form = {
        pid: 0,
        component: 'Layout',
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
      this.form = row
      this.form.opType = 'edit'
      this.isShowEditDialog = true
    },
    handleDelete(id) {
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
      }).catch(() => {

      });
    },
    submitForm(formName, opType) {
      let { children, pTitle, ...formData } = this.form;
      let that = this;
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
            that.$message({
              type: 'success',
              message: '操作成功!'
            });
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    }

  }
}
</script>