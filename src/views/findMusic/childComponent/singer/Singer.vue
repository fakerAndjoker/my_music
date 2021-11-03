<template>
    <el-container>
        <el-header>
            <p>语种:
                <span v-for="(item,index) in languageType" @click="changeLanguage(item)"
                      :class="[activeLanguage == item.value ? 'active' : '']">
                    {{item.value}}
                </span>
            </p>
            <p>分类:
                <span v-for="(item,index) in sexType" @click="changeSex(item)"
                      :class="[activeSex == item.value ? 'active' : '']">
                    {{item.value}}
                </span>
            </p>
        </el-header>
        <el-main>
            <el-row :gutter="10">
                <el-col :span="4" v-for="(item,index) in singerList" :key="item.id" @click.native="toSingerDetail(item.id)">
                    <el-image :src="item.img1v1Url"></el-image>
                    <p>{{item.name}}</p>
                </el-col>
            </el-row>
            <!--            分页-->
            <el-pagination
                    class="pagination"
                    layout="prev, pager, next"
                    @current-change="changePage"
            >
            </el-pagination>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "Singer",
        created() {
            this.getSingerList()
        },
        data() {
            return {
                activeLanguage: '全部',
                activeSex: '全部',
                languageType: [
                    {area: -1, value: '全部'},
                    {area: 7, value: '华语'},
                    {area: 96, value: '欧美'},
                    {area: 8, value: '日本'},
                    {area: 16, value: '韩国'},
                    {area: 0, value: '其他'},
                ],
                sexType: [
                    {type: -1, value: '全部'},
                    {type: 1, value: '男歌手'},
                    {type: 2, value: '女歌手'},
                    {type: 3, value: '乐队'}
                ],
                queryInfo: {
                    limit: 30,
                    offset: 0,
                    type: -1,
                    area: -1,
                },
                singerList: [],
            }

        },
        methods: {
            async getSingerList() {
                const res = (await this.$http.get('/artist/list', {params: this.queryInfo})).data
                this.singerList = res.artists
                // console.log(res);
                // console.log(this.singerList);
            },
            changeLanguage(item) {
                this.activeLanguage = item.value
                this.queryInfo.area = item.area
                this.getSingerList()
            },
            changeSex(item) {
                this.activeSex = item.value
                this.queryInfo.type = item.type
                this.getSingerList()
            },
            changePage(value) {
                this.queryInfo.offset = (value - 1) * this.queryInfo.limit
                this.getSingerList()
            },
            toSingerDetail(id){
                this.$router.push('singerDetail/' + id)
            }

        }
    }
</script>

<style scoped lang="less">
    .el-header {
        span {
            margin-left: 30px;
            cursor: pointer;
        }

        span:hover {
            color: red;
        }

        .active {
            color: red;
        }
    }

    .el-main {
        .el-col {
            margin-top: 15px;
            cursor: pointer;

            .el-image {
                box-shadow: 0 0 2px 2px gray;
                border-radius: 10px;
                cursor: pointer
            }

            p {
                text-align: center;
            }
        }
        .pagination {
            margin-bottom: 50px;
            margin-left: 500px;
        }
    }
</style>
