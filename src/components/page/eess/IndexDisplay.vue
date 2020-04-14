<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 指标展览
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="align-content: center">
                <schart ref="totalBar" style="width: 100%;height: 300px;align-content: center" canvasId="bar2"
                        :options="options"></schart>
            </div>
        </div>

        <div class="container">
            <div style="font-size: 16px; display: inline">指定企业指标概览</div>
            <div style="align-content: center" >
                <schart ref="selectionBar" style="width: 100%;height: 300px;align-content: center"
                        canvasId="bar" :options="optionsSelection"></schart>
            </div>
        </div>


            <div class="container" style="float: left;width: 270px">
                <div style="font-size: 16px; margin-bottom: 10px">{{ treeCompanyName }}</div>
                <div style="font-size: 16px; margin-bottom: 10px">各项指标细则</div>
                <el-tree :data="treeData" :props="treeProps" v-if="treeVisible" v-loading="!treeVisible"
                ></el-tree>
            </div>
            <div class="container" style="float: right;width: calc(100% - 400px)">
                <div class="handle-box">
                    <el-button
                            type="primary"
                            icon="el-icon-circle-plus-outline"
                            @click="addAllSelection"
                    >批量添加至备选
                    </el-button>
                    <el-button type="primary" icon="el-icon-delete"
                               @click="handleClearSelect"
                               class="handle-del mr10"
                    >清除备选</el-button>
                    <el-input v-model="query.keyword" placeholder="请输入企业名称..." class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
                    <el-table-column prop="indexValue" label="总计评分"></el-table-column>
                    <el-table-column label="操作" width="380" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    icon="el-icon-plus"
                                    @click="handleSelect(scope.row)"
                            >加入比对备选
                            </el-button>

                            <el-button
                                    type="text"
                                    icon="el-icon-lx-sort"
                                    @click="handleTreeView(scope.row)"
                            >展示细则
                            </el-button>
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
import {getIndexByCompanyId,
    getIndexPagedByUserId,
    queryIndexByCompanyIds,
    getIndexTop20ByUserId} from '../../../api/index';
import Schart from "vue-schart";
import indexName from "../../common/IndexNameMap";

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


            options: {
                type: 'bar',
                title: {
                    text: '企业指标TOP10概览'
                },
                // xRorate: 25,
                labels: [],
                datasets: [
                    {
                        data: []
                    },
                ]
            },

            optionsSelection: {
                type: 'bar',
                title: {
                    text: '指定企业指标概览'
                },
                labels: [''],
                datasets: [
                    {
                        data: [0]
                    },
                ]
            },
            treeCompanyName: '',
            selectionList : [],
            selectionVisible : false,



            tableData: [{indexName: '总计  未指定企业', childrenList: []}],
            treeProps: {
                children: 'childrenList',
                label: 'indexName'
            },
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            treeVisible: true,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    components: {
        Schart
    },
    created() {
        this.getData();
        this.getTop();
    },

    methods: {
        getData() {
            getIndexPagedByUserId(this.query).then(res => {
                // console.log(res);
                this.tableData = res.data.data;
                this.pageTotal = res.data.recordTotal || 50;
            });

            let params = {
                companyId : 1,
                userId : localStorage.getItem('curUserId'),
            };
            this.initNameMap();

        },
        getTop() {
            getIndexTop20ByUserId(this.query).then(res => {

                let data = res.data;
                data.forEach(i => {
                    this.options.labels.push(i.companyName);
                    this.options.datasets[0].data.push(i.indexValue);
                });
            });
        },
        initNameMap() {
            this.indexNameMap2 = new Map();
            indexName.forEach(i => {
                this.indexNameMap2.set(i.code, i.name);
            });
        },

        getTableData() {
            getIndexPagedByUserId(this.query).then(res => {
                // console.log(res);
                this.tableData = res.data.data;
                this.pageTotal = res.data.recordTotal || 50;
            });
        },




        // 触发清除备选
        handleClearSelect() {
            this.selectionList = [];
            this.optionsSelection.labels = [''];
            this.optionsSelection.datasets[0].data = [0];
            this.$refs.selectionBar.renderChart();
        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageNum', 1);
            this.$set(this.query, 'keyword', this.query.keyword);
            this.getTableData();
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
        handleTreeView(val) {
            this.treeVisible = false;

            this.treeCompanyName = val.companyName;

            let params = {
                companyId : val.id,
                userId : localStorage.getItem('curUserId'),
            };
            getIndexByCompanyId(params).then(res => {
                this.treeData = [];
                this.treeData.push(res.data);
                this.treeVisible = true;
            });
        },

        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val.map(i => i.companyId);
        },
        addAllSelection() {
            this.selectionList = this.selectionList.concat(this.multipleSelection);
            queryIndexByCompanyIds(this.selectionList).then(res => {
                let data = res.data;
                this.optionsSelection.labels = [];
                this.optionsSelection.datasets[0].data = [];
                data.forEach(i => {
                    this.optionsSelection.labels.push(i.companyName);
                    this.optionsSelection.datasets[0].data.push(i.indexValue);
                    this.$refs.selectionBar.renderChart();
                });
            });
            // this.$refs.selectionBar.renderChart();


        },
        // 加入备选操作
        handleSelect(row) {
            this.selectionList.push(row.companyId);
            this.selectionList = this.arrayUnique(this.selectionList);
            queryIndexByCompanyIds(this.selectionList).then(res => {
                let data = res.data;
                this.optionsSelection.labels = [];
                this.optionsSelection.datasets[0].data = [];
                data.forEach(i => {
                    this.optionsSelection.labels.push(i.companyName);
                    this.optionsSelection.datasets[0].data.push(i.indexValue);
                    this.$refs.selectionBar.renderChart();
                });
            });

        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageNum', val);
            this.getData();
        },

        // 数组去重
        arrayUnique(arr) {
            return Array.from(new Set(arr));
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
.mr10 {
    margin-right: 10px;
}
</style>
