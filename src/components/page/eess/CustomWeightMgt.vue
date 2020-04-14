<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 自定义指标权重管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-warning-outline" @click="handleInit" round>完全初始化权重</el-button>
                <el-button @click="isDrawerShow = true" icon="el-icon-lx-sort" type="primary" style="margin-left: 16px;" round>
                    指标树形关系图
                </el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="indexCode" label="代码" width="55" align="center"></el-table-column>
                <el-table-column prop="indexName" label="指标名称" width="180"></el-table-column>
                <el-table-column prop="indexName" label="指标概述" ></el-table-column>
                <el-table-column prop="weight" label="权重值" align="center">
                        <template slot-scope="scope">{{parseFloat((scope.row.weight * 100.0).toPrecision(8))}} %</template>
                </el-table-column>
                <el-table-column prop="" label="是否为自定义" width="120" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.userId===0 ?'info':'success'"
                        >{{scope.row.userId===0 ?'否':'是'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleCustomize(scope.$index, scope.row)"
                        >自定义权重</el-button>

                        <el-button
                                v-if="scope.row.userId !== 0"
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleUncustomize(scope.$index, scope.row)"
                        >初始化权重</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total"
                    :total="pageTotal"
                ></el-pagination>
            </div>
        </div>

        <!-- 指标树形结构侧拉框-->
        <div>
            <el-drawer
                    title="指标树形关系图"
                    :visible.sync="isDrawerShow"
                    :direction="direction"
                    :before-close="handleDrawerClose">
                <el-tree :data="treeData" :props="treeProps" v-if="true" :default-expand-all="true">
                </el-tree>
            </el-drawer>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="自定义权重" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <h3>{{form.indexName}}</h3>
                <div>（请输入小数而非百分比）</div>
                <el-form-item label="权重值">
                    <el-input v-model="form.weight"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCustomize">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {
    getWeightByUserId,
    customizeWeight,
    uncustomizeWeight,
    initWeight,
    getWeightTree,

} from '../../../api/index';

import indexName from '../../common/IndexNameMap';

export default {
    name: 'customWeightMgt',
    data() {
        return {
            query: {
                userId: localStorage.getItem('curUserId'),
                // keyword: '',
            },
            tableData: [],
            multipleSelection: [],
            delList: [],

            indexNameMap2: {},

            isDrawerShow: false,
            direction: 'rtl',
            treeData: [],
            treeProps: {
                children: 'childrenList',
                label: 'indexName'
            },

            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
        this.initNameMap();
        this.getIndexTree();
    },
    methods: {

        getIndexTree() {
            getWeightTree().then(res => {
                    this.treeData = [];
                    this.treeData.push(res.data);
            });
        },
        initNameMap() {
            this.indexNameMap2 = new Map();
            indexName.forEach(i => {
                this.indexNameMap2.set(i.code, i.name);
            });
        },

        getData() {
            getWeightByUserId(this.query).then(res => {
                this.tableData = res.data;
                this.tableData.forEach(i => {
                    i.indexName = this.indexNameMap2.get(i.indexCode);
                });
                this.pageTotal = res.data.length || 0;
            });
        },
        handleInit() {
            this.$confirm('确定要完全初始化吗？此操作会重置所有权重且不可逆！', '提示', {
                type: 'warning'
            }).then(() => {
                let params = {
                    userId: localStorage.getItem('curUserId'),
                };
                initWeight(params).then(res => {
                    if (res.resultCode === 0) {
                        this.$message.success('删除成功');
                        this.getData();
                    }
                });
            });
        },
        // 删除操作
        handleUncustomize(index, row) {
            // 二次确认删除
            this.$confirm('确定要初始化吗？此操作不可逆！', '提示', {
                type: 'warning'
            }).then(() => {
                    let params = {
                        id : row.id,
                    };
                    uncustomizeWeight(params).then(res => {
                        if (res.resultCode === 0) {
                            this.$message.success('删除成功');
                            this.getData();
                        }
                    });
                });
        },
        // 编辑操作
        handleCustomize(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveCustomize() {
            let params = {
                userId: localStorage.getItem('curUserId'),
                indexCode: this.form.indexCode,
                weight: this.form.weight,
            };
            customizeWeight(params).then(res => {
                if (res.resultCode === 0) {
                    this.$message.success(`修改成功`);
                    this.editVisible = false;
                    this.$set(this.tableData, this.idx, this.form);
                    this.getData();
                }
            });
        },
        handleDrawerClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
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
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
