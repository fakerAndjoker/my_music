import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        musicUrl: '',
        musicDetail: null,
        isPlay: false,
    },
    // 同步
    mutations: {
        changeMusicUrl(state, musicUrl) {
            state.musicUrl = musicUrl
        },
        changeMusicDetail(state, musicDetail) {
            state.musicDetail = musicDetail
        },
        changPlayStatus(state) {
            state.isPlay = !state.isPlay
        },
        playMusic(state, newMusicUrl) {
            // 查看新切换的歌曲是不是原来正在播放的歌曲
            if (newMusicUrl == state.musicUrl) {
                return
            } else {
                state.isPlay = true
            }
        },
    },
    // 异步
    actions: {},
    modules: {},
    // 相当于计算属性，实时监听state的变化
    getters: {
        getMusicUrl(state) {
            return state.musicUrl

        },
        getMusicDetail(state) {
            return state.musicDetail
        },
        getIsPlay(state) {
            return state.isPlay
        },
    }
})
