import Vue from 'vue'
import Vuex from 'vuex'
import { getMusicUrl, getSong } from '@/api/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mvUrl: '',
    //播放列表,默认添加一首
    playlist: [
      {
        name: "",
        id: 1440079854,
        img: "https://p2.music.126.net/SCSx49IzYiQ0hSTqzw5nXg==/109951163097291709.jpg",
        url: "http://m8.music.126.net/20200423004233/5fd6e52e69ae8acecb102ffe8fa45c8e/ymusic/c87e/3e14/2f2b/b62daaeec9432820d3c61bec0f57b8f0.mp3",
        arName: "",
        dt: 280896
      }
    ],
    // 播放歌曲下标
    index: 0,
    //播放状态
    paused: true
  },
  getters: {
    index: (state) => {
      return state.index
    },
    paused: (state) => {
      return state.paused
    }
  },
  mutations: {
    musicList(state, payload) {
      state.musicUrl = payload.url
      state.playlist.push(payload)
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
        state.index = 1
      } else {
        state.index++;
      }
    },
    play(state, payload) {
      state.index = payload
    },
    paused(state, payload) {
      state.paused = payload
    },
    clearList(state) {
      //清空播放列表，保留初始默认一首
      state.playlist = state.playlist.splice(0, 1)
    }
  },
  actions: {
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
      commit('musicList', songs)
      state.index = state.playlist.length - 1
    }
  },
  modules: {
  }
})
