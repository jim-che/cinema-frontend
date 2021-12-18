<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="影院名字" prop="cinemaName">
        <el-input
          v-model="queryParams.cinemaName"
          placeholder="请输入影院名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="员工工种" prop="employeeType">
        <el-select v-model="queryParams.employeeType" placeholder="请选择员工工种" clearable size="small">
          <el-option
            v-for="dict in dict.type.employee_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['manage:employee:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="employeeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增编号" align="center" prop="id" />
      <el-table-column label="影院编号" align="center" prop="cinemaId" />
      <el-table-column label="影院名字" align="center" prop="cinemaName" />
      <el-table-column label="员工工种" align="center" prop="employeeType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.employee_type" :value="scope.row.employeeType"/>
        </template>
      </el-table-column>
      <el-table-column label="员工编号" align="center" prop="employeeId" />
      <el-table-column label="上班时间" align="center" prop="workHours" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:employee:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:employee:remove']"
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

    <!-- 添加或修改员工管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="影院编号" prop="cinemaId">
          <el-input v-model="form.cinemaId" placeholder="请输入影院编号" />
        </el-form-item>
        <el-form-item label="员工工种" prop="employeeType">
          <el-select v-model="form.employeeType" placeholder="请选择员工工种">
            <el-option
              v-for="dict in dict.type.employee_type"
              :key="dict.value"
              :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上班时间" prop="workHours">
          <el-time-picker
            v-model="form.workHours"
            value-format="HH:mm:ss"
            placeholder="请输入上班时间">
          </el-time-picker>
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
import { listEmployee, getEmployee, delEmployee, addEmployee, updateEmployee } from "@/api/manage/employee";

export default {
  name: "Employee",
  dicts: ['employee_type'],
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
      // 员工管理表格数据
      employeeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cinemaName: null,
        employeeType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cinemaId: [
          { required: true, message: "影院编号不能为空", trigger: "blur" }
        ],
        cinemaName: [
          { required: true, message: "影院名字不能为空", trigger: "blur" }
        ],
        employeeType: [
          { required: true, message: "员工工种不能为空", trigger: "change" }
        ],
        employeeId: [
          { required: true, message: "员工编号不能为空", trigger: "blur" }
        ],
        workHours: [
          { required: true, message: "上班时间不能为空", trigger: "blur" }
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
    /** 查询员工管理列表 */
    getList() {
      this.loading = true;
      listEmployee(this.queryParams).then(response => {
        this.employeeList = response.rows;
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
        cinemaId: null,
        cinemaName: null,
        employeeType: null,
        employeeId: null,
        workHours: null,
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
      this.title = "添加员工管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEmployee(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改员工管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEmployee(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEmployee(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除员工管理编号为"' + ids + '"的数据项？').then(function() {
        return delEmployee(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('manage/employee/export', {
        ...this.queryParams
      }, `employee_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
