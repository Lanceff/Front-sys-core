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
        <el-select v-model="searchForm.roleId" placeholder="请选择用户角色">
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
          <el-tag v-else-if="scope.row.status==0" size="mini" type='info' effect="dark">正常</el-tag>
          <el-tag v-else size="mini" type='danger' effect="dark">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100%">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">禁用</el-button>
          <el-button size="mini" type="success" @click="showAssignMenu(scope.row.id)">分配角色</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="pageParam.pageNo" :page-sizes="[5, 10, 20, 40]" :page-size="pageParam.pageize" :total="pageParam.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top:2%">
    </el-pagination>
  </div>
</template>

<script>
import { getAllRole } from '@/api/role';
import { getAllUser } from '@/api/user';
export default {
  data() {
    return {
      pageParam: {
        pageNo: 1,
        pageize: 10
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
      this.pageParam = this.pageParam.concat(this.searchForm)
      this.reloadTable()
    },
    handleSizeChange(val) {
      this.pageParam.pagesize = val;
      this.reloadTable()
    },
    handleCurrentChange(val) {
      this.pageParam.currentPage = val;
      this.reloadTable()
    }
  }
}
</script>