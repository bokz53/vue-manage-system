<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 原始数据管理
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
                <el-table-column prop="productSales" label="产品销售额"></el-table-column>
                <el-table-column prop="marketSameKindProductSales" label="市场同类产品销售额"></el-table-column>
                <el-table-column prop="totalProfit" label="利润总额"></el-table-column>
                <el-table-column prop="operatingIncome" label="营业收入"></el-table-column>
                <el-table-column prop="salesCost" label="销售成本"></el-table-column>
                <el-table-column label="更多数据请查看详情……" width="200px" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-lx-sort"
                                @click="handleDetail(scope.$index, scope.row)"
                        >查看详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="380" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-video-play"
                                @click="handleIndexCompute(scope.$index, scope.row)"
                        >开始计算指标</el-button>

                        <el-button
                            type="text"
                            icon="el-icon-edit"
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
        <el-dialog title="原始数据修改" :visible.sync="editVisible" width="50%">
            <div style="font-size: 16px;margin-bottom: 10px">{{ form.companyName }}</div>
            <el-form ref="form" :model="form" label-width="70px" :inline="true" label-position="top" >
                <el-form-item label="产品销售额">
                    <el-input v-model="form.productSales"></el-input>
                </el-form-item>
                <el-form-item label="市场同类产品销售额">
                    <el-input v-model="form.marketSameKindProductSales"></el-input>
                </el-form-item>
                <el-form-item label="利润总额">
                    <el-input v-model="form.totalProfit"></el-input>
                </el-form-item>
                <el-form-item label="营业收入">
                    <el-input v-model="form.operatingIncome"></el-input>
                </el-form-item>
                <el-form-item label="销售成本">
                    <el-input v-model="form.salesCost"></el-input>
                </el-form-item>
                <el-form-item label="存货平均余额">
                    <el-input v-model="form.avgStockOverage"></el-input>
                </el-form-item>
                <el-form-item label="应收账款平均余额">
                    <el-input v-model="form.avgPaymentToReceive"></el-input>
                </el-form-item>
                <el-form-item label="负债总额">
                    <el-input v-model="form.totalDebt"></el-input>
                </el-form-item>
                <el-form-item label="资产总额">
                    <el-input v-model="form.totalAsset"></el-input>
                </el-form-item>
                <el-form-item label="流动资产">
                    <el-input v-model="form.currentAsset"></el-input>
                </el-form-item>
                <el-form-item label="流动负债">
                    <el-input v-model="form.currentLiability"></el-input>
                </el-form-item>
                <el-form-item label="速动资产">
                    <el-input v-model="form.quickAsset"></el-input>
                </el-form-item>
                <el-form-item label="期末资产总额">
                    <el-input v-model="form.yearEndTotalAsset"></el-input>
                </el-form-item>
                <el-form-item label="期初资产总额">
                    <el-input v-model="form.yearBeginTotalAsset"></el-input>
                </el-form-item>
                <el-form-item label="研发费用">
                    <el-input v-model="form.rdExpenses"></el-input>
                </el-form-item>
                <el-form-item label="中高级技术人员人数">
                    <el-input v-model="form.seniorTecStaffTotal"></el-input>
                </el-form-item>
                <el-form-item label="全体员工总数">
                    <el-input v-model="form.staffTotal"></el-input>
                </el-form-item>
                <el-form-item label="国际市场的产品销售额">
                    <el-input v-model="form.interMarketProductSales"></el-input>
                </el-form-item>
                <el-form-item label="国际市场上同类产品销售额">
                    <el-input v-model="form.interMarketSameKindProductSales"></el-input>
                </el-form-item>
                <el-form-item label="报告期产品出口额">
                    <el-input v-model="form.reportPeriodProductExport"></el-input>
                </el-form-item>
                <el-form-item label="基期产品出口额">
                    <el-input v-model="form.basePeriodProductExport"></el-input>
                </el-form-item>
                <el-form-item label="满意的消费者数量">
                    <el-input v-model="form.satisfiedConsumer"></el-input>
                </el-form-item>
                <el-form-item label="抽样的总消费者数量">
                    <el-input v-model="form.sampleConsumer"></el-input>
                </el-form-item>
                <el-form-item label="污染排放量">
                    <el-input v-model="form.pollutantEmission"></el-input>
                </el-form-item>
                <el-form-item label="法定排放量">
                    <el-input v-model="form.legalEmission"></el-input>
                </el-form-item>
                <el-form-item label="社会捐赠总额">
                    <el-input v-model="form.socialDonation"></el-input>
                </el-form-item>
                <el-form-item label="平均资产总额">
                    <el-input v-model="form.avgTotalAsset"></el-input>
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
        <el-dialog title="新增原始数据" :visible.sync="addVisible" width="50%">
            <el-form ref="form" :model="form" label-width="70px" :inline="true" label-position="top" >
                <el-form-item label="选择对应的公司">
                    <el-select v-model="form.companyId" placeholder="请选择" >
                        <el-option
                                v-for="item in companyListData"
                                :key="item.id"
                                :label="item.companyName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br/>
                <el-form-item label="产品销售额">
                    <el-input v-model="form.productSales"></el-input>
                </el-form-item>
                <el-form-item label="市场同类产品销售额">
                    <el-input v-model="form.marketSameKindProductSales"></el-input>
                </el-form-item>
                <el-form-item label="利润总额">
                    <el-input v-model="form.totalProfit"></el-input>
                </el-form-item>
                <el-form-item label="营业收入">
                    <el-input v-model="form.operatingIncome"></el-input>
                </el-form-item>
                <el-form-item label="销售成本">
                    <el-input v-model="form.salesCost"></el-input>
                </el-form-item>
                <el-form-item label="存货平均余额">
                    <el-input v-model="form.avgStockOverage"></el-input>
                </el-form-item>
                <el-form-item label="应收账款平均余额">
                    <el-input v-model="form.avgPaymentToReceive"></el-input>
                </el-form-item>
                <el-form-item label="负债总额">
                    <el-input v-model="form.totalDebt"></el-input>
                </el-form-item>
                <el-form-item label="资产总额">
                    <el-input v-model="form.totalAsset"></el-input>
                </el-form-item>
                <el-form-item label="流动资产">
                    <el-input v-model="form.currentAsset"></el-input>
                </el-form-item>
                <el-form-item label="流动负债">
                    <el-input v-model="form.currentLiability"></el-input>
                </el-form-item>
                <el-form-item label="速动资产">
                    <el-input v-model="form.quickAsset"></el-input>
                </el-form-item>
                <el-form-item label="期末资产总额">
                    <el-input v-model="form.yearEndTotalAsset"></el-input>
                </el-form-item>
                <el-form-item label="期初资产总额">
                    <el-input v-model="form.yearBeginTotalAsset"></el-input>
                </el-form-item>
                <el-form-item label="研发费用">
                    <el-input v-model="form.rdExpenses"></el-input>
                </el-form-item>
                <el-form-item label="中高级技术人员人数">
                    <el-input v-model="form.seniorTecStaffTotal"></el-input>
                </el-form-item>
                <el-form-item label="全体员工总数">
                    <el-input v-model="form.staffTotal"></el-input>
                </el-form-item>
                <el-form-item label="国际市场的产品销售额">
                    <el-input v-model="form.interMarketProductSales"></el-input>
                </el-form-item>
                <el-form-item label="国际市场上同类产品销售额">
                    <el-input v-model="form.interMarketSameKindProductSales"></el-input>
                </el-form-item>
                <el-form-item label="报告期产品出口额">
                    <el-input v-model="form.reportPeriodProductExport"></el-input>
                </el-form-item>
                <el-form-item label="基期产品出口额">
                    <el-input v-model="form.basePeriodProductExport"></el-input>
                </el-form-item>
                <el-form-item label="满意的消费者数量">
                    <el-input v-model="form.satisfiedConsumer"></el-input>
                </el-form-item>
                <el-form-item label="抽样的总消费者数量">
                    <el-input v-model="form.sampleConsumer"></el-input>
                </el-form-item>
                <el-form-item label="污染排放量">
                    <el-input v-model="form.pollutantEmission"></el-input>
                </el-form-item>
                <el-form-item label="法定排放量">
                    <el-input v-model="form.legalEmission"></el-input>
                </el-form-item>
                <el-form-item label="社会捐赠总额">
                    <el-input v-model="form.socialDonation"></el-input>
                </el-form-item>
                <el-form-item label="平均资产总额">
                    <el-input v-model="form.avgTotalAsset"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 详情弹出框 -->
        <el-dialog title="原始数据详情" :visible.sync="detailVisible" width="50%" >
            <div style="font-size: 16px;margin-bottom: 10px">{{ form.companyName }}</div>
            <el-form ref="form" :model="form" label-width="70px" :inline="true" label-position="top" :disabled="true" >
                <el-form-item label="产品销售额" >
                    <el-input v-model="form.productSales" ></el-input>
                </el-form-item>
                <el-form-item label="市场同类产品销售额">
                    <el-input v-model="form.marketSameKindProductSales"></el-input>
                </el-form-item>
                <el-form-item label="利润总额">
                    <el-input v-model="form.totalProfit"></el-input>
                </el-form-item>
                <el-form-item label="营业收入">
                    <el-input v-model="form.operatingIncome"></el-input>
                </el-form-item>
                <el-form-item label="销售成本">
                    <el-input v-model="form.salesCost"></el-input>
                </el-form-item>
                <el-form-item label="存货平均余额">
                    <el-input v-model="form.avgStockOverage"></el-input>
                </el-form-item>
                <el-form-item label="应收账款平均余额">
                    <el-input v-model="form.avgPaymentToReceive"></el-input>
                </el-form-item>
                <el-form-item label="负债总额">
                    <el-input v-model="form.totalDebt"></el-input>
                </el-form-item>
                <el-form-item label="资产总额">
                    <el-input v-model="form.totalAsset"></el-input>
                </el-form-item>
                <el-form-item label="流动资产">
                    <el-input v-model="form.currentAsset"></el-input>
                </el-form-item>
                <el-form-item label="流动负债">
                    <el-input v-model="form.currentLiability"></el-input>
                </el-form-item>
                <el-form-item label="速动资产">
                    <el-input v-model="form.quickAsset"></el-input>
                </el-form-item>
                <el-form-item label="期末资产总额">
                    <el-input v-model="form.yearEndTotalAsset"></el-input>
                </el-form-item>
                <el-form-item label="期初资产总额">
                    <el-input v-model="form.yearBeginTotalAsset"></el-input>
                </el-form-item>
                <el-form-item label="研发费用">
                    <el-input v-model="form.rdExpenses"></el-input>
                </el-form-item>
                <el-form-item label="中高级技术人员人数">
                    <el-input v-model="form.seniorTecStaffTotal"></el-input>
                </el-form-item>
                <el-form-item label="全体员工总数">
                    <el-input v-model="form.staffTotal"></el-input>
                </el-form-item>
                <el-form-item label="国际市场的产品销售额">
                    <el-input v-model="form.interMarketProductSales"></el-input>
                </el-form-item>
                <el-form-item label="国际市场上同类产品销售额">
                    <el-input v-model="form.interMarketSameKindProductSales"></el-input>
                </el-form-item>
                <el-form-item label="报告期产品出口额">
                    <el-input v-model="form.reportPeriodProductExport"></el-input>
                </el-form-item>
                <el-form-item label="基期产品出口额">
                    <el-input v-model="form.basePeriodProductExport"></el-input>
                </el-form-item>
                <el-form-item label="满意的消费者数量">
                    <el-input v-model="form.satisfiedConsumer"></el-input>
                </el-form-item>
                <el-form-item label="抽样的总消费者数量">
                    <el-input v-model="form.sampleConsumer"></el-input>
                </el-form-item>
                <el-form-item label="污染排放量">
                    <el-input v-model="form.pollutantEmission"></el-input>
                </el-form-item>
                <el-form-item label="法定排放量">
                    <el-input v-model="form.legalEmission"></el-input>
                </el-form-item>
                <el-form-item label="社会捐赠总额">
                    <el-input v-model="form.socialDonation"></el-input>
                </el-form-item>
                <el-form-item label="平均资产总额">
                    <el-input v-model="form.avgTotalAsset"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="detailVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {
    queryRawData,
    queryRawDataPaged,
    getCompanyListWithoutRaw,
    addRawData,
    deleteRawData,
    updateRawData,
    computeIndex,

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
            companyListData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            detailVisible: false,
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
            queryRawDataPaged(this.query).then(res => {
                // console.log(res);
                this.tableData = res.data.data;
                this.pageTotal = res.data.recordTotal || 50;
            });
        },
        // 触发新增框
        handleAdd() {
            let params = {
                userId : localStorage.getItem('curUserId')
            };
            getCompanyListWithoutRaw(params).then(res => {
               this.companyListData = res.data;
            });
            this.form = {};
            this.addVisible = true;
        },

        // 触发计算指标
        handleIndexCompute(index, val) {

            let param = {
                companyId : val.companyId,
                userId : localStorage.getItem('curUserId')
            };
            computeIndex(param).then(res => {
                if (res.resultCode === 0) {
                    this.$message.success('计算成功');
                }
            });
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
                        id : row.id
                    };
                deleteRawData(params).then(res => {
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
        // 查看详情操作
        handleDetail(index, row) {
            this.idx = index;
            this.form = row;
            this.detailVisible = true;
        },

        // 保存编辑
        saveEdit() {
            let params = this.form;
            updateRawData(params).then(res => {
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
            let params = this.form;
            params.userId = localStorage.getItem('curUserId');
            addRawData(params).then(res => {
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
