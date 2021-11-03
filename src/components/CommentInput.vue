<template>
    <div class="comments">
        <el-input type="text" maxlength="120" :show-word-limit="true" size="medium"
                  :clearable="true"
                  v-model="comment"
                  class="comment-input"></el-input>
            <div class="button">
                <el-button type="primary" size="medium" @click="commentBtn">评论</el-button>
            </div>
    </div>
</template>

<script>
    export default {
        name: "CommentInput",
        props: {
            type: Number,
            id: String,
        },
        data() {
            return {
                comment: '',
            }
        },
        methods: {
            // 发表评论
            async commentBtn() {
                if (this.comment == "") {
                    this.$message.error({
                        message: '评论不能为空！',
                        center: true
                    })
                } else {
                    // 将字符串转变为json格式
                    let userInfo = JSON.parse(window.localStorage.getItem('currentUserInfo'))
                    if (userInfo != null && userInfo != '') {
                        if(this.id.match(/\D/) != null){}
                        const res = (await this.$http.get('/comment', {
                            params: {
                                t: 1,
                                type: this.type,
                                id: this.id,
                                content: this.comment
                            }
                        })).data
                        // console.log(res);
                        if (res.code == 200) {
                            this.$message.success({
                                message: '发表成功，请耐心等待',
                                center: true
                            })
                            this.comment = ''
                        } else {
                            this.$message.error({
                                message: '发表评论失败!',
                                center: true
                            })
                        }
                    } else {
                        this.$message.info({
                            message: '请先登录！',
                            center: true
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .comments {
        background-color: rgb(240, 240, 242);
        height: 155px;

        .comment-input {
            width: 96%;
            margin: 15px;

            /deep/ .el-input__inner {
                height: 70px;
            }

        }
        .button{
            display: flex; justify-content: flex-end; margin-right: 3%
        }
        .el-button {
            margin-bottom: 15px;
        }
    }

</style>
