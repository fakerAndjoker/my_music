<template>
    <div>
        <el-header>
            <p>
                地区:
                <span v-for="(item,index) in areas" @click="changeArea(item)"
                      :class="[item.id == activeAreaId ?  'active-tag' : '']">{{item.name}}</span>
            </p>
            <p>
                分类:
                <span v-for="(item,index) in types" @click="changeType(item)"
                      :class="[item.id == activeTypeId ?  'active-tag' : '']">{{item.name}}</span>
            </p>
            <p>
                排序:
                <span v-for="(item,index) in order" @click="changeOrder(item)"
                      :class="[item.id == activeOrderId ?  'active-tag' : '']">{{item.name}}</span>
            </p>
        </el-header>
        <el-main>
            <video-item :my-list="MVList" :is-m-v="true"></video-item>
            <el-pagination
                    class="pagination"
                    @current-change="changePage"
                    layout="prev, pager, next">
            </el-pagination>
        </el-main>
    </div>
</template>

<script>
    import VideoItem from "../../../components/VideoItem";
    export default {
        name: "ChildMV",
        components:{
            VideoItem
        },
        created() {
            this.getMVList()
        },
        data() {
            return {
                //类型
                types: [
                    {id: 0, name: '全部'},
                    {id: 1, name: '官方版'},
                    {id: 2, name: '原生'},
                    {id: 3, name: '现场版'},
                    {id: 4, name: '网易出品'}
                ],
                //地区
                areas: [
                    {id: 0, name: '全部'},
                    {id: 7, name: '内地'},
                    {id: 96, name: '港台'},
                    {id: 8, name: '欧美'},
                    {id: 16, name: '日本'},
                    {id: 11, name: '韩国'}
                ],
                //排序
                order: [
                    {id: 0, name: '上升最快'},
                    {id: 2, name: '最热'},
                    {id: 3, name: '最新'}
                ],
                activeAreaId: 0,
                activeTypeId: 0,
                activeOrderId: 0,
                MVList: [],
                queryInfo: {
                    area: '全部',
                    order: '上升最快',
                    type: '全部',
                    limit: 12,
                    offset: 0
                }
            }
        },
        methods: {
            async getMVList() {
                const res = (await this.$http.get('/mv/all', {params: this.queryInfo})).data
                this.MVList = res.data
                console.log(this.MVList);
            },
            changeArea(item) {
                this.activeAreaId = item.id
            },
            changeOrder(item) {
                this.activeOrderId = item.id
            },
            changeType(item) {
                this.activeTypeId = item.id
            },
            changePage(value){
                this.queryInfo.offset = (value - 1) * this.queryInfo.limit
                this.getMVList()
            }
        }
    }
</script>

<style scoped lang="less">
    p {
        span {
            margin: 0 10px 0 10px;
            cursor: pointer;
        }

        .active-tag {
            color: red;
        }
    }
    .el-main{
        .pagination{
            width: 100px;
            margin: 10px auto 50px auto;
        }
    }

</style>
