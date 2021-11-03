<template>
    <div>
        <el-header style="border-bottom: 1px solid rgb(230,230,230)">
            <el-menu :default-active="this.$route.path"  mode="horizontal" :router="true">
                <el-menu-item index="/myRecommend">个性推荐</el-menu-item>
                <el-menu-item index="/musicList">歌单</el-menu-item>
                <el-menu-item index="/rank">排行榜</el-menu-item>
                <el-menu-item index="/singer">歌手</el-menu-item>
                <el-menu-item index="/latestMusic">最新音乐</el-menu-item>
            </el-menu>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </div>
</template>


<script>
    import Recommend from "./childComponent/recommend/Recommend";
    import MusicList from "./childComponent/musicList/MusicList";

    export default {
        name: "FindMusic",
        components:{
            Recommend,
            MusicList,
        },
        data() {
            return {}
        }

    }
</script>

<style lan="less" scoped>
    .el-menu-item.is-active{
        border-bottom:2px solid red;
    }
    .el-menu{
        margin: 0 auto;
        width: 420px;
    }
</style>
