import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/discovery',
    children: [
      {
        path: '/discovery',
        name: 'Discovery',
        component: () => import(/* webpackChunkName: "Discovery" */ '../components/Discovery.vue')
      },
      {
        path: '/playlists',
        name: 'Playlists',
        component: () => import(/* webpackChunkName: "Discovery" */ '../components/Playlists.vue')
      },
      {
        path: '/songs',
        name: 'Songs',
        component: () => import(/* webpackChunkName: "Discovery" */ '../components/Songs.vue')
      },
      {
        path: '/mvs',
        name: 'Mvs',
        component: () => import(/* webpackChunkName: "Discovery" */ '../components/Mvs.vue')
      },
      {
        path: '/searchResult',
        name: 'SearchResult',
        component: () => import(/* webpackChunkName: "Discovery" */ '../components/common/SearchResult.vue')
      },
      {
        path: '/playmv',
        name: 'Playmv',
        component: () => import(/* webpackChunkName: "Discovery" */ '../components/common/Playmv.vue')
      },
      {
        path: '/playlist',
        name: 'Playlist',
        component: () => import(/* webpackChunkName: "Discovery" */ '../components/common/Playlist.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode:"hash",
  routes
})

export default router
