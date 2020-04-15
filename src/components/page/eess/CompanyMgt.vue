<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 企业管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.keyword" placeholder="请输入企业名称..." class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="companyName" label="企业名称"></el-table-column>
                <el-table-column label="操作" width="380" align="center">
                    <template slot-scope="scope">
                            <el-tag :type="'warning'" v-if="scope.row.userId === 0">
                                {{ '样例企业 无法操作' }}
                            </el-tag>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            v-if="scope.row.userId !== 0"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            v-if="scope.row.userId !== 0"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageNum"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%" @close="resetEditForm">
            <el-form ref="editForm" :model="form" :rules="rules" label-width="70px">
                <el-form-item label="企业名" prop="companyName">
                    <el-input v-model="form.companyName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%" @close="resetAddForm">
            <el-form ref="addForm" :model="form" :rules="rules" label-width="70px">
                <el-form-item label="企业名" prop="companyName">
                    <el-input v-model="form.companyName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {
        getCompanyPaged,
        updateCompany,
        addCompany,
        deleteCompany,
        deleteCompanyBatch, customizeWeight,

    } from '../../../api/index';

export default {
    name: 'basetable',
    data() {
        return {
            query: {

                userId: localStorage.getItem('curUserId'),
                // keyword: '',
                pageNum: 1,
                pageSize: 10
            },

            rules: {
                companyName: [{required: true, message: '不能为空', trigger: 'blur'}],
            },

            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            rawVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            getCompanyPaged(this.query).then(res => {
                // console.log(res);
                this.tableData = res.data.data;
                this.pageTotal = res.data.recordTotal || 50;
            });
        },
        // 触发编辑框
        handleAdd() {
            this.form = {};
            this.addVisible = true;
        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageNum', 1);
            this.$set(this.query, 'keyword', this.query.keyword);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                    let params = {
                        id : row.id,
                        userId : localStorage.getItem('curUserId'),
                    };
                    deleteCompany(params).then(res => {
                        if (res.resultCode === 0) {
                            this.$message.success('删除成功');
                            this.getData();
                        }
                    });
                });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val.map(i => i.id);
        },
        delAllSelection() {
            // 二次确认删除
            this.$confirm('确定要批量删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                let param = {
                    idList : this.multipleSelection,
                    userId : localStorage.getItem('curUserId')
                };
                deleteCompanyBatch(param).then(res => {
                    if (res.resultCode && res.resultCode === 0) {
                        this.$message.success(`批量删除成功`);
                        this.multipleSelection = [];
                        this.getData();
                    }
                });
            });
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },

        // 保存编辑
        saveEdit() {
            this.$refs.editForm.validate(vali => {
                if (vali) {

                    let params = {
                        id: this.form.id,
                        companyName: this.form.companyName
                    };
                    updateCompany(params).then(res => {
                        if (res.resultCode === 0) {
                            this.$message.success(`修改成功`);
                            this.editVisible = false;
                            this.$set(this.tableData, this.idx, this.form);
                            this.getData();
                        }
                    });

                } else {
                    this.$message.error('数据格式校验失败');
                    return false;
                }
            });

        },
        // 保存新增
        saveAdd() {
            this.$refs.addForm.validate(vali => {
                if (vali) {
                    let params = {
                        companyName: this.form.companyName,
                        userId : localStorage.getItem('curUserId'),
                    };
                    addCompany(params).then(res => {
                        if (res.resultCode === 0) {
                            this.$message.success(`新增成功`);
                            this.addVisible = false;
                            this.$set(this.tableData, this.idx, this.form);
                            this.getData();
                        }
                    });
                } else {
                    this.$message.error('数据格式校验失败');
                    return false;
                }
            });


        },

        resetAddForm() {
            this.$refs.addForm.resetFields();
        },
        resetEditForm() {
            this.$refs.editForm.resetFields();
        },


        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNum', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
</style>
