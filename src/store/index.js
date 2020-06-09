import Vue from 'vue'
import Vuex from 'vuex'
import { getMusicUrl, getSong } from '@/api/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mvUrl: '',
    //正在播放列表
    playlist: [
      {
        name: "默认",
        id: '123456',
        img: "",
        url: "",
        arName: "",
        dt: ''
      }
    ],
    // 播放历史列表
    historyList: [],
    // 搜索历史列表
    searchHistoryList: [],
    // 播放歌曲下标
    index: 0,
    //播放状态
    paused: true
  },
  getters: {
    // index: (state) => {
    //   return state.index
    // },
    // paused: (state) => {
    //   return state.paused
    // },
    // historyList: (state) => {
    //   return state.historyList
    // },
  },
  mutations: {
    musicList(state, payload) {
      // 判断列表中是否已经存在该歌曲
      if (state.playlist.find(item => item.id == payload.id)) {
        return
      } else {
        state.playlist.unshift(payload)
      }
    },
    mvUrl(state, payload) {
      state.mvUrl = payload
    },
    // 上一首
    min(state) {
      if (state.index == 0) {
        state.index = state.playlist.length - 1
      } else {
        state.index--;
      }
    },
    //下一首
    add(state) {
      if (state.index == state.playlist.length - 1) {
        state.index = 0
      } else {
        state.index++;
      }
    },
    // 播放播放列表中歌曲
    play(state, payload) {
      state.index = payload
    },
    // 播放历史播放列表中歌曲并加入到当前播放
    playHistory(state, payload) {
      // 判断是已经否存在
      if (state.playlist.find(item => item.id == payload.id)) {
        let song = state.playlist.find(item => item.id == payload.id)
        let index = state.playlist.findIndex(song)
        state.index = index
      } else {
        state.playlist.unshift(state.historyList[payload.index])
        state.index = 0
      }
    },
    paused(state, payload) {
      state.paused = payload
    },
    clearList(state) {
      //清空播放列表
      state.playlist = state.playlist.splice(0, 1)
    },
    clear(state, payload) {
      state.playlist.splice(payload, 1)
    },
    clearHistoryItem(state, payload) {
      let history = JSON.parse(localStorage.getItem("play_history"));
      history.splice(payload, 1)
      localStorage.setItem("play_history", JSON.stringify(history));
      state.historyList = JSON.parse(localStorage.getItem("play_history"));
    },
    clearHistoryList(state) {
      localStorage.removeItem("play_history");
      state.historyList = JSON.parse(localStorage.getItem("play_history"));
    },
    // 搜索历史
    searchHistoryList(state, payload) {
      let searchsongs = {
        name: payload.name
      }
      let history = localStorage.getItem("search_history");
      if (history) {
        history = JSON.parse(history);
        if (history.length >= 5) {
          history.splice(4, history.length - 4);
        }
      } else {
        history = [];
      }
      // 判断是否已经存在
      if (history.find(item => item.name == payload.name)) {
        return
      } else {
        history.push(searchsongs)
        localStorage.setItem("search_history", JSON.stringify(history));
        state.searchHistoryList = JSON.parse(localStorage.getItem("search_history"));
      }
    },
    clearSearchList(state) {
      //清空播放历史记录
      localStorage.removeItem("search_history");
      state.historyList = JSON.parse(localStorage.getItem("search_history"));
    },
     clearSearchItem(state, payload) {
      let history = JSON.parse(localStorage.getItem("search_history"));
      history.splice(payload, 1)
      localStorage.setItem("search_history", JSON.stringify(history));
      state.historyList = JSON.parse(localStorage.getItem("search_history"));
    },
    // 初始化
    init(state) {
      state.searchHistoryList = JSON.parse(localStorage.getItem("search_history"));
      state.historyList = JSON.parse(localStorage.getItem("play_history"));
    }
  },
  actions: {
    //每播放一首歌
    async getMusUrl({ commit, state }, payload) {
      // 获取歌曲播放地址
      const { data: resp } = await getMusicUrl(payload)
      if (!resp.data[0].url) {
        return this.$message.error('该资源为VIP专享，暂不支持播放 ！')
      }
      //获取歌曲详情
      const { data: resp1 } = await getSong(payload)
      const songs = {
        name: resp1.songs[0].name,
        id: resp1.songs[0].id,
        img: resp1.songs[0].al.picUrl,
        url: resp.data[0].url,
        arName: resp1.songs[0].ar[0].name,
        dt: resp1.songs[0].dt
      }
      //加入列表
      commit('musicList', songs)
      let history = localStorage.getItem("play_history");
      if (history) {
        history = JSON.parse(history);
        if (history.length >= 9) {
          history.splice(8, history.length - 8);
        }
      } else {
        history = [];
      }
      // 判断是否已经存在该首歌
      if (history.find(item => item.id == payload)) {
        return
      } else {
        history.push(songs)
        localStorage.setItem("play_history", JSON.stringify(history));
        state.historyList = JSON.parse(localStorage.getItem("play_history"));
      }
      state.index = 0
    }
  },
  modules: {
  }
})
