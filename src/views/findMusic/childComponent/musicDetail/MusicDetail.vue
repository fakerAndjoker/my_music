<template>
    <div>
        <!--        头部-->
        <el-row class="top" v-if="music != ''">
            <el-col :span="6">
                <!--                背景图-->
                <img :src="music.al.picUrl" alt="" class="background-img">
                <!--                cd图片-->
                <img :src="music.al.picUrl" alt="" class="music-poster" @click="changeUrl">
            </el-col>
            <el-col class="lyrics" :span="12">
                <h1 class="music-title">{{music.name}}</h1>
                <span>专辑: {{music.al.name}}</span>
                <span>歌手: <span class="singer">{{music.ar[0].name}}</span></span>
                <div class="lines">
                    <ul ref="lyric">
                        <li v-for="(item,index) in musicLrcList" :key="index"
                            :class="{'currentLyric': lyricIndex == index ? true : false}">
                            {{item.c}}
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
        <!--        评论信息-->
        <el-main>
            <el-row>
                <el-col :offset="4">
                    <h4 v-if="hotCommentList != null">精彩评论</h4>
                    <Comment :comment-list="hotCommentList"></Comment>
                    <h4>最新评论</h4>
                    <Comment :comment-list="commentList"></Comment>
                    <!--                    分页-->
                    <el-pagination
                            class="pagination"
                            layout="prev, pager, next"
                            @current-change="handleCurrentChange"
                            :total="totalComments">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-main>
    </div>
</template>

<script>
    import Comment from '../../../../components/Comment'

    export default {
        name: "MusicDetail",
        components: {
            Comment
        },
        props: {
            // 为了实现歌词的滚动
            musicDuration: Number,
        },
        data() {
            return {
                musicId: this.$route.params.id,
                music: '',
                musicLrc: '',
                musicLrcList: [],
                // 当前播放的歌曲歌词的下标
                lyricIndex: '',
                // 当前歌曲播放的进度
                duration: '',
                totalComments: 0,
                hotCommentList: [],
                // 热门评论的请求参数
                queryInfo: {
                    id: this.$route.params.id,
                    limit: 10,
                    offset: 0,
                },
                commentList: [],
                musicUrl: '',
            }
        },
        created() {
            this.getMusicDetail()
            this.getMusicLrc()
            this.getComment()
        },
        methods: {
            // 获取歌曲详情
            async getMusicDetail() {
                const res = (await this.$http.get('song/detail', {params: {ids: this.musicId}})).data
                this.music = res.songs[0]
            },
            // 获取歌词
            async getMusicLrc() {
                const res = (await this.$http.get("/lyric", {params: {id: this.musicId}})).data
                this.musicLrc = res.lrc.lyric
                this.createLrcObj(this.musicLrc)
            },
            // 解析歌词（copy)
            createLrcObj(lrc) {
                var oLRC = {
                    ms: [] //歌词数组{t:时间,c:歌词}
                };
                if (lrc.length == 0) return;
                var lrcs = lrc.split('\n');//用回车拆分成数组
                for (var i in lrcs) {//遍历歌词数组
                    lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
                    var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
                    var s = t.split(":");//分离:前后文字
                    if (isNaN(parseInt(s[0]))) { //不是数值
                        for (var i in oLRC) {
                            if (i != "ms" && i == s[0].toLowerCase()) {
                                oLRC[i] = s[1];
                            }
                        }
                    } else { //是数值
                        var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
                        var start = 0;
                        for (var k in arr) {
                            start += arr[k].length; //计算歌词位置
                        }
                        var content = lrcs[i].substring(start);//获取歌词内容
                        for (var k in arr) {
                            var t = arr[k].substring(1, arr[k].length - 1);//取[]间的内容
                            // var t = arr[k]
                            var s = t.split(":");//分离:前后文字
                            oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                                // t: t,
                                t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
                                c: content === '' ? '..............' : content
                            });
                        }
                    }
                }
                oLRC.ms.sort(function (a, b) {//按时间顺序排序
                    return a.t - b.t;
                });
                // for(var i in oLRC){ //查看解析结果
                //     console.log(i,":",oLRC[i]);
                // }
                this.musicLrcList = oLRC.ms
            },
            async getComment() {
                const res = (await this.$http.get('comment/music', {params: this.queryInfo})).data
                this.hotCommentList = res.hotComments
                this.commentList = res.comments
                this.totalComments = res.total
                // console.log(this.hotCommentList);
                console.log(res)
                console.log(this.commentList);
            },
            // 换页
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                this.getComment()
            },

            //点击图片播放音乐

            // 根据musicID获取音乐的URL
            async getMusicUrl() {
                const res = (await this.$http.get('song/url', {params: {id: this.musicId}})).data
                this.musicUrl = res.data[0].url
            },
            // 切换正在播放的音乐
            async changeUrl() {
                let musicId = this.musicId
                if (musicId != null) {
                    await this.getMusicUrl()
                    await this.getMusicDetail()
                    if (this.musicUrl != "" && this.musicUrl != null) {
                        this.$store.commit('playMusic', this.musicUrl)
                        this.$store.commit('changeMusicUrl', this.musicUrl)
                        this.$store.commit('changeMusicDetail', this.musicDetail)
                    }
                }
            }
        },
        watch: {
            //父组件通过 router-view 的@musicDuration传递过来值(进行歌曲滚动操作)(copy)
            musicDuration(newVal) {
                this.duration = newVal
                //对每次进来的进度条进行判断
                // 跟下一句台词时长是否匹配,如果匹配则当前高亮的索引值+1
                //使用循环帮助****回退  快进****的判断
                for (let i = 0; i < this.musicLrcList.length; i++) {
                    //这里使用小于符号判断是为了 保证回退音乐进度事件的效果实现性
                    if (newVal <= parseFloat(this.musicLrcList[i].t)) {
                        if (this.lyricIndex === i - 1) {
                            break
                        }
                        //找到比当前时间点 大一点的后一位的歌词的索引值
                        this.lyricIndex = i - 1;
                        //当前距离上方的距离  控制歌词上下滚动
                        var currentTemp = this.$refs.lyric.style.marginTop
                        currentTemp = currentTemp.substr(0, currentTemp.length - 2)
                        //滚动距离
                        currentTemp = parseInt(currentTemp)
                        if (i > 5) {//第五句歌词之后 开始使用定位
                            /**
                             * 例子
                             * 第一句 margin-top 25px
                             * 第二句 margin-top 50px
                             * 第三句 margin-top 75px;
                             * 以此类推
                             *  ***计算出给一句歌词一个距离顶部的一个距离
                             *  (每次只需要切换到当前距离顶部的位置 实现歌词滚动)
                             *  顶部的位置 = 当前高亮歌词索引 * 25 +'px'   ***
                             * @type {number}
                             */
                            currentTemp = (i - 5) * -35
                            //设置样式
                            this.$refs.lyric.style.marginTop = currentTemp + 'px'
                        }
                        //如果当前是最后一句歌词 代表歌曲要放送结束了 将我们的lyricIndex(当前歌词索引值还原成0便于下一曲使用)
                        if (this.lyricIndex === this.musicLrcList.length - 1) {
                            this.lyricIndex = 0;
                        }
                        break;
                    }
                }
            },
        }

    }
</script>

<style scoped lang="less">
    .top {
        height: 900px;
        position: relative;
    }

    .background-img {
        position: absolute;
        width: 90%;
        height: 900px;
        border-radius: 25px;
        opacity: 0.4;
        left: 5%;
    }

    .music-title {
        font-size: 25px;
    }

    .music-poster {
        position: absolute;
        left: 13%;
        top: 150px;
        border: 45px solid black;
        box-shadow: 0 0 5px 5px gray;
        border-radius: 100%;
        width: 200px;
        height: 200px;
    }

    .lyrics {
        position: absolute;
        top: 60px;
        left: 600px;
        height: 100px;

        span {
            margin-right: 20px;
        }

        .singer {
            color: #0c80ea;
            cursor: pointer;
        }

        /*歌词，台词*/

        .lines {
            margin-top: 20px;
            overflow: hidden;
            height: 350px;

            li {
                list-style: none;
                margin-top: 15px;
            }
        }

        .currentLyric {
            color: red;
            font-size: 25px;
        }
    }

    .el-main {
        .pagination {
            color: black;
            margin-top: 10px;
            margin-bottom: 50px;
        }
    }
</style>
