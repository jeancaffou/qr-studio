const routes = [
  {
    path: '/',
    component: () => import('../pages/IndexPage.vue')
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/'
  }
]

export default routes
