<template>
    <!--    个性推荐-->
    <el-container>
        <el-header height="400px">
            <!--            轮播图-->
            <el-carousel :interval="4000" type="card" :autoplay="false">
                <el-carousel-item v-for="item in bannerInfo" :key="item.imageUrl">
                    <el-image style="height: 250px;margin-top: 30px" :src="item.imageUrl"
                              @click="changeUrl(item.targetId)"></el-image>
                    <el-tag
                            style="position: absolute; left: 90%; top:79%;border-radius: 14px"
                            :key="item.encodeId"
                            :type="item.typeTitel == '独家' ? 'danger': 'primary'"
                            effect="dark">
                        {{ item.typeTitle }}
                    </el-tag>
                </el-carousel-item>
            </el-carousel>
        </el-header>
        <el-main>
            <!--            推荐歌单-->
            <el-row style="border-bottom: 2px solid rgb(230,230,230); height: 75px">
                <p>推荐歌单</p>
            </el-row>
            <el-row :gutter="10">
                <Item :my-list="recommendMusicList"></Item>
            </el-row>

            <!--            独家放送-->
            <el-row style="border-bottom: 2px solid rgb(230,230,230); height: 75px">
                <p>独家放送</p>
            </el-row>
            <el-row :gutter="40">
                <el-col v-for="item in privateList" :span="8" style="cursor: pointer; " @click.native="toVideoPage(item.id)">
                    <i class="el-icon-video-play privateMusicListPlayer"></i>
                    <el-image :src="item.sPicUrl"></el-image>
                    <h1 :title="item.name">{{item.name}}</h1>
                </el-col>
            </el-row>

            <!--            最新音乐-->
            <el-row style="border-bottom: 2px solid rgb(230,230,230); height: 75px">
                <p>最新音乐</p>
            </el-row>
            <el-row style="margin-bottom: 50px">
                <!--                不知道为什么这里的父盒子不加relative时，播放器图标定位有问题。按道理说absolute会根据最近的父盒子定位-->
                <el-col :span="12" v-for="(item,index) in newMusicList"
                        @click.native="changeUrl(item.id)"
                        style="position: relative; cursor: pointer; height: 105px; display: flex; align-items: center;">
                    <span class="newMusicIndexSpan"> {{index >= 9 ? index + 1 : "0" + (index + 1)}}</span>
                    <i class="el-icon-video-play newMusicPlayer"></i>
                    <el-image :src="item.picUrl" style="width: 75px;height: 75px;"></el-image>
                    <div class="newMusicInfo">
                        <p>{{item.name}}</p>
                        <p>{{item.song.artists[0].name}}</p>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>

    import Item from "../../../../components/Item";

    export default {
        name: "Recommend",
        components: {
            Item
        },
        data() {
            return {
                // 轮播图信息
                bannerInfo: '',
                recommendMusicList: [],
                privateList: [],
                newMusicList: [],

                // 当前播放的音乐地址
                musicUrl: '',
                musicDetail: '',
            }
        },
        created() {
            this.getBannerInfo()
            this.getRecommendMusicList()
            this.getPrivateList()
            this.getNewMusicList()
        },
        methods: {
            // 获取轮播图数据
            async getBannerInfo() {
                const res = (await this.$http.get('banner')).data
                if (res.code !== 200) {
                    return this.$message.error({
                        message: '获取轮播图失败',
                        center: true
                    })
                } else {
                    this.bannerInfo = res.banners
                    // console.log(this.bannerInfo);
                }
            },
            // 获取推荐歌单数据
            async getRecommendMusicList() {
                const res = (await this.$http.get('top/playlist', {
                    params: {
                        offset: (Math.random() * 1297).toFixed(0) - 12,
                        limit: 12
                    }
                })).data
                if (res.code != 200) {
                    return this.$message.error({
                        message: '获取推荐歌单失败！'
                    })
                } else {
                    this.recommendMusicList = res.playlists;
                    // console.log(this.recommendMusicList);
                }
            },
            // 获取独家放送数据
            async getPrivateList() {
                const res = (await this.$http.get('personalized/privatecontent')).data
                if (res.code != 200) {
                    return this.$message.error({
                        message: "获取独家放送数据失败!",
                        center: true
                    })
                } else {
                    this.privateList = res.result
                }
                // console.log(this.privateList);
            },
            //获取最新音乐
            async getNewMusicList() {
                const res = (await this.$http.get('personalized/newsong')).data
                if (res.code != 200) {
                    return this.$message.error({
                        message: "获取最新音乐失败！",
                        center: true
                    })
                } else {
                    this.newMusicList = res.result
                }
                // console.log(this.newMusicList);
            },

            // 根据musicID获取音乐的URL
            async getMusicUrl(musicId) {
                const res = (await this.$http.get('song/url', {params: {id: musicId}})).data
                console.log(res);
                this.musicUrl = res.data[0].url
            },

            // 获取音乐详情
            async getMusicDetail(musicId) {
                const res = (await this.$http.get('song/detail', {params: {ids: musicId}})).data
                this.musicDetail = res.songs[0]
            },
            // 切换正在播放的音乐
            async changeUrl(musicId) {
                if (musicId != null) {
                    await this.getMusicUrl(musicId)
                    await this.getMusicDetail(musicId)
                    if (this.musicUrl != "" && this.musicUrl != null) {
                        this.$store.commit('playMusic', this.musicUrl)
                        this.$store.commit('changeMusicUrl', this.musicUrl)
                        this.$store.commit('changeMusicDetail', this.musicDetail)
                    }
                }
            },

            // 跳转独家放送页面
            toVideoPage(id){
                this.$router.push('/videoPage/' + id)
            }
        }
    }
</script>

<style lang="less" scoped>

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }

    /deep/ .el-carousel__indicators.el-carousel__indicators--horizontal.el-carousel__indicators--outside {
        margin-top: 20px;

    }

    /deep/ .el-carousel__container {
        height: 330px;
        margin-top: 40px;
    }

    .el-main {
        margin-top: 30px;

        p {
            font-size: 24px;
        }
    }

    .privateMusicListPlayer {
        position: absolute;
        z-index: 10;
        color: rgba(255, 255, 255, 0.4);
        font-size: 45px;
        top: 10px;
    }

    .newMusicPlayer {
        position: absolute;
        font-size: 25px;
        color: white;
        z-index: 10;
        top: 40px;
        left: 60px
    }

    /deep/ .el-col h1 {
        font-size: 10px;
        font-weight: normal;
        color: #866e6e;
    }

    .newMusicIndexSpan {
        margin-right: 20px;
    }

    .newMusicInfo p {
        font-size: 10px;
        color: black;
        margin-left: 15px;

    }
</style>
