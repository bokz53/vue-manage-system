<template>
    <div id="app">
                <router-view></router-view>
<!--        <headerBar class="head" :collapse="collapse">-->
<!--        </headerBar>-->
<!--        <sideBar class="sidebar"></sideBar>-->
<!--&lt;!&ndash;        <contentView class="content"></contentView>&ndash;&gt;-->
<!--        <computedTest class="content"></computedTest>-->
    </div>
</template>

<!--<script>-->

<!--    import sideBar from "@/vtest/SideBar.vue";-->
<!--    import contentView from "@/vtest/ContentView.vue";-->
<!--    import headerBar from "@/vtest/HeaderBar.vue";-->
<!--    import computedTest from "@/vtest/ComputedTest.vue";-->

<!--    export default {-->
<!--        data() {-->
<!--            return {-->
<!--                tagsList: [],-->
<!--                collapse: false-->
<!--            };-->
<!--        },-->
<!--        components: {-->
<!--            sideBar,-->
<!--            contentView,-->
<!--            headerBar,-->
<!--            computedTest,-->

<!--        },-->
<!--    };-->
<!--</script>-->
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/


    /*.head {*/
    /*    width: 100%;*/
    /*    height: 8%;*/
    /*    background-color: #ff0018;*/
    /*}*/

    /*.sidebar {*/
    /*    float: left;*/
    /*    width: 30%;*/
    /*    height: 100%;*/
    /*    background-color: green;*/

    /*}*/
    /*.content {*/
    /*    float: left;*/
    /*    width: 70%;*/
    /*    height: 100%;*/
    /*    background-color: #00fff4;*/

    /*}*/
</style>
