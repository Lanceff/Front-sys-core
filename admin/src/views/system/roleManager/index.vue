<template>
  <div style="padding: 30px">
    <el-button type="primary" icon="el-icon-plus" style="margin-bottom:1%" @click="addRole">添加角色</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
      <el-table-column prop="roleSign" label="角色标识" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
      <el-table-column prop="updateBy" label="操作人" align="center"></el-table-column>
      <el-table-column label="操作" align="center" min-width="100%">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleAssignMenu(scope.row.id)">分配菜单</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑角色" :visible.sync="isShowEditDialog" center v-if="isShowEditDialog" width="30%">
      <el-form ref="form" :model="form" :rules="editRules" label-width="150px" style="width:90%;padding-bottom:0px">
        <el-form-item label="角色id：" required prop="id" v-show="false">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：" required prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色标识：" required prop="roleSign">
          <el-input v-model="form.roleSign"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form',form.opType)">提交</el-button>
        <el-button @click="isShowEditDialog = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配菜单" :visible.sync="isShowMenuDialog" center v-if="isShowMenuDialog" width="30%">
      <div style="min-height:300px">
        <el-tree :data="menuTree" show-checkbox node-key="id" :props="defaultProps" :default-checked-keys="selectKeys||[]" highlight-current>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAssignMenus(form.opType)">确定</el-button>
        <el-button @click="isShowEditDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRole,getRoleMenuId } from "@/api/role";
import { getAllMenus } from "@/api/menu";
import _ from 'lodash'

export default {
  data() {
    return {
      tableData: [{ roleName: "a" }],
      isShowEditDialog: false,
      isShowMenuDialog: false,
      form: {},
      editRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleSign: [{ required: true, message: '请输入角色标识', trigger: 'blur' }]
      },
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
    getAllRole().then((res) => {
      this.tableData = res.data;
    })
  },
  methods: {
    addRole() {
      this.form = {
        opType: 'add'
      }
      this.isShowEditDialog = true
    },
    handleEdit(row) {
      this.form = _.cloneDeep(row)
      this.form.opType = 'edit'
      this.isShowEditDialog = true
    },
    handleDelete(roleId) {

    },
    handleAssignMenu(roleId) {
      getAllMenus().then(res => {
        this.menuTree = res.data
        return getRoleMenuId(roleId)
      }).then(res => {
        this.selectKeys = res.data
        this.isShowMenuDialog = true
      })

    }
  }
}
</script>