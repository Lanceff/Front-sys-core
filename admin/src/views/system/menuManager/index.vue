<template>
  <div style="padding: 30px">
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="title" label="菜单标题" align="center"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon" v-if="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" align="center"></el-table-column>
      <el-table-column prop="name" label="组件名" align="center"></el-table-column>
      <el-table-column prop="path" label="组件路径" align="center">
      </el-table-column>
      <el-table-column prop="component" label="菜单组件" align="center"> </el-table-column>
      <el-table-column prop="type" label="类型" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-if="scope.row.type === 'MENU'">菜单</span>
          <span style="margin-left: 10px" v-else-if="scope.row.type === 'CATALOGUE'">目录</span>
        </template>
      </el-table-column>

      <el-table-column prop="hidden" label="是否隐藏" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.hidden" active-color="#13ce66"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllMenus } from "@/api/system";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    getAllMenus().then((res) => {
      console.log(res.data)
      this.tableData = res.data;
    })
  },
  methods: {
    handleEdit(index, id) {
      
    },
    handleDelete(index, id) {
      
    }
  }
};
</script>
