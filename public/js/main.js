const userName = document.getElementById('userName')

const infoTitle = document.getElementById('infoTitle')



getUserInfo()
usernameColumns() 
logout()
mainLogin()

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