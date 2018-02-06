import Vue from 'vue'
import Router from 'vue-router'
import Goodlist from '@/views/goodlist/goodlist'
import Cart from '@/views/cart/cart'
import Address from '@/views/address/address'
import OrderConfirm from '@/views/order-confirm/order-confirm'
import OrderSuccess from '@/views/order-success/order-success'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/goodlist'
    },
    {
      path: '/goodlist',
      component: Goodlist
    },
    {
      path: '/cart',
      component: Cart
    },
    {
      path: '/address',
      component: Address
    },
    {
      path: '/orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      component: OrderSuccess
    }
  ]
})
