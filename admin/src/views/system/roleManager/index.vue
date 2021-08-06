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
          <el-button size="mini" type="success" @click="showAssignMenu(scope.row.id)">分配菜单</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑角色" :visible.sync="isShowEditDialog" center v-if="isShowEditDialog" width="30%">
      <el-form ref="form" :model="form" :rules="editRules" label-width="150px" style="width:90%;padding-bottom:0px">
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
        <el-tree :data="menuTree" show-checkbox node-key="id" ref="tree" :props="defaultProps" :default-checked-keys="selectKeys||[]" highlight-current>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAssignMenu(roleId)">确定</el-button>
        <el-button @click="isShowEditDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRole, getRoleMenuId, updateRole, createRole, deleteRole, assignRoleMenu } from "@/api/role";
import { getAllMenus } from "@/api/menu";
import { getLeafMenuIds } from "@/utils/menu"
import _ from 'lodash'
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters([
      'userInfo'
    ])
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
      this.$confirm('此操作将删除此角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteRole(roleId)
      }).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        setTimeout(function () {
          location.reload();
        }, 500)
      })
    },
    showAssignMenu(roleId) {
      getAllMenus().then(res => {
        this.menuTree = res.data
        return getRoleMenuId(roleId)
      }).then(res => {
        let leafMenuIds = getLeafMenuIds(this.menuTree,);
        console.log(leafMenuIds)
        this.selectKeys = res.data.filter((item) => { return !leafMenuIds.includes(item) });

        this.roleId = roleId
        this.isShowMenuDialog = true
      })
    },
    handleAssignMenu(roleId) {
      let checkedMenuId = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
      console.log(checkedMenuId)
      assignRoleMenu(roleId, checkedMenuId)
        .then(res => {
          this.isShowMenuDialog = false;
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    submitForm(formName, opType) {
      let { createTime, updateTime, ...formData } = this.form;
      formData.updateBy = this.userInfo.username
      delete formData.opType
      console.log(formData)
      this.$refs[formName].validate(valid => {
        if (valid) {
          let asyncRequest;
          if (opType == 'add') {
            asyncRequest = createRole(formData);
          } else {
            asyncRequest = updateRole(formData);
          }
          asyncRequest.then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            setTimeout(function () {
              location.reload();
            }, 500)
          })
        } else {
          this.$message({
            type: 'error',
            message: '校验失败!'
          });
          return false;
        }
      })
    }
  }
}
</script>