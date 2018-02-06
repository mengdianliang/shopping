import axios from 'axios'

export function userLogin (...args) {
  const url = '/api/users/login'
  const data = args[0]
  return axios.post(url, data).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function userLogOut () {
  const url = '/api/users/logout'

  return axios.post(url).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function checkLogin () {
  const url = '/api/users/checkLogin'

  return axios.get(url).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function getCartCount () {
  const url = '/api/users/getCartCount'

  return axios.get(url).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function getCartList () {
  const url = '/api/users/cartList'

  return axios.get(url).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function delCartItem (delItem) {
  const url = '/api/users/cartDel'
  return axios.post(url, {
    productId: delItem.productId
  }).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function editCartItem (item) {
  const url = '/api/users/cartEdit'
  const data = {
    productId: item.productId,
    productNum: item.productNum,
    checked: item.checked
  }
  return axios.post(url, data).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}

export function checkAll (flag) {
  const url = '/api/users/editCheckAll'
  const data = {
    checkAll: flag
  }
  return axios.post(url, data).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  }).catch(function (err) {
    console.log(err)
  })
}
