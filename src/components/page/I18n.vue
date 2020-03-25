<template>
    <div>
        <el-button type="primary" icon="el-icon-search" @click="handleAdd">新增</el-button>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>


    </div>
</template>

<script>
    import {getIndexByCompanyId} from '../../api/index';
    import indexName from '../common/IndexNameMap';

    export default {
        data() {
            return {
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
                indexNameMap2 : [],
                defaultProps: {
                    children: 'childrenList',
                    label: 'indexName'
                }
            };
        },
        methods: {
            handleNodeClick(data) {
                console.log(data);
            },
            handleAdd() {
                let params = {
                    companyId : 1,
                    userId : 1,
                };
                this.initNameMap();
                getIndexByCompanyId(params).then(res => {
                    this.data = [];
                    this.data.push(res);
                })
            },
            initNameMap() {
                this.indexNameMap2 = new Map();
                indexName.forEach(i => {
                    this.indexNameMap2.set(i.code, i.name);
                });
            },
        }
    };
</script>

<style scoped>
    .list {
        padding: 30px 0;
    }

    .list p {
        margin-bottom: 20px;
    }

    a {
        color: #409eff;
    }
</style>
