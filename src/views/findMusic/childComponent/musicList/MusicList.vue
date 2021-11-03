<template>
    <el-container>
        <el-header>
            <span class="tags">热门标签:</span>
            <span :class="['tag-item', activeName == '全部' ? 'active' : '']" @click="changeCategory('全部')">全部</span>
            <span v-for="item in hotMusicListTags" :key="item.id" :class="['tag-item', activeName == item.name ? 'active' : '']" @click="changeCategory(item.name)">
               {{item.name}}
           </span>
        </el-header>
        <el-main>
            <item :my-list="musicList"></item>
            <el-pagination
                    class="pagination"
                    layout="prev, pager, next"
                    @current-change="changPage"
                    :total="total">
            </el-pagination>
        </el-main>
    </el-container>
</template>

<script>
    import Item from "../../../../components/Item";

    export default {
        name: "MusicList",
        components: {
            Item
        },
        created() {
            this.getHotMusicListTags()
            this.getMusicList()
        },
        data() {
            return {
                activeName: '全部',
                queryInfo: {
                    cat: '全部',
                    limit: 50,
                    offset: 0
                },
                // 热门标签
                hotMusicListTags: [],
                musicList: [],
                total: 0,
            }
        },
        methods: {
            async getHotMusicListTags() {
                const res = (await this.$http.get('/playlist/hot')).data
                this.hotMusicListTags = res.tags
            },
            changeCategory(name) {
                this.activeName = name
                this.queryInfo.cat = name
                this.getMusicList()
            },
            async getMusicList() {
                const res = (await this.$http.get('/top/playlist', {params: this.queryInfo})).data
                this.musicList = res.playlists
                this.total = res.total
                console.log(res);
            },
            changPage(value) {
                this.queryInfo.offset = (value - 1) * this.queryInfo.limit
                this.getMusicList()
            }

        }
    }
</script>

<style scoped lang="less">
    .el-header {
        .tags {
            font-size: 18px;
            font-weight: bold;
        }
        .active{
            color: red;
        }

        .tag-item {
            margin-left: 30px;
            cursor: pointer;
        }

        .tag-item:hover {
            color: red;
        }
    }
    .el-main{
        .pagination{
            margin-bottom: 50px;
            margin-left: 400px;
        }
    }

</style>
