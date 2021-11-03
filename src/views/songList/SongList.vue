<template>
    <el-container>
        <!--        头部信息-->
        <el-header style="height: 240px">
            <el-row class="header" v-if="currentSongList !=''  ">
                <!--                歌单图片-->
                <div>
                    <img :src="currentSongList.coverImgUrl" alt="" class="song-list-img">
                </div>
                <div class="top-center">
                    <div class="song-list-title">
                        <el-tag type="danger">精品歌单</el-tag>
                        <span>{{currentSongList.name}}</span>
                    </div>
                    <!--                    作者信息-->
                    <div class="author-info">
                        <img :src="currentSongList.creator.avatarUrl" alt="" class="auto-avatar">
                        <span>{{currentSongList.creator.nickname}}</span>
                        <span class="create-time">{{currentSongList.createTime | dateFormat }}</span>
                    </div>
                    <div class="buttons">
                        <el-button type="danger" icon="el-icon-video-play" size="mini">播放全部</el-button>
                        <el-button icon="el-icon-folder-add" size="mini">收藏{{currentSongList.subscribedCount}}
                        </el-button>
                        <el-button icon="el-icon-share" size="mini">收藏{{currentSongList.shareCount}}</el-button>
                    </div>
                    <div class="tag-array">
                        <span>标签: </span>
                        <span class="tag" v-for="(item,index) in currentSongList.tags">{{index + 1 == currentSongList.tags.length ? item : item + " / "}}</span>
                    </div>
                    <div class="introduction">
                        <!--                        根据activeNames的长度判断是否隐藏title-->
                        <el-collapse v-model="activeNames">
                            <el-collapse-item name="1"
                                              :title="activeNames.length == 0 ? '简介: ' + this.introduction: '简介: ' ">
                                <p>{{currentSongList.description}}</p>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
                <div class="top-right">
                    <p>歌曲数 | 播放量</p>
                    <p>{{currentSongList.trackCount}} | {{(currentSongList.playCount / 10000).toFixed(0)}}万</p>
                </div>
            </el-row>

        </el-header>

        <!--                歌曲列表以及评论-->

        <el-main>
            <el-tabs v-model="activeTabName">
                <el-tab-pane label="歌曲列表" name="first">
                    <song-list-table :music-list-info="musicListInfo"></song-list-table>
                </el-tab-pane>
                <el-tab-pane :label="'评论(' + totalComments +')'" name="second">
                    <!--                    评论框-->
                    <comment-input :type="2" :id="musicListId"></comment-input>
                    <h4 v-if="hotCommentList.length != 0">热门评论</h4>
                    <Comment :comment-list="hotCommentList"></Comment>
                    <h4>最新评论</h4>
                    <Comment :comment-list="commentList"></Comment>
                    <!--                    分页-->
                    <el-pagination
                            class="pagination"
                            :page-size="queryInfo.limit"
                            layout="prev, pager, next"
                            @current-change="handleCurrentChange"
                            :total="totalComments">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-main>

    </el-container>
</template>


<script>
    import Comment from "../../components/Comment";
    import CommentInput from "../../components/CommentInput";
    import SongListTable from "../../components/SongListTable";

    export default {
        name: "SongList",
        components: {
            Comment,
            CommentInput,
            SongListTable
        },
        data() {
            return {
                musicListId: this.$route.params.id,
                currentSongList: '',
                activeNames: [],
                introduction: '',
                activeTabName: 'first',
                // 歌曲列表数据
                musicListIds: '',
                musicListInfo: [],
                //播放歌曲
                musicUrl: '',
                musicDetail: '',
                currentMusicId: '',
                // 评论
                queryInfo: {
                    id: '',
                    offset: 0,
                    limit: 10,
                },
                hotCommentList: [],
                commentList: [],
                totalComments: 0,
            }
        },
        created() {
            this.getSongList()
            this.getCommentList()
        },
        methods: {
            async getSongList() {
                const res = (await this.$http.get('playlist/detail', {params: {id: this.musicListId}})).data
                // console.log(res);
                this.currentSongList = res.playlist
                this.introduction =this.currentSongList.description == null ? '' : this.currentSongList.description.substr(0, 26) + '...'
                this.currentSongList.trackIds.forEach(item => {
                    this.musicListIds += item.id + ','
                })
                // 去除最后一个多余的逗号
                this.musicListIds = this.musicListIds.substr(0, this.musicListIds.length - 1)
                await this.getMusicListInfo()
            },
            async getMusicListInfo() {
                const res = (await this.$http.get('song/detail', {params: {ids: this.musicListIds}})).data
                this.musicListInfo = res.songs;
                // console.log(this.musicListInfo);
                this.musicListInfo.forEach(item => {
                    let dt = new Date(item.dt)
                    let minute = (dt.getMinutes() + '').padStart(2, '0')
                    let second = (dt.getSeconds() + '').padStart(2, '0')
                    item.dt = minute + ":" + second
                })
            },
            //获取评论列表
            async getCommentList() {
                this.queryInfo.id = this.musicListId
                const res = (await this.$http.get("comment/playlist", {params: this.queryInfo})).data
                // console.log(res);
                this.hotCommentList = res.hotComments == null ? [] : res.hotComments
                // console.log(this.hotCommentList);
                this.commentList = res.comments
                this.totalComments = res.total
            },

            handleCurrentChange(value) {
                this.queryInfo.offset = (value - 1) * this.queryInfo.limit
                this.getCommentList();
            },
        }
    }
</script>

<style scoped lang="less">

    .header {
        display: flex;
        height: 600px;

        .song-list-img {
            width: 220px;
            height: 220px;
        }

        /*歌单名称*/

        .song-list-title {
            display: flex;

            .el-tag {
                margin-left: 20px;
                background-color: white;
                font-size: 12px;
                font-weight: normal;
            }

            span {
                font-size: 24px;
                font-weight: bold;
                margin-left: 20px;
            }
        }

        /*作者信息*/

        .author-info {
            margin-top: 20px;
            display: flex;
            align-items: center;

            .auto-avatar {
                width: 35px;
                height: 35px;
                border-radius: 15px;
                margin-left: 20px;
                cursor: pointer;
            }

            span {
                margin-left: 20px;
            }

            .create-time {
                color: gray;
            }
        }

        /*播放，收藏，分享*/

        .buttons {
            margin-left: 20px;
            margin-top: 15px;

            .el-button {
                margin-right: 15px;
            }
        }

        /*标签*/

        .tag-array {
            margin: 20px 0 0 20px;
            font-size: 20px;

            .tag {
                color: #159bee;
                cursor: pointer;
            }
        }

        /*简介*/

        .introduction {
            margin-left: 20px;

            .el-collapse {
                border-top: none;
            }
        }

        .top-right {
            margin-left: auto;
            color: gray;
            opacity: 0.6;
        }
    }

    .el-main {
        /deep/ .el-tabs__item {
            color: black;
        }

        /deep/ .el-tabs__item.is-active {
            color: red;
        }

        /deep/ .el-tabs__active-bar {
            background-color: red;
        }

        /deep/ .el-tabs__nav-wrap:after {
            width: 0px;
        }

        .music-list-table {
            cursor: pointer;
        }

        .pagination {
            margin-top: 15px;
            margin-bottom: 30px;

        }

        /deep/ .el-pager li.active, /deep/ .el-pager li:hover {
            color: red;
        }

        /deep/ .el-pagination button:hover {
            color: red;
        }


    }

</style>
