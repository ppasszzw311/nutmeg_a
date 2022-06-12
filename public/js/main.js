const userName = document.getElementById('userName')

const infoTitle = document.getElementById('infoTitle')



getUserInfo()
usernameColumns()
logout()
//mainLogin()

function usernameColumns() {
  const access = localStorage.getItem('token')
  if (access !== null) {
    document.getElementById('userName').style.visibility = "visible"
    document.getElementById('logout').style.visibility = "visible"
  } else {
    document.getElementById('userName').style.visibility = "hidden"
    document.getElementById('logout').style.visibility = "hidden"
  }
}

`
      <p class="h1" id="main_title">檳榔攤管理網</p>
      <p id="userName"></p>
      <a href="/login" id="logout">登出</a>
    `
function logout() {
  const logout = document.getElementById('logout')
  logout.addEventListener('click', e => {
    localStorage.clear()
    infoTitle.innerHTML = ''
  })
}
let access = localStorage.getItem('token')




// get user info
function getUserInfo() {
  let token = JSON.parse(localStorage.getItem('token'))
  axios.get(`/api/userInfo/${token}`)
    .then((response) => {
      let u_name = response.data.user_name
      let userid = response.data.user_id
      let store_id = response.data.store_id
      userName.innerText = u_name
      localStorage.setItem("Name", u_name)
      localStorage.setItem("user_id", userid)
      localStorage.setItem("store_id", store_id)
    })
    .catch((err) => console.log(err))
}



// 確認登入
function mainLogin() {
  const storeid = localStorage.getItem('store_id')
  if (storeid.length === 9) {
    // window.location.href = "/login"
  } else {
    console.log('notihng')
  }
}


// 產製大表
function makProductList() {
  let itemCollection = {
    productId, // 商品id
    store_id, // 店id
    productName, //商品名稱
    category, // 種類
    productCost, // 商品進貨成本 
    productPrice, // 商品售出價格

  }
}

// 製作salelist
// add sale list 
//checksale()
function checksale() {
  let saleList = JSON.parse(localStorage.getItem('saleList'))
  if (!saleList) {
    const store = parseInt(localStorage.getItem('store_id'))
    sale_list(store)
  } else {
    console.log('hell other')
  }
  sale_value()
}
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