<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="影院名" prop="cinemaName">
        <el-input
          v-model="queryParams.cinemaName"
          placeholder="请输入影院名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="影片名称" prop="movieName">
        <el-input
          v-model="queryParams.movieName"
          placeholder="请输入影片名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="座位号" prop="seatId">
        <el-input
          v-model="queryParams.seatId"
          placeholder="请输入座位号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="距离开场时间" prop="distance">
        <el-input
          v-model="queryParams.distance"
          placeholder="请输入距离开场时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否批准" prop="isApprove">
        <el-select v-model="queryParams.isApprove" placeholder="请选择是否批准" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_yes_no"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目前状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择目前状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.exchange_status"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ticket:exchange:add']"
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
          v-hasPermi="['ticket:exchange:edit']"
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
          v-hasPermi="['ticket:exchange:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ticket:exchange:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="exchangeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增编号" align="center" prop="id" />
      <el-table-column label="影院编号" align="center" prop="cinemaId" />
      <el-table-column label="影院名" align="center" prop="cinemaName" />
      <el-table-column label="影片编号" align="center" prop="movieId" />
      <el-table-column label="影片名称" align="center" prop="movieName" />
      <el-table-column label="场次编号" align="center" prop="sessionId" />
      <el-table-column label="影厅编号" align="center" prop="hallId" />
      <el-table-column label="座位号" align="center" prop="seatId" />
      <el-table-column label="距离开场时间" align="center" prop="distance" />
      <el-table-column label="是否批准" align="center" prop="isApprove">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isApprove"/>
        </template>
      </el-table-column>
      <el-table-column label="目前状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.exchange_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ticket:exchange:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ticket:exchange:remove']"
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

    <!-- 添加或修改退换票管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="场次编号" prop="sessionId">
          <el-select v-model="form.sessionId" placeholder="请选择场次编号">
            <el-option
              v-for="item in sessionList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="座位号" prop="seatId">
          <el-input v-model="form.seatId" placeholder="请输入座位号" />
        </el-form-item>
        <el-form-item label="距离开场时间" prop="distance">
          <el-input v-model="form.distance" placeholder="请输入距离开场时间" />
        </el-form-item>
        <el-form-item label="是否批准" prop="isApprove">
          <el-select v-model="form.isApprove" placeholder="请选择是否批准">
            <el-option
              v-for="dict in dict.type.sys_yes_no"
              :key="dict.value"
              :label="dict.label"
:value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目前状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择目前状态">
            <el-option
              v-for="dict in dict.type.exchange_status"
              :key="dict.value"
              :label="dict.label"
:value="parseInt(dict.value)"
            ></el-option>
          </el-select>
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
import { listExchange, getExchange, delExchange, addExchange, updateExchange } from "@/api/ticket/exchange";
import {listSession2} from "@/api/session/session";

export default {
  name: "Exchange",
  dicts: ['sys_yes_no', 'exchange_status'],
  data() {
    return {
      sessionList: [],
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
      // 退换票管理表格数据
      exchangeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cinemaName: null,
        movieName: null,
        seatId: null,
        distance: null,
        isApprove: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cinemaId: [
          { required: true, message: "影院编号不能为空", trigger: "blur" }
        ],
        cinemaName: [
          { required: true, message: "影院名不能为空", trigger: "blur" }
        ],
        movieId: [
          { required: true, message: "影片编号不能为空", trigger: "blur" }
        ],
        movieName: [
          { required: true, message: "影片名称不能为空", trigger: "blur" }
        ],
        sessionId: [
          { required: true, message: "场次编号不能为空", trigger: "blur" }
        ],
        hallId: [
          { required: true, message: "影厅编号不能为空", trigger: "blur" }
        ],
        seatId: [
          { required: true, message: "座位号不能为空", trigger: "blur" }
        ],
        distance: [
          { required: true, message: "距离开场时间不能为空", trigger: "blur" }
        ],
        isApprove: [
          { required: true, message: "是否批准不能为空", trigger: "change" }
        ],
        status: [
          { required: true, message: "目前状态不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询退换票管理列表 */
    getList() {
      this.loading = true;
      listExchange(this.queryParams).then(response => {
        this.exchangeList = response.rows;
        this.total = response.total;
        this.loading = false;
        listSession2().then(response => {
          this.sessionList = response.data;
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
        id: null,
        cinemaId: null,
        cinemaName: null,
        movieId: null,
        movieName: null,
        sessionId: null,
        hallId: null,
        seatId: null,
        distance: null,
        isApprove: null,
        status: null
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
      this.title = "添加退换票管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getExchange(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改退换票管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateExchange(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addExchange(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除退换票管理编号为"' + ids + '"的数据项？').then(function() {
        return delExchange(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ticket/exchange/export', {
        ...this.queryParams
      }, `exchange_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
