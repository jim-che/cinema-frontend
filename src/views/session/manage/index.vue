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
      <el-form-item label="影院名称" prop="cinemaName">
        <el-input
          v-model="queryParams.cinemaName"
          placeholder="请输入影院名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="影厅名称" prop="hallName">
        <el-input
          v-model="queryParams.hallName"
          placeholder="请输入影厅名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="影片编号" prop="movieId">
        <el-input
          v-model="queryParams.movieId"
          placeholder="请输入影片编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="语言" prop="language">
        <el-select v-model="queryParams.language" placeholder="请选择语言" clearable size="small">
          <el-option
            v-for="dict in dict.type.language"
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
          v-hasPermi="['session:manage:add']"
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
          v-hasPermi="['session:manage:edit']"
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
          v-hasPermi="['session:manage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['session:manage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="manageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增编号" align="center" prop="id" />
      <el-table-column label="场次编号" align="center" prop="sessionId" />
      <el-table-column label="影院编号" align="center" prop="cinemaId" />
      <el-table-column label="影院名称" align="center" prop="cinemaName" />
      <el-table-column label="影厅编号" align="center" prop="hallId" />
      <el-table-column label="影厅名称" align="center" prop="hallName" />
      <el-table-column label="影片编号" align="center" prop="movieId" />
      <el-table-column label="电影类型" align="center" prop="movieType" />
      <el-table-column label="语言" align="center" prop="language">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.language" :value="scope.row.language"/>
        </template>
      </el-table-column>
      <el-table-column label="场次时间" align="center" prop="sessionTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sessionTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电影时长" align="center" prop="length" />
      <el-table-column label="场次价格" align="center" prop="price" />
      <el-table-column label="已售座位" align="center" prop="soldSeat" />
      <el-table-column label="剩余座位" align="center" prop="surplusSeat" />
      <el-table-column label="提示信息" align="center" prop="tip" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['session:manage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['session:manage:remove']"
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

    <!-- 添加或修改场次管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="影院编号" prop="cinemaId">
          <el-select v-model="form.cinemaId" placeholder="请选择影院编号">
            <el-option
              v-for="item in this.cinemaIds"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="影厅编号" prop="hallId">
          <el-select v-model="form.hallId" placeholder="请输入影厅编号">
            <el-option
              v-for="item in this.hallIds"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="影片编号" prop="movieId">
          <el-select v-model="form.movieId" placeholder="请输入影片编号">
            <el-option
              v-for="item in this.movieIds"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select v-model="form.language" placeholder="请选择语言">
            <el-option
              v-for="dict in dict.type.language"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场次时间" prop="sessionTime">
          <el-date-picker clearable size="small"
            v-model="form.sessionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择场次时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="场次价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入场次价格" />
        </el-form-item>
        <el-form-item label="已售座位" prop="soldSeat">
          <el-input v-model="form.soldSeat" placeholder="请输入已售座位" />
        </el-form-item>
        <el-form-item label="剩余座位" prop="surplusSeat">
          <el-input v-model="form.surplusSeat" placeholder="请输入剩余座位" />
        </el-form-item>
        <el-form-item label="提示信息" prop="tip">
          <el-input v-model="form.tip" placeholder="请输入提示信息" />
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
import { listManage, listManage2, getManage, delManage, addManage, updateManage } from "@/api/session/manage";

export default {
  name: "Manage",
  dicts: ['language'],
  data() {
    return {
      movieIds: [],
      cinemaIds: [],
      hallIds: [],
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
      // 场次管理表格数据
      manageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sessionId: null,
        cinemaName: null,
        hallName: null,
        movieId: null,
        movieType: null,
        language: null,
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
          { required: true, message: "影厅名称不能为空", trigger: "blur" }
        ],
        movieId: [
          { required: true, message: "影片编号不能为空", trigger: "blur" }
        ],
        movieType: [
          { required: true, message: "电影类型不能为空", trigger: "change" }
        ],
        language: [
          { required: true, message: "语言不能为空", trigger: "change" }
        ],
        sessionTime: [
          { required: true, message: "场次时间不能为空", trigger: "blur" }
        ],
        length: [
          { required: true, message: "电影时长不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "场次价格不能为空", trigger: "blur" }
        ],
        soldSeat: [
          { required: true, message: "已售座位不能为空", trigger: "blur" }
        ],
        surplusSeat: [
          { required: true, message: "剩余座位不能为空", trigger: "blur" }
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
    /** 查询场次管理列表 */
    getList() {
      this.loading = true;
      listManage(this.queryParams).then(response => {
        this.manageList = response.rows;
        this.total = response.total;
        this.loading = false;
        listManage2().then(response =>{
          this.movieIds = response.data.movieIds;
          this.cinemaIds = response.data.cinemaIds;
          this.hallIds = response.data.hallIds;
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
        sessionId: null,
        cinemaId: null,
        cinemaName: null,
        hallId: null,
        hallName: null,
        movieId: null,
        movieType: null,
        language: null,
        sessionTime: null,
        length: null,
        price: null,
        soldSeat: null,
        surplusSeat: null,
        tip: null,
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
      this.title = "添加场次管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getManage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改场次管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateManage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addManage(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除场次管理编号为"' + ids + '"的数据项？').then(function() {
        return delManage(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('session/manage/export', {
        ...this.queryParams
      }, `manage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
