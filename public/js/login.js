// const 
const submit = document.getElementById('login-button')

submit.addEventListener('click', (e) => {
  e.preventDefault()
  let a = getLoginInfo()
  logincheck()
})





function getLoginInfo() {
  const form = document.getElementById('login')
  const id = form[0].value
  const password = form[1].value
  payload = {
    user_id: id,
    user_password: password
  }
  return payload
}

function logincheck() {
  const form = document.getElementById('login')
  const id = form[0].value
  const password = form[1].value
  axios.post('/api/login', {
    idnum: id,
    password: password
  })
    .then((response) => {
      let token = response.data[0].token
      localStorage.setItem("token", JSON.stringify(token))
      getStoreInfo(token)
      checktoken(token)
    })
    .catch((err) => console.log(err))
}



// get user info 
function getStoreInfo(token) {
  axios.get(`/api/userInfo/${token}`)
    .then((response) => {
      let store_id = response.data.store_id
      sale_list(store_id)
      productList(store_id)
      getcheckinClass(store_id)
      sale_value()
    })
    .catch((err) => console.log(err))
}

// check token 
function checktoken(token) {
  if (token.length !== 0) {
    alert('成功登入')
    window.setTimeout(e => window.location.href = '/home', 1500)
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
          price: datalist[i].price,
          stock: datalist[i].stock,
          inbound_unit_count: datalist[i].inbound_unit_count,
          nut_package: null,
          work_pcs: null,
          inbound: 0,
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

// get checkin & workshift
function getcheckinClass(store_id) {
  axios.get(`/api/getCurrentWorkShiftId/${store_id}`)
    .then((response) => {
      let data = response.data
      let className = data[0].class
      let shiftID = data[0].shift_id
      console.log(className, shiftID)
      localStorage.setItem('class', className)
      localStorage.setItem('workshiftId', shiftID)
    })
}

// make sale value
function sale_value() {
  const saleValue = JSON.parse(localStorage.getItem('saleValue'))
  const saleList = JSON.parse(localStorage.getItem('saleList'))
  if (!saleValue) {
    const cost = {
      store_id: parseInt(localStorage.getItem('store_id')),
      class: localStorage.getItem('class'),
      user_id: parseInt(localStorage.getItem('user_id')),
      user: localStorage.getItem('Name'),
      operator: '',
      successor: '',
      handover_amount: 0, // 交班金額
      shortage_amount: 0, // 短溢金額
      total_sales: 0, // 總銷售額
      betelnut_sales: 0, // 檳榔
      drinks_sales: 0, // 飲料      
      cigarette_sales: 0, // 香菸
      other_sales: 0,
      shift_id: localStorage.getItem('workshiftId')
    }
    localStorage.setItem('saleValue', JSON.stringify(cost))
  } else {
    saleList.forEach(item => {
      let clas = item.category
      if (clas == "檳榔") {
        saleValue.betelnut_sales += item.price * item.sale_sum
        saleValue.total_sales += item.price * item.sale_sum
        saleValue.shortage_amount = saleValue.total_sales - saleValue.handover_amount
        localStorage.setItem('saleValue', JSON.stringify(saleValue))
      } else if (clas == "香菸") {
        saleValue.cigarette_sales += item.price * item.sale_sum
        saleValue.total_sales += item.price * item.sale_sum
        saleValue.shortage_amount = saleValue.total_sales - saleValue.handover_amount
        localStorage.setItem('saleValue', JSON.stringify(saleValue))
      } else if (clas == "飲料") {
        saleValue.drinks_sales += item.price * item.sale_sum
        saleValue.total_sales += item.price * item.sale_sum
        saleValue.shortage_amount = saleValue.total_sales - saleValue.handover_amount
        localStorage.setItem('saleValue', JSON.stringify(saleValue))
      } else if (clas == "檳榔原料") {

      } else if (clas == "百貨") {
        saleValue.other_sales += item.price * item.sale_sum
        saleValue.total_sales += item.price * item.sale_sum
        saleValue.shortage_amount = saleValue.handover_amount - saleValue.total_sales
        localStorage.setItem('saleValue', JSON.stringify(saleValue))
      }
    })
  }
}