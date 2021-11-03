<template>
    <el-container>
        <el-header>
            <h4 class="official-rank">官方榜</h4>
        </el-header>
        <el-main>
            <el-row>
                <el-col @click.native="toSongListPage(item.id)" :span="6"
                        v-for="(item,index) in officialRankList.slice(0,4)" :offset="index == 0 || index == 3 ? 2:1"
                        class="item">
                    <el-image :src="item.coverImgUrl" class="img"></el-image>
                    <el-table
                            :show-header="false"
                            :data="item.tracks"
                            stripe
                            style="width: 100%">
                        <el-table-column type="index">

                        </el-table-column>
                        <el-table-column
                                prop="first">
                            <template scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.first" placement="top-start">
                                    <span>{{scope.row.first.length > 6 ? scope.row.first.slice(0,6) + '...' : scope.row.first}}</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="second">
                            <template scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.second"
                                            placement="top-start">
                                    <span>{{scope.row.second.length > 6 ? scope.row.second.slice(0,6) + '...' : scope.row.second}}</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <!--                不知道为什么歌手榜没有在那个里面，只有单独写了-->
                <!--                而且歌手榜似乎没有点击事件-->
                <el-col :span="6" :offset="1" class="item" v-if="singerRank != null">
                    <el-image :src="singerRank.coverUrl" class="img"></el-image>
                    <el-table
                            :show-header="false"
                            :data="singerRank.artists"
                            stripe
                            style="width: 100%">
                        <el-table-column type="index">

                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="first">
                            <template scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.first" placement="top-start">
                                    <span>{{scope.row.first.length > 6 ? scope.row.first.slice(0,6) + '...' : scope.row.first}}</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <p class="official-rank">全球榜</p>
                <Item :my-list="officialRankList.slice(4,officialRankList.length)"></Item>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import Item from "../../../../components/Item";
    export default {
        name: "Rank",
        components: {
            Item
        },
        created() {
            this.getRankList()
        },
        data() {
            return {
                officialRankList: [],
                singerRank: null,
            }
        },
        methods: {
            async getRankList() {
                const res = (await this.$http.get("/toplist/detail")).data
                this.officialRankList = res.list
                console.log(this.officialRankList);
                this.singerRank = res.artistToplist
                console.log(this.singerRank);
            },
            toSongListPage(id) {
                this.$router.push('/songList/' + id)

            }
        }
    }
</script>

<style scoped lang="less">
    .official-rank {
        border-bottom: 2px solid rgb(230, 230, 230);
        font-size: 22px;
        padding-bottom: 10px;
    }

    .img {
        height: 200px;
        width: 200px;
        border-radius: 15px;
        margin-left: 45px;
    }

    .item {
        cursor: pointer;
        margin-bottom: 20px;
        margin-top: 30px;
    }
</style>
