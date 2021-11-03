<template>
    <div class="album">
        <!--        50首热门歌曲-->
        <el-row>
            <el-col :span="4" :offset="2">
                <img src="../../../../assets/imgs/top50.png">
            </el-col>
            <el-col :span="8">
                <p>热门50区</p>
                <el-table :data="hot50Songs.slice(0,defaultSongs)" stripe
                          :show-header="false"
                          class="hot-50-songs-table"
                          @row-dblclick="playMusic"
                >
                    <el-table-column align="center" width="40px">
                        <template scope="scope">
                            <img v-if="currentMusicId == scope.row.id" src="../../../../assets/imgs/isPlay.png" alt="">
                            <span v-else>{{(scope.$index + 1).toString().padStart(2,'0')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="80px">
                        <template>
                            <i class="el-icon-star-off"></i>
                            <i class="el-icon-download"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="name">
                    </el-table-column>
                    <el-table-column width="80" align="center">
                        <template scope="scope">
                            <span>{{scope.row.dt / 1000 | timeFormat}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <p v-if="defaultSongs == 10" @click="changeDefaultSongs(50)" class="expand">全部展开</p>
                <p v-else @click="changeDefaultSongs(10)" class="close-list">收拢列表</p>
            </el-col>
        </el-row>
        <!--        专辑里面的歌曲-->
        <el-row v-for="(item,index) in albumMusicInfo" class="item">
            <el-col :span="4" :offset="2">
                <el-image :src="item.album.picUrl" class="img"></el-image>
                <p>{{item.album.publishTime | dateFormatToYMD}}</p>
            </el-col>
            <el-col :span="8">
                <p>{{item.album.name}}</p>
                <el-table @row-dblclick="playMusic" :data="item.songs" align="center" :show-header="false" stripe
                          class="hot-50-songs-table">
                    <el-table-column width="40">
                        <template scope="scope">
                            <img v-if="currentMusicId == scope.row.id"
                                 src="../../../../assets/imgs/isPlay.png"></img>
                            <span v-else>{{(scope.$index + 1).toString().padStart(2,'0')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="80px">
                        <template>
                            <i class="el-icon-star-off"></i>
                            <i class="el-icon-download"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="name">
                    </el-table-column>
                    <el-table-column width="80" align="center">
                        <template scope="scope">
                            <span>{{scope.row.dt / 1000 | timeFormat}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Album",
        created() {
            this.getHotAlbum()
            this.getHot50Songs()
        },
        data() {
            return {
                hotAlbumList: [],
                queryInfo: {
                    id: this.$route.params.id,
                    limit: 4,
                    offset: 0,
                },
                hot50Songs: [],
                //当前歌手专辑内歌曲信息
                albumMusicInfo: [],
                // 默认显示50首歌里面的一部分
                defaultSongs: 10,
                currentMusicId: null,
                musicUrl: '',
                musicDetail: '',
            }
        },
        methods: {
            async getHotAlbum() {
                const res = (await this.$http.get('/artist/album', {params: this.queryInfo})).data
                this.hotAlbumList = res.hotAlbums
                this.hotAlbumList.forEach(async item => {
                    const newRes = (await this.$http.get('/album', {params: {id: item.id}})).data
                    this.albumMusicInfo.push(newRes)
                })
            },
            async getHot50Songs() {
                const res = (await this.$http.get('/artist/top/song', {params: {id: this.queryInfo.id}})).data
                this.hot50Songs = res.songs
            },
            changeDefaultSongs(value) {
                this.defaultSongs = value
                if (value == 10) {
                    window.scrollTo(0, 300)
                }
            },
            async playMusic(item) {
                this.currentMusicId = item.id
                await this.getMusicUrl(item.id)
                await this.getMusicDetail(item.id)
                this.$store.commit('playMusic', this.musicUrl)
                this.$store.commit('changeMusicUrl', this.musicUrl)
                this.$store.commit('changeMusicDetail', this.musicDetail)

            },
            // 根据musicID获取音乐的URL
            async getMusicUrl(musicId) {
                const res = (await this.$http.get('song/url', {params: {id: musicId}})).data
                this.musicUrl = res.data[0].url
            },

            // 获取音乐详情
            async getMusicDetail(musicId) {
                const res = (await this.$http.get('song/detail', {params: {ids: musicId}})).data
                this.musicDetail = res.songs[0]
            },
        }
    }
</script>

<style scoped lang="less">
    .album {
        margin-top: 50px;

        .item {
            margin-top: 30px;
        }

        .hot-50-songs-table {
            cursor: pointer;
            border: 1px solid rgb(230, 230, 230);
        }

        .el-icon-star-off, .el-icon-download {
            cursor: pointer;
            font-size: 18px;
        }

        .el-icon-download {
            margin-left: 10px;
        }

        .close-list, .expand {
            cursor: pointer;
        }

        .img {
            width: 150px;
            height: 150px;
        }
    }

</style>
