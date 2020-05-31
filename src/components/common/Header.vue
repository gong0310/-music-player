<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <span class="iconfont icon-home" @click="toHomeClick()"></span>
        <span class="iconfont icon-min-screen" @click="getFullCreeen()"></span>
        <span class="iconfont icon-full-screen" @click="getFullCreeen()"></span>
      </div>
      <div class="history-wrapper">
        <span class="iconfont icon-arrow-lift" @click="back"></span>
        <span class="iconfont icon-arrow-right" @click="go"></span>
      </div>
    </div>
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <input
          type="text"
          autocomplete="off"
          placeholder="搜索"
          v-model.trim="inputVal"
          @keyup.enter="toSearch"
          class="el-input__inner"
        />
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
      <!-- 搜索自动推荐 -->
      <div class="box-card" v-show="recommend">
        <h3>搜索推荐</h3>
        <el-card>
          <div
            v-for="item in suggestSongs"
            :key="item.id"
            @click="goSearch(item.name)"
          >{{item.name}}</div>
        </el-card>
        <HistoryList/>
        <Theme />
      </div>
    </div>
  </div>
</template>

<script>
import { suggest } from "@/api/api";
import HistoryList from "./SearchHitory";
import Theme from "@/components/theme"
export default {
  name: "top",
  data() {
    return {
      query: "",
      inputVal: "",
      n: 0,
      btnStatus: 0,
      fullscreen: false,
      recommend: false,
      suggestSongs: []
    };
  },
  components: {
    HistoryList,
    Theme
  },
  watch: {
    async inputVal(val) {
      if (val) {
        this.recommend = true;
        const { data: res } = await suggest(val);
        this.suggestSongs = res.result.songs;
      } else {
        this.recommend = false;
      }
    }
  },
  mounted() {
    this.$store.commit("init");
  },
  methods: {
    // 直接搜索
    toSearch() {
      if (this.inputVal) {
        this.$router.push({
          path: "/searchResult",
          query: { inputVal: this.inputVal }
        });
        this.$store.commit("searchHistoryList", {
          name: this.inputVal
        });
      } else {
        this.$message("请输入搜索项");
      }
    },
    //回到主页
    toHomeClick() {
      if ("/discovery" === this.$route.path) {
        return;
      }
      this.$router.push(`/discovery`);
    },
    //搜索推荐
    goSearch(val) {
      this.$router.push({
        path: "/searchResult",
        query: { inputVal: val }
      });
      this.suggestSongs = [];
      this.$store.commit("searchHistoryList", {
          name:val
        });
    },
    go() {
      this.$router.go(1);
    },
    back() {
      this.$router.go(-1);
    },
    //  点击实现全屏和退出全屏,(兼容)
    getFullCreeen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  }
};
</script>

<style scoped>
.top-container {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #f9f9f9;
  width: 100%;
}

.top-container .left-box {
  display: flex;
}

.top-container .left-box .icon-wrapper {
  margin-right: 40px;
}

.top-container .left-box .icon-wrapper .iconfont {
  margin-right: 10px;
  font-size: 12px;
  width: 18px;
  height: 18px;
  display: inline-block;
  text-align: center;
  line-height: 18px;
  margin-top: 18px;
}

.top-container .left-box .icon-wrapper .iconfont::before {
  opacity: 0;
  transition: 0.2s;
}

.top-container .left-box .icon-wrapper .iconfont:hover::before {
  opacity: 1;
}

.top-container .left-box .icon-wrapper .iconfont.icon-home {
  background-color: #dd6d60;
  border-radius: 50%;
}

.top-container .left-box .icon-wrapper .iconfont.icon-sami-select {
  background-color: #dcc060;
  border-radius: 50%;
}

.top-container .left-box .icon-wrapper .iconfont.icon-full-screen {
  background-color: #84bb58;
  border-radius: 50%;
}

.top-container .left-box .history-wrapper {
  display: flex;
  align-items: center;
}

.top-container .left-box .history-wrapper .iconfont {
  width: 35px;
  height: 35px;
  font-size: 30px;
  text-align: center;
  line-height: 35px;
  color: gray;
  border-radius: 50%;
  transition: 0.2s;
  cursor: pointer;
}
.top-container .left-box .history-wrapper .iconfont:hover {
  background-color: #ebebeb;
}

.top-container .right-box {
  display: flex;
  align-items: center;
  position: relative;
}
.top-container .right-box .box-card {
  font-size: 14px;
  position: absolute;
  width: 100%;
  top: 45px;
  cursor: pointer;
}
h3{
    text-align:left;
  }
.top-container .right-box .box-card div {
  margin-top: 8px;
  text-align: left;
  border-bottom: 1px solid rgb(131, 153, 194);
}
</style>
