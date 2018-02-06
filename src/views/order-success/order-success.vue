<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Order Success</span>
    </nav-bread>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <Progress :progressList='progressList' :curLen='curLen' />

      <div class="order-create">
        <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>Congratulations! <br>Your order is under processing!</h3>
          <p>
            <span>Order ID：{{orderId}}</span>
            <span>Order total：{{orderTotal | currency('￥')}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">Cart List</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/goodlist">Goods List</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '@/components/header/header'
import NavFooter from '@/components/footer/footer'
import NavBread from '@/components/nav-bread/nav-bread'
import {getOrderDetail} from '@/api/address'
import {ERR_OK} from '@/api/config'
import Progress from '@/components/progress/progress'
export default {
  data () {
    return {
      orderId: '',
      orderTotal: 0,
      progressList: [
        '<span>Confirm</span> address',
        '<span>View your</span> order',
        '<span>Make</span> payment',
        '<span>Order</span> confirmation'
      ],
      curLen: 3
    }
  },
  created () {
    this._getOrderDetail()
  },
  methods: {
    _getOrderDetail () {
      var orderId = this.$route.query.orderId
      // console.log("orderId:"+orderId)
      if (!orderId) {
        return
      }
      getOrderDetail(orderId).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.orderId = orderId
          this.orderTotal = res.result.orderTotal
        }
      })
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Progress
  }
}
</script>

<style scoped>

</style>
