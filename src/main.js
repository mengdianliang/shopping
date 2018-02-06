import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from '@/util/currency'
import {checkLogin, getCartCount} from '@/api/user'
import {ERR_OK} from '@/api/config'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueLazyLoad, {
  loading: '/static/loading-svg/loading-bars.svg'
})
Vue.use(infiniteScroll)
Vue.filter('currency', currency)

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    // 更新用户信息
    updateUserInfo (state, nickName) {
      state.nickName = nickName
    },
    // 改变购物车的数量
    updateCartCount (state, cartCount) {
      state.cartCount = cartCount
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    this._checkLogin()
    this._getCartCount()
  },
  methods: {
    _checkLogin () {
      checkLogin().then(res => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.$store.commit('updateUserInfo', res.result.userName)
        } else {
          if (this.$route.path !== '/goodlist') {
            this.$router.push('/goodlist')
          }
        }
      })
    },
    _getCartCount () {
      getCartCount().then(res => {
        if (res.code === ERR_OK) {
          this.$store.commit('updateCartCount', res.result)
        }
      })
    }
  }
})
