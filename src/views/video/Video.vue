<template>
    <div>
        <el-menu :default-active="this.$route.fullPath" mode="horizontal" :router="true">
            <el-menu-item index="/childVideo">视频</el-menu-item>
            <el-menu-item index="/childMV">MV</el-menu-item>
        </el-menu>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "Video",
        created() {
            this.isLogin()
            console.log(this.$route.fullPath);
        },
        data() {
            return {
                cookie: window.localStorage.getItem('musicCookie')
            }
        },
        methods: {
            isLogin() {
                if (this.cookie == '' || this.cookie == null) {
                    this.$message.error({
                        message: '请登录后获取视频信息',
                        center: true
                    })
                    this.$router.push('/myRecommend')
                }
            }
        }
    }
</script>

<style scoped lang="less">

    .el-menu-item {
        font-size: 18px;
    }
    .el-menu-item.is-active {
        border-bottom: 2px solid red;
        color: red;
    }

    .el-menu {
        margin: 0 auto;
        width: 200px;
        display: flex;
        border-bottom: none;
    }
</style>
