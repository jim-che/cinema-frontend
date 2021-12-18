<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="员工编号" prop="employeeId">
        <el-input
          v-model="queryParams.employeeId"
          placeholder="请输入员工编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="员工姓名" prop="employeeName">
        <el-input
          v-model="queryParams.employeeName"
          placeholder="请输入员工姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全勤奖金" prop="bonus">
        <el-input
          v-model="queryParams.bonus"
          placeholder="请输入全勤奖金"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['compensation:bonus:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['compensation:bonus:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['compensation:bonus:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['compensation:bonus:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bonusList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增编号" align="center" prop="id" />
      <el-table-column label="员工编号" align="center" prop="employeeId" />
      <el-table-column label="员工姓名" align="center" prop="employeeName" />
      <el-table-column label="考勤天数" align="center" prop="checkDays" />
      <el-table-column label="全勤奖金" align="center" prop="bonus" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['compensation:bonus:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['compensation:bonus:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改全勤奖金管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工编号" prop="employeeId">
          <el-input v-model="form.employeeId" placeholder="请输入员工编号" />
        </el-form-item>
        <el-form-item label="考勤天数" prop="checkDays">
          <el-input v-model="form.checkDays" placeholder="请输入考勤天数" />
        </el-form-item>
        <el-form-item label="全勤奖金" prop="bonus">
          <el-input v-model="form.bonus" placeholder="请输入全勤奖金" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBonus, getBonus, delBonus, addBonus, updateBonus } from "@/api/compensation/bonus";

export default {
  name: "Bonus",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 全勤奖金管理表格数据
      bonusList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeId: null,
        employeeName: null,
        bonus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        employeeId: [
          { required: true, message: "员工编号不能为空", trigger: "blur" }
        ],
        employeeName: [
          { required: true, message: "员工姓名不能为空", trigger: "blur" }
        ],
        checkDays: [
          { required: true, message: "考勤天数不能为空", trigger: "blur" }
        ],
        isDeleted: [
          { required: true, message: "是否删除不能为空", trigger: "blur" }
        ],
        bonus: [
          { required: true, message: "全勤奖金不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询全勤奖金管理列表 */
    getList() {
      this.loading = true;
      listBonus(this.queryParams).then(response => {
        this.bonusList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        employeeId: null,
        employeeName: null,
        checkDays: null,
        isDeleted: null,
        bonus: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加全勤奖金管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBonus(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改全勤奖金管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBonus(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBonus(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除全勤奖金管理编号为"' + ids + '"的数据项？').then(function() {
        return delBonus(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('compensation/bonus/export', {
        ...this.queryParams
      }, `bonus_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
