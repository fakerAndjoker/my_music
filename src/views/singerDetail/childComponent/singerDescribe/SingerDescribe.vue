<template>
    <div>
        <el-row>
            <h4>简介:</h4>
            <p>{{briefDesc}}</p>
        </el-row>
        <el-row v-for="item in introductionList" style="margin-bottom: 20px">
            <h4>{{item.ti}}</h4>
            <p>{{item.txt}}</p>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "SingerDescribe",
        created() {
            this.getSingerDescribe()
        },
        data() {
            return {
                id: this.$route.params.id,
                briefDesc:'',
                introductionList:[],
            }
        },
        methods:{
            async getSingerDescribe(){
                const res = (await this.$http.get('/artist/desc', {params: {id: this.id}})).data
                this.briefDesc = res.briefDesc
                this.introductionList = res.introduction
                console.log(res);
            }
        }
    }
</script>

<style scoped lang="less">
    p{
        text-indent: 2em;
    }

</style>
