<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="el-card__body" style="height:520px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div>欢迎回来：</div>
                            <div class="user-info-name">{{name}}</div>
                        </div>
                    </div>
                    <el-card shadow="hover" :body-style="{padding: '0px',marginBottom: '15px'}">
                        <div class="grid-content grid-con-1">
                            <i class="el-icon-lx-people grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num" >{{countCompanies}}</div>
                                <div>用户已接入企业</div>
                            </div>
                        </div>
                    </el-card>

                    <el-card shadow="hover" :body-style="{padding: '0px' ,marginBottom: '15px'}">
                        <div class="grid-content grid-con-2">
                            <i class="el-icon-lx-notice grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{countCompletedIndexs}}</div>
                                <div>已完成指标分析企业</div>
                            </div>
                        </div>
                    </el-card>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover" >
                    <el-card shadow="hover" :align="center">
                        <div  style="float: right">
                            <div v-for="item in indexNameT1">
                                <span>{{ item.code }} - {{ item.name }}</span>
                            </div>
                        </div>
                        <schart class="schart" style="height:500px;width: 600px; float: right" canvasId="ring" :options="optionsRing"></schart>
                    </el-card>
                </el-card>
            </el-col>
        </el-row>
<!--        <el-row :gutter="20">-->
<!--            <el-col :span="12">-->
<!--                <el-card shadow="hover">-->
<!--                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>-->
<!--                </el-card>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--                <el-card shadow="hover">-->
<!--                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>-->
<!--                </el-card>-->
<!--            </el-col>-->
<!--        </el-row>-->
    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import indexName from '../common/IndexNameMap';
import {
    countCompany,
    countCompletedIndex,
    queryOverviewWeight,
} from '../../api/index'
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('curUserName'),
            optionsRing: {
                type: 'ring',
                title: {
                    text: '当前用户指标权重分布'
                },
                showValue: true,
                legend: {
                    position: 'bottom',
                    bottom: 20
                },
                bgColor: '#fbfbfb',
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                datasets: [
                    {
                        data: []
                    }
                ]
            },

            countCompanies: 0,
            countCompletedIndexs : 0,

            indexNameT1 : [],

        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    created() {
      this.getData();
      this.getIndexNameT1();
      console.log(this.indexNameT1)
    },
    // created() {
    //     this.handleListener();
    //     this.changeDate();
    // },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        getData() {
            countCompany({userId : localStorage.getItem('curUserId')})
                .then(res => this.countCompanies = res.data || 0);
            countCompletedIndex({userId : localStorage.getItem('curUserId')})
                .then(res => this.countCompletedIndexs = res.data || 0);
            queryOverviewWeight({userId : localStorage.getItem('curUserId')})
                .then(res => res.data.forEach(i => {
                    //
                    this.optionsRing.datasets[0].data.push(i.weight);
                }));
        },

        getIndexNameT1() {
            this.indexNameT1 = indexName.filter(i => i.code.length === 2);
        },
        // test() {
        //     alert(this.changeDate.toString())
        //
        // }
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.user-info-name {
    font-size: 30px;
    color: #222;

}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 400px;
}
</style>
