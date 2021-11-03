<template>
    <el-tabs v-model="activeName" @tab-click="getInfo">
        <el-tab-pane label="单曲" name="song">
            <song-list-table :music-list-info="songList"></song-list-table>
            <!--            分页-->
            <el-pagination
                    class="pagination"
                    :page-size="30"
                    layout="prev, pager, next"
                    @current-change="changePage"
                    :total="total">
            </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="歌手" name="singer">
            <div v-for="(item,index) in singerList" class="singer-box">
                <img :src="item.coverImgUrl" alt="" style="">
                <span>{{item.name}}</span>
            </div>
            <el-pagination
                    class="pagination"
                    :page-size="30"
                    layout="prev, pager, next"
                    @current-change="changeSingerPage"
                    :total="singerTotal">
            </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="视频" name="video">
            <video-item :my-list="videoList" v-if="videoList != ''"></video-item>
            <el-pagination
                    class="pagination"
                    :page-size="30"
                    layout="prev, pager, next"
                    @current-change="changeVideoPage"
                    :total="videoTotal">
            </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="歌单" name="songList">
            <div v-for="(item,index) in playList" :key="item.id" class="play-list-box" @click="toMusicPage(item.id)">
                <img :src="item.coverImgUrl" alt="">
                <span>{{item.name}}</span>
                <span>{{item.trackCount}}首</span>
                <span>{{item.creator.nickname}}</span>
            </div>
            <el-pagination
                    class="pagination"
                    :page-size="30"
                    layout="prev, pager, next"
                    @current-change="changePlayListPage"
                    :total="playListTotal">
            </el-pagination>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import SongListTable from "../../components/SongListTable";
    import VideoItem from "../../components/VideoItem";

    export default {
        name: "SearchSongs",
        components: {
            SongListTable,
            VideoItem
        },
        created() {
            this.getSongList()
        },
        data() {
            return {
                activeName: 'song',
                // 单曲
                songList: [],
                total: 0,
                queryInfo: {
                    keywords: this.$route.params.info,
                    limit: 30,
                    offset: 0,
                    // 默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002:
                    // 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
                    type: 1,
                },
                // 歌手
                singerList: [],
                singerTotal: 0,
                //视频
                videoList: [],
                videoTotal: 0,
                // 歌单
                playList:[],
                playListTotal:0,
            }
        },
        methods: {
            async getInfo(tab) {
                // 分别请求数据
                if (tab.name == 'singer') {
                    await this.getSingerList()
                    return
                } else if (tab.name == 'video') {
                    await this.getVideoList()
                } else if(tab.name == 'songList'){
                    await this.getPlayList()
                }

            },
            async getSongList() {
                this.queryInfo.type = 1
                const res = (await this.$http.get('/search', {params: this.queryInfo})).data
                this.songList = res.result.songs
                this.total = res.result.songCount
            },
            changePage(value) {
                this.queryInfo.offset = (value - 1) * this.queryInfo.limit
                this.getSongList()
            },
            async getSingerList() {
                this.queryInfo.type = 1000
                const res = (await this.$http.get('/search', {params: this.queryInfo})).data
                this.singerList = res.result.playlists
                this.singerTotal = res.result.playlistCount
                // console.log(this.singerList);
            },
            changeSingerPage(value) {
                console.log(value);
                this.queryInfo.offset = (value - 1) * this.queryInfo.limit
                this.getSingerList()
            },
            async getVideoList() {
                this.queryInfo.type = 1014
                const res = (await this.$http.get('/search', {params: this.queryInfo})).data
                this.videoList = res.result.videos
                this.videoTotal = res.result.videoCount
                // console.log(this.videoList);
            },
            changeVideoPage(value){
                this.queryInfo.offset = (value - 1) * this.queryInfo.limit
                this.getVideoList()
            },
            async getPlayList(){
                this.queryInfo.type = 1000
                const res = (await this.$http.get('/search', {params: this.queryInfo})).data
                this.playListTotal = res.result.playlistCount
                this.playList = res.result.playlists
                // console.log(this.playList);
            },
            changePlayListPage(value){
                this.queryInfo.offset = (value - 1) * this.queryInfo.limit
                this.getPlayList()
            },
            toMusicPage(id){
                this.$router.push('/songList/' + id)
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .el-tabs__item {
        font-size: 16px;
        margin-bottom: 8px;
    }

    /deep/ .el-tabs__item:hover {
        color: red;
    }

    /deep/ .el-tabs__item.is-active {
        color: red;
    }

    /deep/ .el-tabs__active-bar {
        background-color: red;
    }

    /deep/ .el-tabs__nav-scroll {
        width: 30% !important;
        margin: 0 auto !important;
    }

    .pagination {
        margin: 10px 0 50px 380px;
    }

    //歌手
    .singer-box {
        background: rgb(245, 245, 247);
        width: 500px;
        margin: 25px auto;
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
            width: 100px;
            height: 100px;
        }

        span {
            margin-left: 15px;
        }
    }

    /*//歌单*/
    .play-list-box{
        cursor: pointer;
        background: rgb(245, 245, 247);
        width: 900px;
        margin: 15px auto 0 auto;
        display: flex;
        align-items: center;
        img{
            width: 100px;
            height: 100px;
        }
        span{
            margin-left: 100px;
        }
    }
    .play-list-box:hover{
        background-color: rgb(226, 226, 231);
    }
</style>
