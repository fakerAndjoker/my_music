<template>
    <el-container>
        <el-header>
            <p>语种
                <span @click="changLanguage(item)" v-for="(item,index) in musicType"
                      :class="['tag',activeTagName == item.value ? 'active':'']">{{item.value}}</span>
            </p>
        </el-header>
        <el-main>
            <el-col :span="20" class="music-item" v-for="(item,index) in latestMusicList">
                <i class="el-icon-video-play" @click="playMusic(item.id)"></i>
                <p>{{(index + 1) >= 10 ? index + 1 : '0' + (index + 1)}}</p>
                <el-image :src="item.album.picUrl" @click="playMusic(item.id)"></el-image>
                <div>
                    <p class="name">{{item.name}}</p>
                    <p class="album-name">{{item.album.name}}</p>
                </div>
            </el-col>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "LatestMusic",
        created() {
            this.getLatestMusicList()
        },
        data() {
            return {
                type: 0,
                activeTagName: '全部',
                musicType: [
                    {type: 0, value: '全部'},
                    {type: 7, value: '华语'},
                    {type: 96, value: '欧美'},
                    {type: 8, value: '日本'},
                    {type: 16, value: '韩国'},
                ],
                latestMusicList: [],
                musicUrl: '',
                musicDetail: '',

            }
        },
        methods: {
            changLanguage(item) {
                this.activeTagName = item.value
                this.type = item.type
            },
            async getLatestMusicList() {
                const res = (await this.$http.get('/top/song', {params: this.type})).data
                this.latestMusicList = res.data
                console.log(this.latestMusicList);
            },
            async playMusic(id) {
                console.log(id);
                await this.getMusicUrl(id)
                await this.getMusicDetail(id)
                if (this.musicUrl != "" && this.musicUrl != null) {
                    this.$store.commit('playMusic', this.musicUrl)
                    this.$store.commit('changeMusicUrl', this.musicUrl)
                    this.$store.commit('changeMusicDetail', this.musicDetail)
                }
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
    .el-header {
        span {
            margin-left: 20px;
            cursor: pointer;
        }

        .active {
            color: red;
        }
    }

    .el-main {
        .music-item {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            background-color: rgb(250, 250, 250);
            /*播放图标*/

            .el-icon-video-play {
                position: absolute;
                font-size: 200%;
                color: gray;
                left: 80px;
                z-index: 100;
                display: none;
                cursor: pointer;
            }

            p {
                margin-left: 10px;
            }

            .el-image {
                width: 100px;
                height: 100px;
                margin: 10px 15px 10px 20px;
                cursor: pointer;
            }

            .album-name {
                font-size: 10px;
                color: gray;
            }
        }

        .music-item:hover {
            background-color: rgb(245, 247, 250);
        }

        .music-item:hover .el-icon-video-play {
            display: block;
        }
    }
</style>
