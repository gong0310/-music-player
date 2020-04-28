<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title" :keywords="(keywords = $route.query.inputVal)">{{ $route.query.inputVal }}</h2>
      <span class="sub-title">{{ count }}</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              class="el-table__row"
              v-for="(item, index) in songs"
              :key="index"
              @click="playMusic(item.id)"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <span v-if="item.mvid !== 0" class="iconfont icon-mv"></span>
                  </div>
                  <span v-if="item.alias.length !== 0">{{ item.alias[0] }}</span>
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration | playTimeFormat }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>

      <el-tab-pane label="歌单" name="lists">
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
                <span class="num">{{ item.playCount | playNumFormat }}</span>
              </div>
              <img :src="item.coverImgUrl+'?param=200y200'" alt />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="(item, index) in mvs" :key="index" @click="toMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover+'?param=250y150'" alt />
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
      </el-tab-pane>
    </el-tabs>

    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="pageNum"
      :page-size="pageSize"
    ></el-pagination>
    <div class="height"></div>
  </div>
</template>

<script>
import { search } from "@/api/api";

export default {
  name: "result",
  data() {
    return {
      // 总条数
      total: 0,
      // 页码
      pageNum: 1,
      pageSize: 10,
      keywords: "",
      activeIndex: "songs",
      songs: [],
      count: 0,
      playlists: [],
      mvs: [],
      songId: 0,
      type: 1
    };
  },
  watch: {
    keywords() {
      this._search();
    },

    activeIndex() {
      switch (this.activeIndex) {
        case "songs":
          this.type = 1;
          this.pageNum = 1;
          break;
        case "lists":
          this.type = 1000;
          this.pageNum = 1;
          break;
        case "mv":
          this.type = 1004;
          this.pageNum = 1;
          break;

        default:
          break;
      }
      this._search();
    }
  },

  methods: {
    handleCurrentChange(val) {
      this.pageNum = val;
      this._search();
    },
    //搜索结果
    async _search() {
      const rLoading = this.openLoading();
      const { data: resp } = await search({
        s: this.keywords,
        type: this.type,
        limit: this.type === 1004 ? 8 : 10,
        offset: (this.pageNum - 1) * (this.type === 1004 ? 8 : 10)
      });
      if (resp.code !== 200) {
        return;
      }
      //获取歌单，歌曲，MV
      if (this.type === 1) {
        this.songs = resp.result.songs;
        this.count = resp.result.songCount;
      } else if (this.type === 1000) {
        this.playlists = resp.result.playlists;
        this.count = resp.result.playlistCount;
      } else if (this.type === 1004) {
        this.mvs = resp.result.mvs;
        this.count = resp.result.mvCount;
      }
      this.total = this.count;
      rLoading.close()
    },
    playMusic(id){
    this.$store.dispatch('getMusUrl',id)
    },
    toPlaylist(id) {
      this.$router.push(`/playlist?id=${id}`);
    },

    toMv(id) {
      this.$router.push(`/playmv?id=${id}`);
    }
  }
};
</script>

<style lang="less" scoped>
.result-container .title-wrap {
  display: flex;
  align-items: flex-end;
  margin-bottom: 30px;
}

.result-container .title-wrap .title {
  margin-right: 10px;
}

.result-container .title-wrap .sub-title {
  font-size: 15px;
  color: #bebebe;
}

.result-container .el-tabs__item {
  font-size: 18px;
}

.result-container .el-table td,
.result-container .el-table th.is-leaf {
  border-bottom: none;
}

.result-container .items {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.result-container .items .item {
  width: 200px;
  cursor: pointer;
  margin-right: 20px;
  margin-bottom: 20px;
}

.result-container .items .item .img-wrap {
  width: 100%;
  position: relative;
}

.result-container .items .item .img-wrap > .icon-play {
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

.result-container .items .item .img-wrap > .icon-play::before {
  transform: translateX(3px);
}

.result-container .items .item .img-wrap:hover > .icon-play {
  opacity: 1;
}

.result-container .items .item .img-wrap img {
  width: 100%;
  border-radius: 5px;
}

.result-container .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  font-size: 15px;
  padding-right: 5px;
  padding-top: 2px;
}

.result-container .items .item .img-wrap .num-wrap .icon-play {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.result-container .items .item .img-wrap .time {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: white;
  font-size: 15px;
}

.result-container .items .item .name {
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.result-container .items .item .singer {
  font-size: 14px;
  color: #c5c5c5;
}

.result-container .items.mv .item {
  width: 250px;
}
.height{
  height: 50px;
}
</style>
