<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <div class="mv-info">
          <h2 class="title">{{ mvInfo.name }}</h2>
          <span class="date">发布：{{ mvInfo.publishTime }}</span>
          <span class="number">播放：{{ mvInfo.playCount }} 次</span>
        </div>
      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="url" autoplay></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="mvInfo.cover" alt="">
          </div>
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <p class="desc">
            {{ mvInfo.desc }}
          </p>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="hotComments !== undefined && hotComments.length !== 0">
        <p class="title">
          精彩评论<span class="number">({{ hotComments.length }})</span>
        </p>
        <div class="comments-wrap">
          <!-- 评论 -->
          <div class="item" v-for="(item, index) in hotComments" :key="index">
            <div class="icon-wrap">
              <!-- 头像 -->
              <img :src="item.user.avatarUrl+'?param=50y50'" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}</span>
                <span class="comment">：{{ item.content }}</span>
              </div>
              <!-- 回复 -->
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                <span class="comment">：{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{ item.time | dateFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论<span class="number">({{ total }})</span>
        </p>
        <div class="comments-wrap">
          <!-- 评论 -->
          <div class="item" v-for="(item, index) in comments" :key="index">
            <div class="icon-wrap">
              <!-- 头像 -->
              <img :src="item.user.avatarUrl+'?param=50y50'" alt="" />            
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}</span>
                <span class="comment">：{{ item.content }}</span>
              </div>
              <!-- 回复 -->
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                <span class="comment">：{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{ item.time | dateFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="pageNum" :page-size="pageSize">
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in simiMvs" :key="index" @click="playMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover+'?param=250y150'" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ item.playCount | playNumFormat }}</div>
              </div>
              <span class="time">{{ item.duration | playTimeFormat }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="height"></div>
  </div>
</template>

<script>
import { getMvUrl, getMvDetail, getMvComment, getSimiMvUrl } from '@/api/api'

export default {
  name: 'mv',
  data() {
    return {
      id: '',
      total: 20,
      pageNum: 1,
      pageSize: 10,
      mvInfo: {},
      simiMvs: [],
      hotComments: [],
      comments: []
    }
  },
  created() {
    this.id = this.$route.query.id
    this._getMvUrl()
    this._getMvDetail()
    this._getSimiMvUrl()
    this._getMvComment()
  },
 computed: {
      url(){
        return this.$store.state.mvUrl
      }
    },
  methods: {
    handleCurrentChange(val) {
      this.pageNum = val
      this._getMvComment()
    },
    // 获取MV播放地址
    async _getMvUrl() {
      const { data: resp } = await getMvUrl({
        id: this.id,
        r: 1080
      })
      this.$store.commit('mvUrl',resp.data.url)
    },

    // 获取MV详情
    async _getMvDetail() {
      const { data: resp } = await getMvDetail(this.id)
      console.log(resp)
      this.mvInfo = resp.data
    },

    // 获取MV评论
    async _getMvComment() {
      const rLoading = this.openLoading();
      const { data: resp } = await getMvComment({
        id: this.id,
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize
      })
      this.comments = resp.comments
      this.hotComments = resp.hotComments
      this.total = resp.total
      rLoading.close()
    },

    // 获取相关MV
    async _getSimiMvUrl() {
      const { data: resp } = await getSimiMvUrl(this.id)
      this.simiMvs = resp.mvs
    },

    playMv(id) {
      this.pageNum = 1
      this.id = id
      this._getMvUrl()
      this._getMvDetail()
      this._getSimiMvUrl()
      this._getMvComment()
    }
  }
}
</script>

<style lang="less" scoped>
.mv-container {
  display: flex;
}

.mv-container .title {
  margin-bottom: 20px;
}

.mv-container .mv-wrap {
  width: 700px;
  margin-right: 35px;
}

.mv-container .mv-wrap .date {
  margin-right: 25px;
}

.mv-container .mv-wrap .date,
.mv-container .mv-wrap .number {
  color: #bebebe;
  font-size: 14px;
}

.mv-container .mv-wrap .video-wrap {
  width: 100%;
  height: 390px;
  margin-bottom: 20px;
}

.mv-container .mv-wrap .video-wrap video {
  border-radius: 5px;
  height: 100%;
  width: 100%;
  outline: none;
}

.mv-container .mv-wrap .info-wrap {
  margin-bottom: 50px;
}

.mv-container .mv-wrap .info-wrap .singer-info {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
}

.mv-container .mv-wrap .info-wrap .singer-info .avatar-wrap {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
}

.mv-container .mv-wrap .info-wrap .singer-info .avatar-wrap img {
  height: 100%;
}

.mv-container .mv-wrap .info-wrap .mv-info .title {
  font-size: 30px;
}

.mv-container .mv-wrap .info-wrap .mv-info .desc {
  font-size: 15px;
  margin-top: 20px;
}

.mv-container .mv-wrap .comment-wrap {
  margin-bottom: 70px;
}

.mv-container .mv-wrap .comment-wrap .title {
  font-size: 25px;
}

.mv-container .mv-wrap .comment-wrap .title .number {
  color: black;
  font-size: 20px;
}

.mv-container .mv-wrap .comment-wrap .item {
  display: flex;
  padding-top: 20px;
}

.mv-container .mv-wrap .comment-wrap .item .icon-wrap {
  margin-right: 15px;
}

.mv-container .mv-wrap .comment-wrap .item .icon-wrap img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.mv-container .mv-wrap .comment-wrap .item:not(:last-child) .content-wrap {
  border-bottom: 1px solid #f2f2f1;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap {
  padding-bottom: 20px;
  flex: 1;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap .name {
  color: #517eaf;
  font-size: 14px;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap .comment {
  font-size: 14px;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap .content,
.mv-container .mv-wrap .comment-wrap .item .content-wrap .re-content {
  margin-bottom: 10px;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap .re-content {
  padding: 10px;
  background-color: #e6e5e6;
  border-radius: 5px;
}

.mv-container .mv-recommend {
  flex: 1;
}

.mv-container .mv-recommend .mvs .items {
  display: flex;
  flex-wrap: wrap;
}

.mv-container .mv-recommend .mvs .items .item {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.mv-container .mv-recommend .mvs .items .item:hover {
  background-color: #f5f5f5;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap {
  width: 180px;
  position: relative;
  margin-right: 10px;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap > .icon-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  color: #dd6d60;
  font-size: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap > .icon-play::before {
  transform: translateX(3px);
}

.mv-container .mv-recommend .mvs .items .item .img-wrap:hover > .icon-play {
  opacity: 1;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap img {
  width: 100%;
  border-radius: 5px;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  display: flex;
  align-content: center;
  font-size: 15px;
  padding-right: 5px;
  padding-top: 2px;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap .num-wrap .icon-play {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap .time {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: white;
  font-size: 15px;
}

.mv-container .mv-recommend .mvs .items .item .info-wrap {
  flex: 1;
}

.mv-container .mv-recommend .mvs .items .item .info-wrap .name {
  font-size: 15px;
}

.mv-container .mv-recommend .mvs .items .item .info-wrap .singer {
  font-size: 14px;
  color: #c5c5c5;
}
.height{
  height: 50px;
}
</style>
