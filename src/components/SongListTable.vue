<template>
    <el-table
            class="music-list-table"
            v-if="musicListInfo != '' "
            :data="musicListInfo"
            stripe
            border
            :row-style="{height: '80px'}"
            style="width: 100%;">
        <el-table-column type="index" label="#" align="center">
            <template scope="scope">
                <img v-if="currentMusicId == scope.row.id " src="../assets/imgs/isPlay.png" alt="">
                <span v-else>{{scope.$index +1}}</span>
            </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="name"
                label="音乐标题"
                width="500">
            <template scope="scope">
                <span @click="playMusic(scope.row.id)">{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="歌手"
                width="180">
            <template scope="scope">
                <span>{{scope.row.hasOwnProperty('ar') ? scope.row.ar[0].name : scope.row.artists[0].name}}</span>
            </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="al.name"
                label="专辑名"
                width="400">
            <template scope="scope">
                <span>{{scope.row.hasOwnProperty('al') ? scope.row.al.name : scope.row.album.name}}</span>
            </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="dt"
                label="时长">
            <template scope="scope">
                <span v-if="scope.row.hasOwnProperty('dt')">{{scope.row.dt}}</span>
                <span v-else>{{scope.row.duration / 1000 | timeFormat}}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "SongListTable",
        props: {
            musicListInfo: Array,
        },
        created() {

        },
        data() {
            return {
                musicUrl:'',
                musicDetail:'',
                currentMusicId:''
            }
        },
        methods: {
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
            async playMusic(musicId) {
                this.currentMusicId = musicId;
                await this.getMusicUrl(musicId)
                await this.getMusicDetail(musicId)
                this.$store.commit('playMusic', this.musicUrl)
                this.$store.commit('changeMusicUrl', this.musicUrl)
                this.$store.commit('changeMusicDetail', this.musicDetail)
            },
        }
    }
</script>

<style scoped>
    span{
        cursor: pointer;
    }

</style>
