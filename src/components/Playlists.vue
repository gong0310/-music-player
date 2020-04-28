<template>
  <div class="playlists-container">
    <!-- 头部 -->
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="topPlayList.coverImgUrl+'?param=200y200'" alt />
      </div>
      <div class="content-wrap">
        <div class="tag" @click="toPlaylist(topPlayList.id)">精品歌单</div>
        <div class="title">{{ topPlayList.title }}</div>
        <div class="info">{{ topPlayList.description }}</div>
      </div>
      <img :src="topPlayList.coverImgUrl" alt class="bg" />
      <div class="bg-mask"></div>
    </div>

    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span class="item" @click="tag = '全部'" :class="{ active: tag === '全部' }">全部</span>
        <span class="item" @click="tag = '欧美'" :class="{ active: tag === '欧美' }">欧美</span>
        <span class="item" @click="tag = '华语'" :class="{ active: tag === '华语' }">华语</span>
        <span class="item" @click="tag = '流行'" :class="{ active: tag === '流行' }">流行</span>
        <span class="item" @click="tag = '说唱'" :class="{ active: tag === '说唱' }">说唱</span>
        <span class="item" @click="tag = '摇滚'" :class="{ active: tag === '摇滚' }">摇滚</span>
        <span class="item" @click="tag = '民谣'" :class="{ active: tag === '民谣' }">民谣</span>
        <span class="item" @click="tag = '电子'" :class="{ active: tag === '电子' }">电子</span>
        <span class="item" @click="tag = '轻音乐'" :class="{ active: tag === '轻音乐' }">轻音乐</span>
        <span class="item" @click="tag = '影视原声'" :class="{ active: tag === '影视原声' }">影视原声</span>
        <span class="item" @click="tag = 'ACG'" :class="{ active: tag === 'ACG' }">ACG</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div
            class="item"
            v-for="(item, index) in playlists"
            :key="index"
            @click="toPlaylist(item.id)"
          >
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img :src="item.coverImgUrl+'?param=200y200'" alt />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="pageNum"
      :page-size="pageSize"
    ></el-pagination>
  </div>
</template>

<script>
import { getTopPlaylist, getPalylist } from "@/api/api";

export default {
  name: "recommend",
  data() {
    return {
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 控制类型音乐
      tag: "全部",
      topPlayList: {},
      playlists: [],
      loading:true
    };
  },

  async created() {
    this._getTopPlaylist();
    this._getPlaylist();
  },

  methods: {
    // 页码改变事件
    handleCurrentChange(val) {
      this.pageNum = val;
      this._getPlaylist();
    },

    // 获取精品歌单
    async _getTopPlaylist() {
      const { data: resp } = await getTopPlaylist({ cat: this.tag, limit: 1 });
      this.topPlayList = resp.playlists[0];
      console.log(resp);
    },

    // 获取歌单列表
    async _getPlaylist() {
      const rLoading = this.openLoading();
      const { data: resp } = await getPalylist({
        cat: this.tag,
        limit: this.pageSize,
        total: true,
        offset: (this.pageNum - 1) * this.pageSize,
        order: "hot"
      });
      this.playlists = resp.playlists;
      this.total = resp.total;
      rLoading.close()
    },

    toPlaylist(id) {
      this.$router.push(`/playlist?id=${id}`);
    }
  },
  watch: {//监听器
    tag() {
      this.pageNum = 1;
      this._getTopPlaylist();
      this._getPlaylist();
    }
  }
};
</script>

<style lang="less" scoped>
.playlists-container .top-card {
  padding: 20px;
  height: 200px;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}

.playlists-container .top-card .icon-wrap {
  margin-right: 20px;
  z-index: 1;
}

.playlists-container .top-card .icon-wrap img {
  width: 160px;
  height: 160px;
}

.playlists-container .top-card .content-wrap {
  z-index: 1;
}

.playlists-container .top-card .content-wrap .tag {
  color: #dfac67;
  border: 1px solid #dfac67;
  width: 100px;
  height: 30px;
  text-align: center;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
}

.playlists-container .top-card .content-wrap .title {
  color: white;
  padding-top: 10px;
}

.playlists-container .top-card .content-wrap .info {
  color: #888482;
  font-size: 14px;
  padding-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}

.playlists-container .top-card .bg {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  filter: blur(20px);
}

.playlists-container .top-card .bg-mask {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.playlists-container .tab-container {
  padding-top: 30px;
}

.playlists-container .tab-container .tab-bar {
  display: flex;
  justify-content: flex-end;
}

.playlists-container .tab-container .tab-bar .item {
  font-size: 15px;
  color: gray;
  margin-right: 20px;
  cursor: pointer;
}

.playlists-container .tab-container .tab-bar .item.active {
  color: #dd6d60;
}

.playlists-container .tab-container .tab-content {
  margin-top: 20px;
}

.playlists-container .tab-container .tab-content .items {
  display: flex;
  flex-wrap: wrap;
}

.playlists-container .tab-container .tab-content .items .item {
  width: 200px;
  margin: 10px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.playlists-container .tab-container .tab-content .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

.playlists-container .tab-container .tab-content .items .item .num-wrap {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  color: white;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.5);
  height: 30px;
  width: 100%;
  padding-left: 5px;
  top: -30px;
  overflow: hidden;
}

.playlists-container .tab-container .tab-content .items .item:hover .num-wrap {
  top: 0;
}

.playlists-container .tab-container .tab-content .items .item .img-wrap {
  position: relative;
}

.playlists-container
  .tab-container
  .tab-content
  .items
  .item
  .img-wrap
  .icon-play {
  position: absolute;
  right: 10px;
  bottom: 13px;
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

.playlists-container
  .tab-container
  .tab-content
  .items
  .item
  .img-wrap
  .icon-play::before {
  transform: translateX(3px);
}

.playlists-container
  .tab-container
  .tab-content
  .items
  .item
  .img-wrap:hover
  .icon-play {
  opacity: 1;
}

.playlists-container .tab-container .tab-content .items .item .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 14px;
}
</style>
