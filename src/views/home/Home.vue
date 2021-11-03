<template>
    <el-container class="home-container">
        <!--        头部区域-->
        <el-header>
            <div class="leftTop">
                <img src="../../assets/imgs/logo.png" alt="" class="logo">
                <span>魔音灌耳</span>
                <!--                搜索按钮-->
                <!--                未完成-->
                <el-input placeholder="搜索单曲，歌手，视频，歌单" size="mini" suffix-icon="el-icon-search" v-model="searchInfo"
                          @keyup.enter.native="searchBtn">
                    <el-button slot="suffix" size="mini" @click="searchBtn"></el-button>
                </el-input>
            </div>
            <!--            用户登录-->
            <div class="rightTop">
                <img v-if="currentUserInfo === null" src="../../assets/imgs/userIcon.png" alt="" class="userIcon">
                <img v-else :src="currentUserInfo.avatarUrl" alt="" class="userIcon">
                <span v-if="currentUserInfo === null" @click="loginDialogVisible = true">未登录</span>
                <span v-else>{{currentUserInfo.nickname}}</span>
                <el-button type="danger" v-if="currentUserInfo !== null" size="mini" @click="loginOut">退出</el-button>
            </div>
        </el-header>
        <el-container>
            <!--            侧边栏-->
            <el-aside width="200px">
                <el-menu :default-active="defaultActiveItem" :router="true"
                         background-color="white"
                         text-color="black"
                         active-text-color="red"
                         style="height: 100%;"
                >
                    <el-menu-item-group>
                        <span slot="title">推荐</span>
                        <el-menu-item index="/findMusic">发现音乐</el-menu-item>
                        <el-menu-item index="/video">视频</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <span slot="title">我的音乐</span>
                        <el-menu-item index="/cloudDisk">我的音乐云盘</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <span slot="title">创建的歌单</span>
                        <el-menu-item :index="'/songList/'+item.id" v-if="!item.subscribed"
                                      v-for="(item,index) in userPlayList" :key="item.id">
                            {{item.name}}
                        </el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <span slot="title">收藏的歌单</span>
                        <el-menu-item :index="'/songList/'+item.id" v-for="(item,index) in userPlayList"
                                      v-if="item.subscribed">
                            {{item.name}}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-menu>
            </el-aside>
            <el-container>
                <!--                主要内容-->
                <el-main>
                    <!--                    绑定key,解决路由相同参数不同时数据不刷新的问题,但是这样做会让修改子路由时父路由也会刷新-->
                    <!--                    <router-view :musicDuration="currentTime" :key="$route.fullPath"></router-view>-->
                    <router-view :musicDuration="currentTime"></router-view>
                </el-main>
            </el-container>
        </el-container>

        <el-footer>
            <!--            播放详情-->
            <div class="musicDetail" v-if="this.$store.getters.getMusicDetail != null">
                <div>
                    <img :src="this.$store.getters.getMusicDetail.al.picUrl"
                         @click="musciDetail"
                         alt="">
                </div>
                <div>
                    <p class="currentMusicName">{{$store.getters.getMusicDetail.name}}</p>
                    <p class="currentMusicAuthor">{{$store.getters.getMusicDetail.ar[0].name}}</p>
                </div>
            </div>
            <!--            播放器-->
            <el-row>
                <!--                左侧-->
                <el-col :span="2.5">
                    <img src="../../assets/imgs/prev.png" alt="" class="playImg">
                    <img v-if="$store.getters.getIsPlay" src="../../assets/imgs/pauseMusic.png" alt="" class="playImg"
                         @click="playMusic">
                    <img v-else src="../../assets/imgs/playMusic.png" alt="" class="playImg" @click="playMusic">
                    <img src="../../assets/imgs/next.png" alt="" class="playImg">
                </el-col>
                <!--                时间进度条-->
                <el-col :span="12" style="position: relative">
                    <span class="currentTime">{{currentTime | timeFormat}}</span>
                    <el-slider v-model="currentTime" :max="totalDuration" :show-tooltip="false" class="timeProgress"
                               @change="musicCurrentTimeChange"
                               :disabled="totalDuration === 0 ? true : false"
                    ></el-slider>
                    <span class="totalDuration">{{totalDuration | timeFormat}}</span>
                </el-col>
                <!--                音量大小-->
                <el-col :span="5" :offset="1" style="position: relative">
                    <img src="../../assets/imgs/laba.png" v-if="musicVolume !== 0" alt="" @click="silence"
                         class="trumpet">
                    <img src="../../assets/imgs/shutUp.png" v-else alt="" @click="silence" class="trumpet">
                    <el-slider v-model="musicVolume" :show-tooltip="false" class="volumeProgress"
                               @change="musicVolumeChange"></el-slider>
                    <img src="../../assets/imgs//songList.png" alt="" class="songList">
                </el-col>
            </el-row>
            <!--            音频播放器-->
            <audio :src="this.$store.getters.getMusicUrl" autoplay ref="audio" @timeupdate="currentTimeUpdate"></audio>
        </el-footer>


        <!--        dialog-->
        <!--        登录弹窗-->
        <el-dialog
                @close="closeLoginDialog('loginFormRef')"
                title="使用网易云官方注册的账号登录即可"
                :visible.sync="loginDialogVisible"
                width="35%">
            <img src="../../assets/imgs/phone.png" alt="" style="display: block; margin: 0 auto">
            <el-form :model="loginForm" ref="loginFormRef" style="margin-top: 15px" :rules="loginFormRules">
                <el-form-item prop="phone" style="margin: 0 auto; width: 60%;">
                    <el-input v-model="loginForm.phone" prefix-icon="el-icon-user" placeholder="请输入手机号"
                              type="number"></el-input>
                </el-form-item>
                <el-form-item prop="password" style="margin: 25px auto; width: 60%;">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"
                              placeholder="请输入密码"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="danger" style="margin: 0 auto; width: 60%;display: block" @click="login('loginFormRef')">
                登录
            </el-button>
        </el-dialog>
    </el-container>
</template>

<script>

    export default {
        name: 'Home',
        components: {},
        data() {
            return {
                searchInfo: this.$route.params.info,
                // 登录
                loginDialogVisible: false,
                currentUserInfo: null,
                userPlayList: [],
                loginForm: {
                    phone: '15696204296',
                    password: 'fighting2001zyz'
                },
                loginFormRules: {
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {min: 11, max: 11, message: '手机号长度为11', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: 'blur'},
                        {min: 5, max: 20, message: "密码长度为5-20", trigger: 'blur'}
                    ]
                },

                // 播放器
                // 设置当前正在播放的音乐信息,
                // 当前播放进度以及总时间
                currentTime: 0,
                totalDuration: 0,

                // 音量大小
                musicVolume: 20,

            }
        },
        created() {
            this.getCurrentUserInfo()
        },
        methods: {
            getCurrentUserInfo() {
                this.currentUserInfo = window.localStorage.getItem("currentUserInfo") == null ? null : JSON.parse(window.localStorage.getItem("currentUserInfo"))
                // console.log(this.currentUserInfo);
                this.getUserSongList()
            },
            // 获取用户的歌单信息
            async getUserSongList() {
                if (this.currentUserInfo == '' || this.currentUserInfo == null) {
                    return;
                }
                const res = (await this.$http.get('/user/playlist', {params: {uid: this.currentUserInfo.userId}})).data
                this.userPlayList = res.playlist
                // console.log(this.userPlayList);
            },
            searchBtn() {
                if (this.searchInfo == '') {
                    return this.$message.info({
                        message: '搜索内容不能为空！',
                        center: true
                    })
                } else {
                    this.$router.push('/search/' + this.searchInfo)
                }
            },
            login(forName) {
                this.$refs[forName].validate(async (valid) => {
                    if (!valid) {
                        console.log("错误");
                    } else {
                        const res = (await this.$http.post('login/cellphone', {
                            "phone": this.loginForm.phone,
                            "password": this.loginForm.password
                        })).data
                        if (res.code != 200) {
                            return this.$message({
                                type: "error",
                                message: res.message,
                                center: true
                            })
                        } else {
                            this.$message({
                                type: "success",
                                message: "登录成功！",
                                center: true
                            })
                            // 保存cookie
                            window.localStorage.setItem("musicCookie", res.cookie)
                            // 保存用户信息
                            window.localStorage.setItem("currentUserInfo", JSON.stringify(res.profile))

                            this.loginDialogVisible = false
                            this.getCurrentUserInfo()
                        }
                    }
                })
            },
            loginOut() {
                window.localStorage.clear()
                this.getCurrentUserInfo()
                this.userPlayList = []
            },
            closeLoginDialog(forName) {
                this.$refs[forName].resetFields()
            },
            // 播放器
            changeToPrevMusic() {
                console.log("上一首");
            },
            // 暂停与播放
            playMusic() {
                if (this.$store.getters.getMusicUrl != "" && this.$store.getters.getMusicUrl != null) {
                    this.$store.commit('changPlayStatus')
                    let audio = this.$refs.audio
                    if (!audio.paused) {
                        audio.pause()
                    } else {
                        audio.play()
                    }
                }
            },
            changeToNextMusic() {
                console.log("下一首");
            },
            currentTimeUpdate() {
                this.currentTime = this.$refs.audio.currentTime
                this.totalDuration = this.$refs.audio.duration
                if (this.currentTime == this.totalDuration) {
                    this.$store.commit('changPlayStatus')
                }
            },
            musicCurrentTimeChange() {
                if (this.totalDuration == 0) {
                    return
                } else {
                    this.$refs.audio.currentTime = this.currentTime
                    // 歌曲播放完之后，修改进度条时间之后也要播放歌曲
                    let audio = this.$refs.audio
                    audio.play()
                    this.$store.commit("playMusic")
                }
            },

            // 音量控制
            silence() {
                if (this.musicVolume !== 0) {
                    this.musicVolume = 0
                    this.changeVolume(0)
                } else {
                    this.musicVolume = 20
                    this.changeVolume(20)
                }
            },
            changeVolume(num) {
                // 设置声音的百分比
                this.$refs.audio.volume = num / 100
            },
            musicVolumeChange() {
                this.changeVolume(this.musicVolume)
            },

            // 音乐详情
            musciDetail() {
                this.$router.push('/musicDetail/' + this.$store.state.musicDetail.id)
            }
        },
        computed: {
            // 更改默认路由
            defaultActiveItem() {
                let path = ''
                if (this.$route.fullPath.includes('childVideo') || this.$route.fullPath.includes('childMV')) {
                    path = '/video'
                } else if (this.$route.fullPath.includes('cloudDisk')) {
                    path = '/cloudDisk'
                } else {
                    path = '/findMusic'
                }
                this.userPlayList.forEach(item => {
                    if (this.$route.fullPath.includes('songList/' + item.id)) {
                        path =  '/songList/' + item.id
                    }
                })
                return path
            }
        }
    }
</script>
<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: rgb(236, 65, 65);
        display: flex;


        .leftTop {
            display: flex;

            .logo {
                width: 25px;
                height: 25px;
                margin: 15px 10px 15px 10px;
                border-radius: 100px;
            }

            span {
                width: 150px;
                margin-right: 60px;
                margin-top: 15px;
                color: white;
                font-size: 20px;
                font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
                font-weight: 500;
            }

            .el-input {
                margin: 15px 0;
            }

            /deep/ .el-input__inner {

                &::placeholder {
                    color: #696969;
                }

                border-radius: 12px;
                border: none;
                background-color: rgba(230, 230, 250, 0.3);
                color: #4e545a;
            }

            .el-button {
                /*设置按钮为透明，里面的值也看不见，但是可以点击*/
                opacity: 0;
                position: absolute;
                top: 7px;
                right: 1px;
            }


        }

        .rightTop {
            display: flex;
            margin-left: auto;

            .userIcon {
                margin-top: 15px;
                margin-right: 12px;
                width: 30px;
                height: 30px;
                border-radius: 60%;
            }

            span {
                font-size: 17px;
                color: white;
                margin-top: 17px;
                cursor: pointer;
            }

            .el-button {
                height: 40px;
                margin-top: 10px;
                margin-left: 15px;
            }
        }

    }


    .el-aside {
        .el-menu-item-group {
            span {
                margin-left: -15px;
            }
        }

        .el-menu-item {
            height: 45px;
            line-height: 3.45em;
            font-size: 15px;
        }

        .el-menu-item.is-active {
            border-left: 3px red solid;
        }

        .el-menu-item:hover {
            background-color: #c3e0f3 !important;
        }
    }

    .el-main {
    }

    .el-footer {
        border-top: 1px solid gray;
        background-color: white;
        position: fixed;
        width: 100%;
        height: 100px;
        bottom: 0;
        z-index: 99;

        .musicDetail {
            width: 150px;
            background-color: white;
            display: flex;
            position: absolute;
            z-index: 100;
            left: 0;
            top: -64px;

            img {
                width: 60px;
                height: 63px;
                cursor: pointer;
            }

            .currentMusicName {
                margin: 0 0 42px 10px;
                height: 4px;
                font-size: 12px;
            }

            .currentMusicAuthor {
                height: 4px;
                font-size: 10px;
                margin-left: 10px;
                cursor: pointer;
            }
        }

        .playImg {
            border-radius: 100%;
            margin: 10px 10px;
        }

        .timeProgress {
            display: flex;
        }

        .currentTime {
            position: absolute;
            left: 100px;
            top: 22px;
        }

        .totalDuration {
            position: absolute;
            left: 780px;
            top: 22px;
        }

        .timeProgress {
            width: 600px;
            position: absolute;
            top: 12px;
            left: 162px;
        }

        .trumpet {
            position: absolute;
            top: 16px;
            left: 920px;
        }

        .volumeProgress {
            width: 40%;
            position: absolute;
            top: 10px;
            left: 968px;
        }

        .songList {
            position: absolute;
            top: 18px;
            left: 1100px;
        }
    }
</style>
