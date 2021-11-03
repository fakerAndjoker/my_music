<template>
    <!--    video的评论功能有问题，地址不对-->
    <el-row>
        <!--      左侧视屏已经评论-->
        <el-col :span="14" :offset="2">
            <!--          头部标题区域-->
            <el-row v-if="mvInfo != ''" class="video-title">
                <el-tag type="danger" size="mini">MV</el-tag>
                <span> &nbsp;{{mvInfo.data.name}} </span>
                <span class="auto-name"> {{mvInfo.data.artistName}}</span>
            </el-row>
            <el-row class="play-video">
                <video :src="mvUrl" height="480px" width="100%" controls="controls">
                    很抱歉,您的浏览器当前不支持最新播放标签!
                </video>
            </el-row>
            <el-row>
                <h3>评论({{totalComments}})</h3>
                <comment-input :type="isMv ? 1: 5" :id="mvId"></comment-input>
            </el-row>
            <el-row>
                <h4 v-if="hotCommentList != '' && hotCommentList != null">精彩评论</h4>
                <comment :comment-list="hotCommentList"></comment>
            </el-row>
            <el-row>
                <h4>最新评论</h4>
                <comment :comment-list="newCommentList"></comment>
            </el-row>
            <!--            分页-->
            <el-pagination
                    class="pagination"
                    :page-size="10"
                    layout="prev, pager, next"
                    @current-change="currentPageChange"
                    :total="totalComments">
            </el-pagination>
        </el-col>
        <el-col :span="7" :offset="1" v-if="mvInfo != ''">
            <el-row class="introduce-MV">
                <h4 v-if="isMv">MV介绍</h4>
                <h4 v-else>视频介绍</h4>
            </el-row>
            <el-row>
                <span class="publishTime">发布时间: {{mvInfo.data.publishTime | dateFormat}}</span>
                <span class="playCount" v-if="isMv">播放次数: {{mvInfo.data.playCount > 10000 ? (mvInfo.data.playCount / 10000).toFixed(0) + "万" : mvInfo.data.playCount }}次</span>
                <span class="playCount" v-else>播放次数: {{mvInfo.data.playTime > 10000 ? (mvInfo.data.playTime / 10000).toFixed(0) + "万" : mvInfo.data.playTime }}次</span>
            </el-row>
            <el-row>
                <p class="summary">简介: {{mvInfo.data.hasOwnProperty('desc') ? mvInfo.data.desc :
                    mvInfo.data.description}}</p>
            </el-row>
            <el-row class="introduce-MV">
                <h4>相关推荐</h4>
            </el-row>

            <el-row v-for="(item,index) in relatedMvs" v-if="relatedMvs != ''" :key="index" class="related-mvs">
                <el-col :span="12">
                    <el-image v-if="isMv" :src="item.cover"
                              @click="toMVPage(item.id)"></el-image>
                    <el-image v-else :src="item.coverUrl" @click="toMVPage(item.vid)"></el-image>
                    <div class="play-count-box">
                        <div>
                            <i class="el-icon-headset"></i>
                            <span v-if="isMv">{{item.playCount > 10000 ?  (item.playCount / 10000).toFixed(0) +'万' : item.playCount}}</span>
                            <span v-else>{{item.playTime > 10000 ?  (item.playTime / 10000).toFixed(0) +'万' : item.playTime}}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="10" :offset="2" class="related-mvs-info">
                    <div>
                        <el-tag type="danger" size="mini">MV</el-tag>
                        <span v-if="isMv"> &nbsp;{{item.name}}</span>
                        <span v-else> &nbsp;{{item.title}}</span>
                    </div>
                    <div>
                        <span v-if="isMv">{{item.duration/1000 | timeFormat}}</span>
                        <span v-else>{{item.durationms/1000 | timeFormat}}</span>
                    </div>
                    <div>
                        <span v-if="isMv"> {{item.artistName}}</span>
                        <span v-else>{{item.creator[0].userName}}</span>
                    </div>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    import CommentInput from "../../components/CommentInput";
    import Comment from '../../components/Comment'

    export default {
        name: "VideoPage",
        components: {
            CommentInput,
            Comment
        },
        data() {
            return {
                isMv: true,
                mvId: this.$route.params.id,
                mvInfo: '',
                mvUrl: '',
                // 获取评论
                hotCommentList: [],
                newCommentList: [],
                totalComments: 0,
                queryInfo: {
                    id: this.$route.params.id,
                    limit: 10,
                    offset: 0,
                },
                // 相关MVs
                relatedMvs: [],
            }

        },
        created() {
            this.getType()
            this.getMvInfo()
            this.getMvUrl()
            this.getCommentList()
            this.getRelatedMvs()
        },
        methods: {
            getType() {
                if (this.mvId.match(/\D/) == null) {
                    this.isMv = true
                } else {
                    this.isMv = false
                }
            },
            // 根据ID的不同类型请求不同的地址
            async getMvInfo() {
                // 根据ID中是否有字母去不同的地址请求数据
                if (this.mvId.match(/\D/) == null) {
                    const res = (await this.$http.get('/mv/detail', {
                        params: {
                            mvid: this.mvId
                        }
                    })).data
                    this.mvInfo = res
                } else {
                    const res = (await this.$http.get('/video/detail', {
                        params: {
                            id: this.mvId
                        }
                    })).data
                    this.mvInfo = res
                }
                console.log(this.mvInfo);
            },
            async getMvUrl() {
                if (this.mvId.match(/\D/) == null) {
                    const res = (await this.$http.get('/mv/url', {
                        params: {
                            id: this.mvId
                        }
                    })).data
                    this.mvUrl = res.data.url
                } else {
                    const res = (await this.$http.get('/video/url', {
                        params: {
                            id: this.mvId
                        }
                    })).data
                    this.mvUrl = res.urls[0].url
                }

                // console.log(this.mvUrl);
            },
            async getCommentList() {
                if (this.mvId.match(/\D/) == null) {
                    const res = (await this.$http.get('/comment/mv', {params: this.queryInfo})).data
                    this.totalComments = res.total
                    this.hotCommentList = res.hotComments
                    this.newCommentList = res.comments
                } else {
                    const res = (await this.$http.get('/comment/video', {params: this.queryInfo})).data
                    this.totalComments = res.total
                    this.hotCommentList = res.hotComments
                    this.newCommentList = res.comments
                }

            },
            currentPageChange(page) {
                this.queryInfo.offset = (page - 1) * this.queryInfo.limit
                this.getCommentList()
            },
            async getRelatedMvs() {
                if (this.mvId.match(/\D/) == null) {
                    const res = (await this.$http.get('/simi/mv', {
                        params: {
                            mvid: this.mvId
                        }
                    })).data
                    this.relatedMvs = res.mvs
                } else {
                    const res = (await this.$http.get('/related/allvideo', {
                        params: {
                            id: this.mvId
                        }
                    })).data
                    this.relatedMvs = res.data
                }

                console.log(this.relatedMvs);
            },
            toMVPage(id) {
                this.$router.push('/videoPage/' + id)
                // 跳转到本页面要重新加载
                // document.location.reload()
            }
        },
        watch: {
            //监听相同路由下参数变化的时候，从而实现异步刷新
            '$route'(to, from) {
                //做一些路由变化的响应
                this.loading = true;//打开加载动画
               //重新获取数据
               //  this.getType()
               //  this.getMvInfo()
               //  this.getMvUrl()
               //  this.getCommentList()
               //  this.getRelatedMvs()
            },
        },
    }
</script>

<style scoped lang="less">
    .video-title {
        font-size: 16px;

        .auto-name {
            margin-left: 15px;
            font-size: 10px;
        }
    }

    .play-video {
        background-color: black;
        margin-top: 3px;
    }

    h3 {
        margin-top: 25px;
        font-size: 25px;
    }

    h4 {
        color: black;
        font-weight: normal;
    }

    .introduce-MV {
        border-bottom: 1px solid rgb(230, 230, 230);
        /*padding-bottom: 10px;*/
        font-size: 20px;
        height: 65px;
    }

    .pagination {
        margin-bottom: 60px;
    }

    .publishTime, .playCount {
        display: inline-block;
        font-size: 14px;
        margin-top: 10px;
    }

    .playCount {
        margin-left: 60px;
    }

    .summary {
        font-size: 14px;
        font-weight: 400;
    }

    .related-mvs {
        margin-top: 15px;
        margin-bottom: 20px;
        /*相关MV的播放次数*/

        .el-image {
            cursor: pointer;
        }

        .play-count-box {
            position: absolute;
            top: 0px;
            left: 87px;
            color: white;
            width: 100px;
            background: rgba(128, 128, 128, 0.2);

            div {
                display: flex;
                justify-content: flex-end;
                align-items: center;

                span {
                    margin: 0 10px 0 10px;
                }
            }
        }
    }

    .related-mvs-info {
        font-size: 10px;

        div {
            margin-bottom: 15px;
        }
    }

</style>
