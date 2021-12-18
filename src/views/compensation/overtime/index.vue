<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="员工姓名" prop="employeeName">
        <el-input
          v-model="queryParams.employeeName"
          placeholder="请输入员工姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="加班日期" prop="overtimeDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.overtimeDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择加班日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="加班时长" prop="overtimeLength">
        <el-input
          v-model="queryParams.overtimeLength"
          placeholder="请输入加班时长"
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
          v-hasPermi="['compensation:overtime:add']"
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
          v-hasPermi="['compensation:overtime:edit']"
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
          v-hasPermi="['compensation:overtime:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['compensation:overtime:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="overtimeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增编号" align="center" prop="id" />
      <el-table-column label="员工编号" align="center" prop="employeeId" />
      <el-table-column label="员工姓名" align="center" prop="employeeName" />
      <el-table-column label="加班日期" align="center" prop="overtimeDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.overtimeDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加班时长" align="center" prop="overtimeLength" />
      <el-table-column label="加班工资" align="center" prop="overtimeWage" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['compensation:overtime:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['compensation:overtime:remove']"
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

    <!-- 添加或修改加班薪资管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工编号" prop="employeeId">
          <el-input v-model="form.employeeId" placeholder="请输入员工编号" />
        </el-form-item>
        <el-form-item label="加班日期" prop="overtimeDate">
          <el-date-picker clearable size="small"
            v-model="form.overtimeDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择加班日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="加班时长" prop="overtimeLength">
          <el-input v-model="form.overtimeLength" placeholder="请输入加班时长" />
        </el-form-item>
        <el-form-item label="加班工资" prop="overtimeWage">
          <el-input v-model="form.overtimeWage" placeholder="请输入加班工资" />
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
import { listOvertime, getOvertime, delOvertime, addOvertime, updateOvertime } from "@/api/compensation/overtime";

export default {
  name: "Overtime",
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
      // 加班薪资管理表格数据
      overtimeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeName: null,
        overtimeDate: null,
        overtimeLength: null,
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
        overtimeDate: [
          { required: true, message: "加班日期不能为空", trigger: "blur" }
        ],
        overtimeLength: [
          { required: true, message: "加班时长不能为空", trigger: "blur" }
        ],
        overtimeWage: [
          { required: true, message: "加班工资不能为空", trigger: "blur" }
        ],
        isDeleted: [
          { required: true, message: "是否删除不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询加班薪资管理列表 */
    getList() {
      this.loading = true;
      listOvertime(this.queryParams).then(response => {
        this.overtimeList = response.rows;
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
        overtimeDate: null,
        overtimeLength: null,
        overtimeWage: null,
        isDeleted: null
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
      this.title = "添加加班薪资管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOvertime(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改加班薪资管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOvertime(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOvertime(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除加班薪资管理编号为"' + ids + '"的数据项？').then(function() {
        return delOvertime(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('compensation/overtime/export', {
        ...this.queryParams
      }, `overtime_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
