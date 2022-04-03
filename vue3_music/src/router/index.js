import { createRouter, createWebHistory } from 'vue-router'

const Recommend = () => import('@/views/Recommend')
const Singer = () => import('@/views/Singer')
const TopList = () => import('@/views/TopList')
const Search = () => import('@/views/Search')
const SingerDetail = () => import('@/views/SingerDetail')
const AlbumDetail = () => import('@/views/AlbumDetail')
const TopDetail = () => import('@/views/TopDetail')
const UserCenter = () => import('@/views/UserCenter')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: AlbumDetail
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/user',
    component: UserCenter
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
