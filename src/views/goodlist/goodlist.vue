<template>
  <div id="goodlist">
    <nav-header />
    <nav-bread>
      <span>goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" :class="{'sort-up':sortFlag}" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{cur: curRange === 'all'}" @click="checkRange('all')">All</a></dd>
              <dd v-for="(price, index) in priceFilter" :key="`price${index}`">
                <a href="javascript:void(0)" :class="{cur: curRange === `price${index}`}" @click="checkRange(`price${index}`)">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul v-if="goodsList.length">
                <li v-for="item in goodsList" :key="item.productId" data-id="item.productId">
                  <div class="pic">
                    <a href="#"><img v-lazy="`/static/${item.productImage}`" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice | currency('￥')}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="20">
                <img src="./../../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :mdShow="mdShow" @close="closeModal">
      <p slot="message">
        请先登录,否则无法加入到购物车中!
      </p>
      <div slot="btnGroup" class="btn-group">
        <a class="btn btn--m" href="javascript:;" @click="modelDisplay('mdShow', false)">关闭</a>
      </div>
    </modal>
    <modal :mdShow="mdShowCart" @close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功!</span>
      </p>
      <div slot="btnGroup" class="btn-group">
        <a class="btn btn--m" href="javascript:;" @click="modelDisplay('mdShowCart', false)">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <div class="md-overlay" v-show="overlayFlag" @click="closePop"></div>
    <nav-footer />
  </div>
</template>

<script>
import NavHeader from '@/components/header/header'
import NavFooter from '@/components/footer/footer'
import NavBread from '@/components/nav-bread/nav-bread'
import Modal from '@/components/modal/modal'
import {getGoodList, addCartById} from '@/api/goodlist'
import {ERR_OK} from '@/api/config'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      goodsList: [],
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      loading: false,
      mdShow: false,
      mdShowCart: false,
      priceFilter: [
        {
          startPrice: '0.00',
          endPrice: '100.00'
        },
        {
          startPrice: '100.00',
          endPrice: '500.00'
        },
        {
          startPrice: '500.00',
          endPrice: '1000.00'
        },
        {
          startPrice: '1000.00',
          endPrice: '5000.00'
        }
      ],
      curRange: 'all',
      filterBy: false,
      overlayFlag: false
    }
  },
  computed: {
    ...mapState(['cartCount']),
    sort () {
      return this.sortFlag ? 1 : -1
    }
  },
  created () {
    this._getGoodlist()
  },
  methods: {
    _getGoodlist (flag) {
      this.loading = true
      getGoodList({
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sort,
        curRange: this.curRange
      }).then(res => {
        this.loading = false
        if (res.code === ERR_OK) {
          // console.log(res)
          if (flag) {
            this.goodsList = this.goodsList.concat(res.result.list)
            if (res.result.count === 0) {
              this.busy = true
            } else {
              this.busy = false
            }
          } else {
            this.goodsList = res.result.list
            this.busy = false
          }
          // console.log(this.goodsList)
        } else {
          this.goodsList = []
        }
      })
    },
    sortGoods () {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.pageSize = 8
      this._getGoodlist()
    },
    loadMore () {
      this.busy = true
      setTimeout(() => {
        this.page++
        this._getGoodlist(true)
      }, 500)
    },
    addCart (productId) {
      addCartById(productId).then(res => {
        // console.log(res)
        if (res.code === ERR_OK) {
          this.modelDisplay('mdShow', false)
          this.modelDisplay('mdShowCart', true)
          this.$store.commit('updateCartCount', this.cartCount + 1)
        } else if (res.code === 10001) {
          this.modelDisplay('mdShow', true)
          this.modelDisplay('mdShowCart', false)
        }
      })
    },
    closeModal () {
      this.modelDisplay('mdShow', false)
      this.modelDisplay('mdShowCart', false)
    },
    modelDisplay (item, flag) {
      if (item === 'mdShow') {
        this.mdShow = flag
      }
      if (item === 'mdShowCart') {
        this.mdShowCart = flag
      }
    },
    checkRange (range) {
      this.curRange = range
      this.page = 1
      this._getGoodlist()
    },
    showFilterPop () {
      this.show()
    },
    closePop () {
      this.hide()
    },
    hide () {
      this.filterBy = false
      this.overlayFlag = false
    },
    show () {
      this.filterBy = true
      this.overlayFlag = true
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  }
}
</script>

<style scoped>

</style>
