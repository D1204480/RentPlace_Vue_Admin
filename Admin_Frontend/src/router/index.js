import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OrderView from '../views/OrderView.vue'
import CrmView from '../views/CrmView.vue'
import VenueView from '../views/VenueView.vue'
import VenueForm from '../views/VenueFormView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView
    },
    {
      path: '/crm',
      name: 'crm',
      component: CrmView
    },
    {
      path: '/venues',
      name: 'venues',
      component: VenueView,
      meta: {
        title: '場地管理'
      }
    },
    {
      path: '/venues/create',
      name: 'VenueCreate',
      component: VenueForm,
      meta: {
        title: '新增場地'
      }
    },
    {
      path: '/venues/:id/edit',
      name: 'VenueEdit',
      component: VenueForm,
      props: true,
      meta: {
        title: '編輯場地'
      }
    }
  ]
})

// 路由標題
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '場地管理系統'
  next()
})

export default router
