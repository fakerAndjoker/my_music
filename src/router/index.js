import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载
const Empty = () => import('../components/Empty')
const Home = () => import('../views/home/Home')
const FindMusic = () => import('../views/findMusic/FindMusic')
const Video = () => import('../views/video/Video')
const CloudDisk = () => import('../views/musicCloudDisk/CloudDisk')
const MusicDetail = () => import("../views/findMusic/childComponent/musicDetail/MusicDetail")
const SongList = () => import("../views/songList/SongList")
const VideoPage = () => import('../views/exclusiveVideoPage/VideoPage')
const Search = () => import("../views/search/Search")
const SingerDetail = () => import('../views/singerDetail/SingerDetail')


const Recommend = () => import('../views/findMusic/childComponent/recommend/Recommend')
const MusicList = () => import('../views/findMusic/childComponent/musicList/MusicList')
const Rank = () => import("../views/findMusic/childComponent/rank/Rank")
const Singer = () => import('../views/findMusic/childComponent/singer/Singer')
const LatestMusic = () => import('../views/findMusic/childComponent/latestMusic/LatestMusic')

// 歌手详情里面的子路由
const Album = () => import('../views/singerDetail/childComponent/album/Album')
const MV = () => import('../views/singerDetail/childComponent/mv/MV')
const SingerDescribe = () => import('../views/singerDetail/childComponent/singerDescribe/SingerDescribe')

// 视频里面的子路由
const ChildVideo = () => import("../views/video/childComponent/ChildVideo")
const ChildMV = () => import("../views/video/childComponent/ChildMV")

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        redirect: '/findMusic',
        component: Home,
        children: [
            // 发现音乐
            {
                path: '/findMusic',
                name: 'findMusic',
                redirect: '/myRecommend',
                component: FindMusic,
                children: [
                    // 个性推荐
                    {
                        path: '/myRecommend',
                        name: 'myRecommend',
                        component: Recommend
                    },
                    // 歌单
                    {
                        path: '/musicList',
                        name: 'musicList',
                        component: MusicList
                    },
                    // 排行榜
                    {
                        path: '/rank',
                        name: 'rank',
                        component: Rank
                    },
                    //歌手
                    {
                        path: '/singer',
                        name: 'singer',
                        component: Singer
                    },
                    //最新音乐
                    {
                        path: '/latestMusic',
                        name: 'latestMusic',
                        component: LatestMusic
                    }

                ]
            },
            // 视频
            {
                path: '/video',
                name: 'video',
                redirect: '/childVideo',
                component: Video,
                children: [
                    // 视频
                    {
                        path: "/childVideo",
                        name: 'childVideo',
                        component: ChildVideo,
                    },
                    {
                        path: '/childMV',
                        name: 'childMV',
                        component: ChildMV
                    }
                ]
            },
            // 我的音乐云盘
            {
                path: '/cloudDisk',
                name: 'cloudDisk',
                component: CloudDisk
            },
            // 音乐详情
            {
                path: '/musicDetail/:id',
                name: 'musicDetail',
                component: MusicDetail
            },
            // 推荐歌单
            {
                path: '/songList/:id',
                name: 'songList',
                component: SongList
            },
            //独家放送
            {
                path: '/videoPage/:id',
                name: 'videoPage',
                component: VideoPage
            },
            // 搜索歌曲,歌手
            {
                path: '/search/:info',
                name: 'search',
                component: Search
            },
            //歌手详情
            {
                path: '/singerDetail/:id',
                name: 'singerDetail',
                component: SingerDetail,
                redirect: '/album/:id',
                children: [
                    // 专辑
                    {
                        path: '/album/:id',
                        name: 'album',
                        component: Album
                    },
                    // MV
                    {
                        path: '/MV/:id',
                        name: 'MV',
                        component: MV
                    },
                    // 歌手详情
                    {
                        path: '/singerDescribe/:id',
                        name: 'singerDescribe',
                        component: SingerDescribe
                    }
                ]
            },
            // 空路由
            {
                path: '/empty',
                name: 'empty',
                component: Empty
            }
        ]
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 解决重复点击一个路由报错的问题

// 缓存原型上的push函数
const originPush = VueRouter.prototype.push
const originReplace = VueRouter.prototype.replace
// 给原型对象上的push指定新函数函数
VueRouter.prototype.push = function (location, onComplete, onAbort) {
    // 判断如果没有指定回调函数, 通过call调用源函数并使用catch来处理错误
    if (onComplete === undefined && onAbort === undefined) {
        return originPush.call(this, location, onComplete, onAbort).catch(() => {
        })
    } else { // 如果有指定任意回调函数, 通过call调用源push函数处理
        originPush.call(this, location, onComplete, onAbort)
    }
}
// replace同理处理
VueRouter.prototype.replace = function (location, onComplete, onAbort) {
    if (onComplete === undefined && onAbort === undefined) {
        return originReplace.call(this, location, onComplete, onAbort).catch(() => {
        })
    } else {
        originReplace.call(this, location, onComplete, onAbort)
    }
}


// 利用中间路由解决路径相同参数不同，页面不改变的问题
// 全局导航守卫
router.beforeEach((to, from, next) => {
    if (to.name === from.name && to.params !== from.params) {
        next({path: '/empty', query: {toPath: to.fullPath}})
    } else {
        next()
    }
})


export default router
