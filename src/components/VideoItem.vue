<template>
  <div>
      <!--        其实可以把这个组件和item整合成一个的，但是看着不顺眼，我就又分开了-->
      <el-row :gutter="12">
          <el-col v-for="item in myList" :key="item.vid" @click.native="videoPage(item)" :span="4">
              <div class="top">
                  <!--            播放量-->
                  <div class="playCount" v-if="isMV">
                      <i class="el-icon-headset"></i>
                      {{item.playCount >= 10000 ? (item.playCount / 10000).toFixed(0)
                      + '万' : item.playCount}}
                  </div>
                  <div class="playCount" v-else>
                      <i class="el-icon-headset"></i>
                      {{item.playTime >= 10000 ? (item.playTime / 10000).toFixed(0)
                      + '万' : item.playTime}}
                  </div>
              </div>
              <el-image :src="item.cover" v-if="isMV"></el-image>
              <el-image :src="item.coverUrl" v-else></el-image>
              <!--                    标题-->
              <el-tooltip  effect="dark" :content="item.title" placement="top-start">
                  <span v-if="isMV" :title="item.name">{{item.name.length > 15 ?
                      item.name.substring(0,13) + '...' :
                      item.name}}</span>
                  <span v-else :title="item.title">{{item.title.length > 15 ?
                      item.title.substring(0,13) + '...' :
                      item.title}}</span>
              </el-tooltip>
          </el-col>
      </el-row>
  </div>
</template>

<script>
    export default {
        name: "VideoItem",
        props: {
            myList: Array,
            isMV:{
                type:Boolean,
                default:false
            }
        },
        created() {
        },
        data(){
          return{
          }
        },
        methods: {
            videoPage(item) {
                if(this.isMV){
                    this.$router.push('/videoPage/' + item.id)
                }else {
                    this.$router.push('/videoPage/' + item.vid)
                }
            }
        }
    }
</script>

<style scoped lang="less">

    .el-image {
        border-radius: 15px;
        box-shadow: 0 0 2px 2px gray;
        cursor: pointer;
        width: 100%;
        height: 180px;
    }

    h1 {
        cursor: pointer;
    }


    .el-icon-headset {
        margin-right: 10px;
    }

    .el-col{
        margin-bottom: 10px;
        span{
            display: inline-block;
            margin-top: 10px;
            cursor: pointer;
            font-size: 10px;
        }
    }
    .top {
        position: absolute;
        z-index: 99;
        color: white;
        background: rgba(128, 128, 128, 0.2);
        width: 188px;
        height: 30px;
        border-radius: 14px;
    }

    .playCount {
        position: absolute;
        top: 5px;
        right: 10px;
    }

</style>
