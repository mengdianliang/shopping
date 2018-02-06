import axios from 'axios'

export function getAddressList () {
  const url = '/api/users/addressList'
  return axios.get(url).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function setDefault (item) {
  const url = '/api/users/setDefault'
  const data = {
    addressId: item.addressId
  }
  return axios.post(url, data).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function delAddress (addressId) {
  const url = '/api/users/delAddress'
  const data = {
    addressId: addressId
  }
  return axios.post(url, data).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function addAddress (...args) {
  const url = '/api/users/addAddress'
  const data = args[0]
  return axios.post(url, data).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function payMent (...args) {
  const url = '/api/users/payMent'
  const data = args[0]
  return axios.post(url, data).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function getOrderDetail (orderId) {
  const url = '/api/users/orderDetail'
  const data = {
    orderId: orderId
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}
