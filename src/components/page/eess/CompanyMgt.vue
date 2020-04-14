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
<!--                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">-->
<!--                    <el-option key="1" label="广东省" value="广东省"></el-option>-->
<!--                    <el-option key="2" label="湖南省" value="湖南省"></el-option>-->
<!--                </el-select>-->
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
<!--                <el-table-column label="账户余额">-->
<!--                    <template slot-scope="scope">￥{{scope.row.money}}</template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="头像(查看大图)" align="center">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-image-->
<!--                            class="table-td-thumb"-->
<!--                            :src="scope.row.thumb"-->
<!--                            :preview-src-list="[scope.row.thumb]"-->
<!--                        ></el-image>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="address" label="地址"></el-table-column>-->
<!--                <el-table-column label="状态" align="center">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-tag-->
<!--                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"-->
<!--                        >{{scope.row.state}}</el-tag>-->
<!--                    </template>-->
<!--                </el-table-column>-->

<!--                <el-table-column prop="date" label="注册时间"></el-table-column>-->
                <el-table-column label="操作" width="380" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>

<!--                        <el-button-->
<!--                                type="text"-->
<!--                                icon="el-icon-lx-sort"-->
<!--                                @click="handleRawDataEdit(scope.$index, scope.row)"-->
<!--                        >输入原始数据</el-button>-->

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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="企业名">
                    <el-input v-model="form.companyName"></el-input>
                </el-form-item>
                <!--                <el-form-item label="地址">-->
                <!--                    <el-input v-model="form.address"></el-input>-->
                <!--                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="企业名">
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
    deleteCompanyBatch,

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
        },
        // 保存新增
        saveAdd() {
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
