import axios from 'axios'
const BASEURL = 'http://106.52.251.50:9527'//本人搭建云服务器

// 获取推荐MV
export function getPersonalizedMv() {
  return axios({
    url: BASEURL + '/personalized/mv',
    method: 'get'
  })
}
// 获取轮播图数据
export function getBanner() {
  return axios({
    url: BASEURL + '/banner',
    method: 'get'
  })
}
// 获取推荐歌单
export function getPersonalizedPlaylist(limit) {
  return axios({
    url: BASEURL + '/personalized?limit=' + limit,
    method: 'get'
  })
}
// 获取推荐歌曲
export function getPersonalizedNewsong() {
  return axios({
    url: BASEURL + '/personalized/newsong',
    method: 'get'
  })
}
// 获取搜索页
export function search(name) {
  return axios({
    url: BASEURL + `/search/get?keywords=${name.s}&limit=${name.limit}&type=${name.type}&offset=${name.offset}`,
    method: 'get'
  })
}
//搜索建议
export function suggest(name) {
  return axios({
    url: BASEURL + `/search/suggest?keywords=${name}`,
    method: 'get'
  })
}
// 获取歌曲播放地址
export function getMusicUrl(id) {
  return axios({
    url: BASEURL + `/song/url?id=${id}&br=999000`,
    method: 'get'
  })
}
// 获取MV播放地址
export function getMvUrl(param) {
  return axios({
    url: BASEURL + `/mv/url?id=${param.id}&r=${param.r}`,
    method: 'get'
  })
}

// 获取MV详情
export function getMvDetail(id) {
  return axios({
    url: BASEURL + `/mv/detail?mvid=${id}`,
    method: 'get'
  })
}
// 获取MV评论
export function getMvComment(param) {
  return axios.get(BASEURL + `/comment/mv?id=${param.id}&limit=${param.limit}&offset=${param.offset}`)
}

// 获取相关MV
export function getSimiMvUrl(id) {
  return axios.get(BASEURL + `/simi/mv?mvid=${id}`)
}
// 获取歌单详情
export function getPlaylistDetail(id) {
  return axios.get(BASEURL + `/playlist/detail?id=${id}`)
}

// 获取歌单评论
export function getPlaylistComments(param) {
  return axios.get(BASEURL + `/comment/playlist?id=${param.id}&limit=${param.limit}&offset=${param.offset}`)
}
// 获取精品歌单
export function getTopPlaylist(param) {
  return axios.get(BASEURL + `/top/playlist/highquality?cat=${param.cat}&limit=${param.limit}`)
}

// 获取歌单列表
export function getPalylist(param) {
  return axios.get(BASEURL + `/top/playlist?cat=${param.cat}&limit=${param.limit}&total=${true}&offset=${param.offset}&order=${param.order}`)
}
// 获取最新音乐
export function getNewSongs(type) {
  return axios.get(BASEURL + `/top/song?type=${type}`)
}
// 获取Mv列表
export function getMvs(param) {
  return axios.get(BASEURL + `/mv/all?area=${param.area}&type=${param.type}&order=${param.order}&limit=${param.limit}&offset=${param.offset}`)
}
// 获取歌曲详情
export function getSong(id) {
  return axios.get(BASEURL + `/song/detail?ids=${id}`)
}
// 获取歌词
export function getSongC(id) {
  return axios.get(BASEURL + `/lyric?id=${id}`)
}

