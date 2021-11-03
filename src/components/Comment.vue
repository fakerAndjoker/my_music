<template>
    <div>
        <div v-for="(item,index) in commentList" class="hot-comments">
            <img :src="item.user.avatarUrl" alt="" class="avatar">
            <!--                        右侧评论-->
            <div class="comment-item">
                <p><span class="nickname">{{item.user.nickname}}</span>: {{item.content}}</p>
                <!--                            也许有子评论-->
                <br v-if="item.beReplied.length > 0">
                <div v-if="item.beReplied.length > 0">
                    <p v-for="citem in item.beReplied"><span class="nickname">{{citem.user.nickname}}</span>:
                        {{citem.content}}</p>
                </div>
                <p class="comment-time">{{item.time | dateFormat}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Comment",
        props: {
            commentList: Array,
        }
    }
</script>

<style scoped lang="less">
    .nickname {
        color: lightskyblue;
        cursor: pointer;
    }

    .hot-comments {
        border-top: 2px solid rgb(240, 240, 242);
        border-bottom: 1px solid rgb(240, 240, 242);
        font-size: 15px;
        padding: 15px;
        display: flex;

        .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .comment-item {
            margin-left: 15px;

        }

        .comment-time {
            font-size: 13px;
            color: gray;
            opacity: 0.7;
        }

    }
</style>
