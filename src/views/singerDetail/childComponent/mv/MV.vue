<template>
    <div>
        <el-main>
            <el-row>
                <el-col :span="6" v-for="(item,index) in mvList" :offset="index % 3 == 0 ? 0 : 3" class="mv-item"
                        @click.native="toVideoPage(item.id)">
                    <div class="play-count">
                        <div>
                            <i class="el-icon-headset">
                                {{item.playCount > 10000 ? (item.playCount / 10000).toFixed(0) + '万' : item.playCount}}
                            </i>
                        </div>
                    </div>
                    <el-image :src="item.imgurl" class="img"></el-image>
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                        <p>{{item.name.length > 20 ? item.name.slice(0,20) + '...' : item.name}}</p>
                    </el-tooltip>
                </el-col>
            </el-row>
        </el-main>
        <el-footer>
            <el-pagination
                    class="pagination"
                    layout="prev, pager, next"
                    @current-change="changPage">
            </el-pagination>
        </el-footer>
    </div>
</template>

<script>
    export default {
        name: "MV",
        created() {
            this.getMVList()
        },
        data() {
            return {
                queryInfo: {
                    id: this.$route.params.id,
                    limit: 9,
                    offset: 0,
                },
                mvList: [],
            }
        },
        methods: {
            async getMVList() {
                const res = (await this.$http.get('/artist/mv', {params: this.queryInfo})).data
                this.mvList = res.mvs
                console.log(this.mvList);
            },
            changPage(value) {
                this.queryInfo.offset = (value - 1) * this.queryInfo.limit
                this.getMVList()
            },
            toVideoPage(id) {
                console.log(id);
                this.$router.push('/videoPage/' + id)
            }
        }
    }
</script>

<style scoped lang="less">
    .mv-item {
        cursor: pointer;
        margin-top: 30px;
        position: relative;
        .play-count{
            position: absolute;
            z-index: 100;
            background: rgba(128,128,128,0.2);
            color: white;
            width: 100%;
            border-radius: 20px;
            display: flex;
            justify-content: flex-end;
            div{
                margin-right: 10px;
                margin-top: 5px;
            }
        }

        .img {
            width: 300px;
            height: 230px;
            border-radius: 20px;
        }

        p {
            text-align: center;
        }
    }

    .pagination {
        margin-bottom: 50px;
        margin-left: 500px;
    }

</style>
