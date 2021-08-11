<template>
  <div style="padding:30px;">
    <el-form :inline="true" :model="searchForm" size="small" ref="searchForm">
      <el-form-item label="用户ID" prop="id">
        <el-input v-model="searchForm.id" placeholder="请输入用户id"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="searchForm.nickName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="roleId">
        <el-select v-model="searchForm.roleId" placeholder="请选择用户角色" clearable>
          <el-option v-for="item in roles" :label="item.roleName" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="resetForm('searchForm')" type="danger">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="用户id" align="center" width="80%"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center"></el-table-column>
      <el-table-column prop="nickName" label="用户昵称" align="center"></el-table-column>
      <el-table-column prop="avatar" label="头像" align="center" width="80%">
        <template slot-scope="scope">
          <el-avatar size="large" shape="square" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="用户角色" align="center">
        <template slot-scope="scope">
          <span v-for="(role,index) in scope.row.roles" :key="role.id">
            {{role.roleName}}<span v-if="scope.row.roles.length>1 && index!=scope.row.roles.length-1">，</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" align="center" width="80%">
        <template slot-scope="scope">
          <span v-if="scope.row.sex==1">男</span>
          <span v-else-if="scope.row.sex==0">女</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="birth" label="生日" align="center"></el-table-column>
      <el-table-column prop="tel" label="手机号" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="80%">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" size="mini" ype='success' effect="dark">正常</el-tag>
          <el-tag v-else-if="scope.row.status==0" size="mini" type='info' effect="dark">禁用</el-tag>
          <el-tag v-else size="mini" type='danger' effect="dark">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100%">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleForbid(scope.row.id,0)" v-if="scope.row.status==1">禁用</el-button>
          <el-button size="mini" type="info" @click="handleForbid(scope.row.id,1)" v-else>解禁</el-button>
          <el-button size="mini" type="success" @click="showAssignRole(scope.row)">分配角色</el-button>
          <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="pageParam.pageNo" :page-sizes="[5, 10, 20, 40]" :page-size="pageParam.pageSize" :total="pageParam.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top:2%">
    </el-pagination>

    <el-dialog title="分配角色" :visible.sync="isShowEditDialog" center v-if="isShowEditDialog" width="32%" destroy-on-close>
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="(item , index) in roles" :label="item.id" :key="'role_' + index">{{item.roleName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRole(userId)">确认分配</el-button>
        <el-button @click="isShowEditDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllRole } from '@/api/role';
import { getAllUser, forbidUser, assignUserRole } from '@/api/user';
export default {
  data() {
    return {
      checkList: [],
      isShowEditDialog: false,
      pageParam: {
        pageNo: 1,
        pageSize: 10
      },
      roles: [],
      searchForm: {
      },
      tableData: []
    }
  },
  created() {
    getAllRole().then(res => {
      this.roles = res.data
      return getAllUser(this.pageParam)
    }).then(res => {
      this.tableData = res.data.data
      this.pageParam.total = res.data.total
    }).catch(err => {
      this.$message({
        type: 'error',
        message: '加载失败!'
      });
    })
  },
  methods: {
    reloadTable() {
      getAllUser(this.pageParam).then(res => {
        this.tableData = res.data.data
        this.pageParam.total = res.data.total
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '加载失败!'
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    search() {
      this.pageParam = { ...this.pageParam, ...this.searchForm }
      this.reloadTable()
    },
    handleSizeChange(val) {
      this.pageParam.pageSize = val;
      this.reloadTable()
    },
    handleCurrentChange(val) {
      this.pageParam.currentPage = val;
      this.reloadTable()
    },
    handleForbid(id, status) {
      let that = this
      forbidUser(id, status).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        setTimeout(function () {
          that.reloadTable()
        }, 500)
      })
    },
    showAssignRole(row) {
      this.userId = row.id
      this.isShowEditDialog = true
      this.checkList = row.roles.map(item => { return item.id })
    },
    submitRole(userId) {
      let data = { data: this.checkList };
      let that = this
      console.log(data)
      assignUserRole(userId, data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          setTimeout(function () {
            that.isShowEditDialog = false
            that.reloadTable()
          }, 500)
        });
    }
  }
}
</script>