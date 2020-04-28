<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item" :class="{ active: tag === 0 }" @click="tag = 0">全部</span>
      <span class="item" :class="{ active: tag === 7 }" @click="tag = 7">华语</span>
      <span class="item" :class="{ active: tag === 96 }" @click="tag = 96">欧美</span>
      <span class="item" :class="{ active: tag === 8 }" @click="tag = 8">日本</span>
      <span class="item" :class="{ active: tag === 16 }" @click="tag = 16">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr class="el-table__row" v-for="(item, index) in songs" :key="index" @click="playMusic(item.id)">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.picUrl+'?param=130y130'" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ item.name }}</span>
                <span class="iconfont icon-mv"></span>
              </div>
            </div>
          </td>
          <td>{{ item.album.artists[0].name }}</td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration | playTimeFormat }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getNewSongs } from '@/api/api'

export default {
  name: 'songs',
  data() {
    return {
      songs: [],
      // 控制类型音乐
      tag: 0
    }
  },

  created() {
    this._getNewSongs()
  },

  watch: {
    tag() {
      this._getNewSongs()
    }
  },
  methods: {
    // 获取最新音乐
    async _getNewSongs() {
      const rLoading = this.openLoading();
      const { data: resp } = await getNewSongs(this.tag)
      this.songs = resp.data.slice(0, 50)
      rLoading.close();
    },
    playMusic(id){
    this.$store.dispatch('getMusUrl',id)
    }
  }
}
</script>

<style lang="less" scoped>
.songs-container .tab-bar {
  display: flex;
  justify-content: flex-end;
}

.songs-container .tab-bar .item {
  font-size: 15px;
  color: gray;
  margin-right: 20px;
  cursor: pointer;
}

.songs-container .tab-bar .item.active {
  color: #dd6d60;
}

.songs-container .song-table .song-wrap > span {
  margin-top: 20px;
  display: inline-block;
  color: #bebebe;
}

.songs-container .song-table .song-wrap .icon-mv {
  padding-left: 5px;
  color: #dd6d60;
}

.songs-container .song-table .img-wrap {
  position: relative;
  width: 70px;
  height: 70px;
}

.songs-container .song-table .img-wrap img {
  width: 70px;
  height: 70px;
  border-radius: 5px;
}

.songs-container .song-table .img-wrap .icon-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25px;
  height: 25px;
  color: #dd6d60;
  font-size: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
}

.songs-container .song-table .img-wrap .icon-play::before {
  transform: translateX(1px);
}

</style>
