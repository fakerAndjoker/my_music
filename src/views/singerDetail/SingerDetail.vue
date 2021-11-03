<template>
    <el-container v-if="singerInfo != ''">
        <el-header style="height: 300px">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-image :src="singerInfo.artist.img1v1Url"></el-image>
                </el-col>
                <el-col :span="6">
                    <div>
                        <el-tag type="danger" class="singer-tag" size="medium ">歌手</el-tag>
                        <span class="singer-name">{{singerInfo.artist.name}}</span>
                    </div>
                    <div class="music">
                        <i class="el-icon-headset">
                            单曲数:{{singerInfo.artist.musicSize}}
                        </i>
                    </div>
                    <div class="album">
                        <i class="el-icon-first-aid-kit">
                            专辑数:{{singerInfo.artist.albumSize}}
                        </i>
                    </div>
                    <div class="MV">
                        <i class="el-icon-video-play">
                            MV数:{{singerInfo.artist.mvSize}}
                        </i>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-menu :default-active="this.$route.path" mode="horizontal" :router="true">
                <el-menu-item :index="`/album/${this.id}`">专辑</el-menu-item>
                <el-menu-item :index="`/MV/${this.id}`">mv</el-menu-item>
                <el-menu-item :index="`/singerDescribe/${this.id}`">歌手详情</el-menu-item>
            </el-menu>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "SingerDetail",
        created() {
            console.log("进来");
            this.getSingerInfo()
        },
        data() {
            return {
                id: this.$route.params.id,
                singerInfo: '',
            }
        },
        methods: {
            async getSingerInfo() {
                const res = (await this.$http.get('/artists', {params: {id: this.id}})).data
                this.singerInfo = res
                // console.log(this.singerInfo);
            }
        }
    }
</script>

<style scoped lang="less">
    .el-header {

        .el-col {
            .singer-tag {
                background-color: red;
                color: white;
            }

            .singer-name {
                margin-left: 15px;
                font-size: 20px;
            }

            .music, .album, .MV {
                margin-top: 25px;
            }

        }
    }
  .el-menu--horizontal>.el-menu-item.is-active{
        border-bottom:2px solid red;
    }

    .el-image{
        width: 300px;
        height: 300px;
    }
</style>
