<template>

</template>

<script>
    export default {
        name: "Empty",
        created() {
            // 中间过渡路由
            if (this.toPath) {
                this.$router.push({path: this.toPath})
            }

        },
        data() {
            return {
                toPath:this.$route.query.toPath
            }
        }
    }
</script>

<style scoped>

</style>
