<template>
  <div class="index-container">
    <Header />
    <!-- 侧边栏导航区域 -->
    <div class="nav">
      <ul>
        <li>
          <router-link to="/discovery">
            <span class="iconfont icon-find-music"></span>
            发现音乐
          </router-link>
        </li>
        <li>
          <router-link to="/playlists">
            <span class="iconfont icon-music-list"></span>
            推荐歌单
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span class="iconfont icon-music"></span>
            最新音乐
          </router-link>
        </li>
        <li>
          <router-link to="/mvs">
            <span class="iconfont icon-mv"></span>
            最新MV
          </router-link>
        </li>
      </ul>
      <h2 v-if="isPlay">歌词</h2>
    </div>
    <!-- 主体 -->
    <div class="main">
      <router-view></router-view>
    </div>
    <!-- 播放列表 -->
    <div class="list" v-show="list">
      <ul>
        <li class="clearList" @click="clearList">清空列表</li>
        <li v-for="(item,index) in lists" :key="index" @click="play(index)">
          <span>{{item.name}}</span>
          <span>{{item.arName}}</span>
          <span></span>
        </li>
      </ul>
    </div>
    <!-- 控制器 没有合适好看图标，暂时先用图片-->
    <div class="playerContel">
      <span @click="setSong" class="img">
        <img :src="img" alt />
      </span>
      <span @click="min">
        <img src="../assets/image/prev.png" alt />
      </span>
      <span class="play" @click="goPlay">
        <img v-if="iconsrc" src="../assets/image/paused.png" alt />
        <img v-else src="../assets/image/play.png" alt />
      </span>
      <span @click="add">
        <img src="../assets/image/next.png" alt />
      </span>
      <span @click="listShow">
        <img src="../assets/image/menu.png" alt />
      </span>
      <span @click="selectLoop" class="loop">
        <img v-if="isLoop" src="../assets/image/one.png" alt />
        <img v-else src="../assets/image/sun.png" alt />
      </span>
    </div>
    <div class="player">
      <audio
        @timeupdate="updateTime"
        @ended="end"
        ref="audio"
        :src="musicUrl"
        :autoplay="autoplay"
        controls
        :loop="loop"
        id="music"
      ></audio>
    </div>
    <!-- 歌词 -->
    <div class="songWord" v-show="isPlay">
      <img src="../assets/image/bottom.png" @click="songWordHidden" class="songWordHidden" alt />
      <!-- 旋转动画 -->
      <div class="animation">
        <img src="../assets/image/default.png" alt />
        <img :src="img" alt class="animationImg" :class="isgoplay?'goplay':''" />
      </div>
      <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
        <div class="lyric-wrapper">
          <div v-if="currentLyric">
            <p
              ref="lyricLine"
              class="text"
              :class="{'current': currentLineNum === index}"
              v-for="(line, index) in currentLyric.lines"
              :key="line.time+index"
            >{{line.txt}}</p>
          </div>
        </div>
      </Scroll>
    </div>
  </div>
</template>
<script>
import Header from "./common/Header";
import { getSongC } from "@/api/api";
import Lyric from "lyric-parser";
import Scroll from "./common/Scorll";
// const Scroll = () => import("./common/Scorll");
export default {
  data() {
    return {
      inputValue: "",
      list: false,
      currentTime: 0,
      tlyric: [],
      currentLyric: null,
      currentLineNum: 0,
      isPlay: false,
      autoplay: false,
      paused: this.$store.state.paused,
      iconsrc: true,
      // 控制单曲循环
      loop: true,
      isLoop: false,
      //动画滚动
      isgoplay: false
    };
  },
  computed: {
    musicUrl() {
      return this.$store.state.playlist[this.$store.getters.index].url;
    },
    id() {
      return this.$store.state.playlist[this.$store.getters.index].id;
    },
    lists() {
      return this.$store.state.playlist;
    },
    img() {
      return this.$store.state.playlist[this.$store.getters.index].img;
    }
  },
  components: {
    Header,
    Scroll
  },
  watch: {
    paused(val) {
      getSongC(this.id).then(res => {
        this.autoplay = true;
        this.tlyric = res.data.lrc.lyric;
        let lyric = this.tlyric; //歌词数据
        this.currentLyric = new Lyric(lyric, this.handleLyric);
      });
      if (val) {
        this.currentLyric.stop();
      } else {
        if (this.currentLyric) {
          this.currentLyric.togglePlay();
        }
      }
    }
  },
  methods: {
    //获取歌词
    getSongs() {
      getSongC(this.id).then(res => {
        this.tlyric = res.data.lrc.lyric;
        let lyric = this.tlyric;
        this.currentLyric = new Lyric(lyric, this.handleLyric);
        this.currentLyric.togglePlay();
      });
    },
    // 播放时间改变
    updateTime(e) {
      this.currentTime = e.target.currentTime;
      this.$store.commit("paused", this.$refs.audio.paused);
      // 进度条拖动
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    // 播放暂停
    goPlay() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
        this.iconsrc = false;
        this.paused = false;
        this.isgoplay = true;
      } else {
        this.$refs.audio.pause();
        this.paused = true;
        this.iconsrc = true;
        this.isgoplay = false;
      }
    },
    //清空列表
    clearList() {
      this.$store.commit("clearList");
    },
    //展示歌词
    setSong() {
      this.isPlay = !this.isPlay;
    },
    //收起歌词
    songWordHidden() {
      this.isPlay = false;
    },
    // 播放结束
    end() {
      if (!this.loop) {
        this.$store.commit("add");
        this.currentLyric = null;
        this.getSongs();
      }
    },
    // 播放列表歌曲
    play(index) {
      this.$store.commit("play", index);
      this.getSongs();
    },
    // 上一首
    min() {
      this.$store.commit("min");
      //重新获取新歌词
      this.getSongs();
    },
    add() {
      this.$store.commit("add");
      this.getSongs();
    },
    // 歌词滚动
    handleLyric({ lineNum }) {
      this.currentLineNum = lineNum;
      if (lineNum > 3) {
        let lineEl = this.$refs.lyricLine[lineNum - 3];
        this.$refs.lyricList.scrollToElement(lineEl, 500); // 滚动到元素
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000); // 滚动到顶部
      }
    },
    // 展示播放列表
    listShow() {
      this.list = !this.list;
    },
    //切换模式
    selectLoop() {
      if (this.isLoop) {
        this.isLoop = false;
        this.loop = false;
      } else {
        this.isLoop = true;
        this.loop = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
.current {
  font-weight: 800;
  font-size: 21px;
}
.songWordHidden {
  position: absolute;
  left: 130px;
}
.animation {
  position: absolute;
  height: 300px;
  width: 300px;
  left: 200px;
  top: 75px;
  border-radius: 50%;
  overflow: hidden;
  .animationImg {
    height: 200px;
    width: 200px;
    position: absolute;
    left: 18%;
    border-radius: 50%;
    top: 17%;
    overflow: hidden;
  }
  .goplay {
    animation: rotate 6.5s infinite linear;
  }
}
.playerContel {
  position: fixed;
  bottom: 48px;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40px;
  background-color: #ffffff;
  span {
    display: inline-block;
    flex: 1;
  }
  .play {
    width: 97px;
    height: 60px;
    transform: translateY(15px);
  }
  .loop {
    width: 30px;
    height: 30px;
    transform: translateY(-5px);
    img {
      background-size: 100%;
    }
  }
}
.list {
  position: fixed;
  cursor: pointer;
  right: 30px;
  top: 102px;
  width: 300px;
  height: 700px;
  background-color: white;
  box-shadow: -3px -3px #ddd;
  overflow: hidden;
  text-align: left;
  color: #000;
  ul {
    width: 317px;
    height: 700px;
    overflow-y: scroll;
    li {
      border-bottom: 1px solid rgb(131, 153, 194);
      padding-top: 15px;
      margin-left: 20px;
      span {
        margin-left: 20px;
      }
    }
  }
  .clearList {
    position: absolute;
    right: 20px;
  }
}
.middle-r {
  position: absolute;
  height: 380px;
  width: 340px;
  font-size: 18px;
  z-index: 99;
  overflow: hidden;
  // color: white;
  right: 300px;
  top: 75px;
}
.songWord {
  width: 100vw;
  height: 78vh;
  position: fixed;
  background-color: whitesmoke;
  z-index: 1000;
}
.index-container {
  display: flex;
  .nav {
    background-color: #ededed;
    width: 200px;
    height: 100%;
    h2 {
      color: white;
    }
    li {
      height: 60px;
      cursor: pointer;
      display: flex;
      align-items: center;
      a {
        color: black;
        font-size: 18px;
        line-height: 60px;
        width: 100%;
        height: 100%;
      }
      .iconfont {
        margin-right: 10px;
        font-size: 20px;
      }
    }
    &:hover {
      background-color: #e7e7e7;
    }
  }
}
.index-container .nav li .index-container .nav li a.router-link-active {
  color: #dd6d60;
}

.index-container .nav li a.router-link-active .iconfont {
  color: #dd6d60;
}

.index-container .main {
  flex: 1;
  overflow-y: scroll;
  padding: 10px 20px;
}

.index-container .main > div {
  max-width: 1100px;
  margin: 0 auto;
}

.index-container .player {
  background: #f1f3f4;
  height: 60px;
  position: fixed;
  bottom: -12px;
  left: -38px;
  width: 100%;
}
.img img {
  width: 60px;
  height: 55px;
  filter: blur(0.5px);
  background-size: 100%;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  top: 10px;
}
.img img:hover {
  filter: blur(0px);
}

.index-container audio {
  width: 100%;
  border-radius: none;
  outline: none;
}
</style>