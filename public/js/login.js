
// const 
const submit = document.getElementById('login-button')

submit.addEventListener('click', (e) =>{
  e.preventDefault()
  let a = getLoginInfo()
  logincheck()
})


import {fn} from "test";
//import { fn } from 'node-html-parser';
parse = require('test');
console.log(parse)


function getLoginInfo () {
  const form = document.getElementById('login')
  const id = form[0].value
  const password = form[1].value
  payload = {
    user_id: id,
    user_password: password
  }
  return payload
}

function logincheck () {
  const form = document.getElementById('login')
  const id = form[0].value
  const password = form[1].value
  axios.post('/api/login', {
    idnum: id,
    password: password
  })
    .then( (response) => {
      let token =response.data[0].token
      localStorage.setItem("token", JSON.stringify(token))
      getStoreInfo(token)
      setTimeout(checktoken(token),2000)
    })
    .catch( (err) => console.log(err))
}



// get user info 
function getStoreInfo(token) {
  axios.get(`/api/userInfo/${token}`)
    .then( (response) => {
      let store_id = response.data.store_id
      sale_list(store_id)
      productList(store_id)
    })
    .catch( (err) => console.log(err))
}

// check token 
function checktoken(token) {
  if (token.length !== 0) {
    alert('成功登入')
    window.location.href = '/' 
  }
}

// add sale list 
function sale_list(store) {
  let sale_list = []
  axios.get(`/api/getProductName/${store}`)
    .then((response) => {
      let datalist = response.data
      for (i = 0; i < datalist.length; i++) {
        let productItem = {
          product_id: datalist[i].product_id,
          category: datalist[i].category,
          p_name: datalist[i].name,
          sale_temp_count: 0,
          sale_sum: 0
        }
        sale_list.push(productItem)
        localStorage.setItem("saleList", JSON.stringify(sale_list))
      }
    })
    .catch((err) => console.log(err))
}

function productList(store) {
  let item_list = []
  axios.get('/api/product')
    .then((response) => {
      let datalist = response.data
      datalist = datalist.filter(item => item.store_id === parseInt(store))
      localStorage.setItem("productList", JSON.stringify(datalist)) 
    })
}



// add work shift list ???