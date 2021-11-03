<template>
    <!--    其实不应该封装所有的item，只应该封装一个。因为每个item都要点击传参，这里跳转路径写死了，只适合跳转到歌单页面的item-->
    <div>
      <el-row :gutter="10">
          <el-col v-for="item in myList" :key="item.id" @click.native="toSongListPage(item.id)" :span="4">
              <div class="top">
                  <!--            播放量-->
                  <!--                本来把这里封装成组件想复用的，结果传进来的数据名称不一样，只有这样了-->
                  <div class="playCount">
                      <i class="el-icon-headset"></i>
                      {{item.playCount >= 10000 ? (item.playCount / 10000).toFixed(0)
                      + '万' : item.playCount}}
                  </div>
              </div>
              <el-image :src="item.coverImgUrl"></el-image>
              <!--                    标题-->
              <h1 :title="item.name">{{item.name.toString().length > 15 ?
                  item.name.toString().substring(0,13) + '...' :
                  item.name}}</h1>
          </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "Item",
        props: {
            myList: Array
        },
        methods: {
            toSongListPage(id) {
                this.$router.push('/songList/' + id)
            }
        }
    }
</script>

<style scoped>
    .el-image {
        border-radius: 15px;
        box-shadow: 0 0 2px 2px gray;
        cursor: pointer;
        width: 200px;
        height: 180px;
    }

    h1 {
        cursor: pointer;
    }

    .el-col {
        margin: 15px 0;
    }

    .el-icon-headset {
        margin-right: 10px;
    }

    .top {
        position: absolute;
        z-index: 99;
        color: white;
        background: rgba(128, 128, 128, 0.2);
        width: 200px;
        border-radius: 14px;
    }

    .playCount {
        position: absolute;
        top: 5px;
        right: 10px;
    }
</style>
