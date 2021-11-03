<template>
    <div>我是音乐云盘</div>
</template>

<script>
    export default {
        name: "CloudDisk",
        created() {
            this.isLogin()
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
                        message: '请登录后获取音乐云盘信息',
                        center: true
                    })
                    this.$router.push('/myRecommend')
                }
            }
        }
    }
</script>

<style scoped>

</style>
