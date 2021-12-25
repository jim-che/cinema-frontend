<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="场次编号" prop="sessionId">
        <el-input
          v-model="queryParams.sessionId"
          placeholder="请输入场次编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="影院编号" prop="cinemaId">
        <el-input
          v-model="queryParams.cinemaId"
          placeholder="请输入影院编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="影院名称" prop="cinemaName">
        <el-input
          v-model="queryParams.cinemaName"
          placeholder="请输入影院名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="影厅编号" prop="hallId">
        <el-input
          v-model="queryParams.hallId"
          placeholder="请输入影厅编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="影厅名" prop="hallName">
        <el-input
          v-model="queryParams.hallName"
          placeholder="请输入影厅名"
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
          v-hasPermi="['session:info:add']"
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
          v-hasPermi="['session:info:edit']"
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
          v-hasPermi="['session:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['session:info:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增编号" align="center" prop="id" />
      <el-table-column label="场次编号" align="center" prop="sessionId" />
      <el-table-column label="影院编号" align="center" prop="cinemaId" />
      <el-table-column label="影院名称" align="center" prop="cinemaName" />
      <el-table-column label="影厅编号" align="center" prop="hallId" />
      <el-table-column label="影厅名" align="center" prop="hallName" />
      <el-table-column label="行数" align="center" prop="rowNumber" />
      <el-table-column label="每行座位" align="center" prop="rowSeats" />
      <el-table-column label="总座位数" align="center" prop="totalSeats" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['session:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['session:info:remove']"
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

    <!-- 添加或修改影厅管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="场次编号" prop="sessionId">
          <el-select v-model="form.sessionId" placeholder="请选择场次编号">
            <el-option
              v-for="item in sessionIds"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行数" prop="rowNumber">
          <el-input v-model="form.rowNumber" placeholder="请输入行数" />
        </el-form-item>
        <el-form-item label="每行座位" prop="rowSeats">
          <el-input v-model="form.rowSeats" placeholder="请输入每行座位" />
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from "@/api/session/info";
import {listSession2} from "@/api/session/session";

export default {
  name: "Info",
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
      // 影厅管理表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sessionId: null,
        cinemaId: null,
        cinemaName: null,
        hallId: null,
        hallName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sessionId: [
          { required: true, message: "场次编号不能为空", trigger: "blur" }
        ],
        cinemaId: [
          { required: true, message: "影院编号不能为空", trigger: "blur" }
        ],
        cinemaName: [
          { required: true, message: "影院名称不能为空", trigger: "blur" }
        ],
        hallId: [
          { required: true, message: "影厅编号不能为空", trigger: "blur" }
        ],
        hallName: [
          { required: true, message: "影厅名不能为空", trigger: "blur" }
        ],
        rowNumber: [
          { required: true, message: "行数不能为空", trigger: "blur" }
        ],
        rowSeats: [
          { required: true, message: "每行座位不能为空", trigger: "blur" }
        ],
        totalSeats: [
          { required: true, message: "总座位数不能为空", trigger: "blur" }
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
    /** 查询影厅管理列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
        listSession2().then(response => {
          this.sessionIds = response.data;
        })
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
        sessionIds: [],
        id: null,
        sessionId: null,
        cinemaId: null,
        cinemaName: null,
        hallId: null,
        hallName: null,
        rowNumber: null,
        rowSeats: null,
        totalSeats: null,
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
      this.title = "添加影厅管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改影厅管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除影厅管理编号为"' + ids + '"的数据项？').then(function() {
        return delInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('session/info/export', {
        ...this.queryParams
      }, `info_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
