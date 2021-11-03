<template>
    <div>
        <el-header>
            <el-button class="category-button" @click="categoryDialogVisible = true">全部分类</el-button>
            <!--            弹框-->
            <el-dialog
                    class="categoryDialog"
                    title="全部分类"
                    :modal="false"
                    :visible.sync="categoryDialogVisible"
                    width="50%">
                <el-tag v-for="(item,index) in allCategories" @click="changeCategory(item,index)"
                        :class="['tag',index == activeTagIndex ? 'active-tag':'']" :key="item.id">
                    {{item.name}}
                </el-tag>
            </el-dialog>
        </el-header>
        <el-main>
            <video-item :my-list="videoList"></video-item>
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
        name: "ChildVideo",
        components: {
            VideoItem
        },
        created() {
            this.getAllCategories()
            this.getVideoList()
        },
        data() {
            return {
                allCategories: [],
                categoryDialogVisible: false,
                activeTagIndex: 0,
                videoList: [],
                queryInfo: {
                    id: 58100,
                    offset: 0,
                }
            }
        },
        methods: {
            // 获取全部分类标签
            async getAllCategories() {
                const res = (await this.$http.get('/video/group/list')).data
                this.allCategories = res.data
                // console.log(this.allCategories);
            },
            changeCategory(item, index) {
                this.activeTagIndex = index
                this.queryInfo.id = item.id
                this.getVideoList()
                this.categoryDialogVisible = false
            },
            async getVideoList() {
                this.videoList = []
                const res = (await this.$http.get('/video/group', {params: this.queryInfo})).data
                res.datas.forEach(item =>{
                    this.videoList.push(item.data)
                })
                console.log(this.videoList);
            },
            changePage(value){
                this.queryInfo.offset = (value - 1) * 8
                this.getVideoList()
            }
        }
    }
</script>

<style scoped lang="less">
    .el-header {
        .el-button {
            background-color: #dc5454;
            color: white;
        }

        /deep/ .categoryDialog {
            position: absolute;
            top: 87px;
            left: -230px;

            .tag {
                margin-left: 15px;
                margin-bottom: 20px;
                cursor: pointer;
            }

            .active-tag {
                background-color: #dc5454;
                color: white;
            }
        }
    }
    .el-main{
        .pagination{
            width: 100px;
            margin: 10px auto 50px auto;
        }
    }

</style>
