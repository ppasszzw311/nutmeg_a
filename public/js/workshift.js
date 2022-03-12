const dateTime = document.getElementById("datetime")
const nutDatapanel = document.getElementById("nutDatapanel")
const smokeDatapanel = document.getElementById("smokeDatapanel")
const drinkDatapanel = document.getElementById("drinkDatapanel")
const otherDatapanel = document.getElementById("otherDatapanel")

ShowTime()
getClassin()
getInboundInfo()


function ShowTime() {
  let NowDate = new Date()
  let Y = NowDate.getFullYear()
  let M = zeroTen(NowDate.getMonth() + 1)
  let D = zeroTen(NowDate.getDate())
  let h = zeroTen(NowDate.getHours())
  let m = zeroTen(NowDate.getMinutes())
  let s = zeroTen(NowDate.getSeconds())
  let time = `${Y}年 ${M}月 ${D}日 ${h}:${m}:${s}`
  dateTime.innerHTML = '日期時間：' + time
  setTimeout('ShowTime()', 1000)
}

// to ten to zero
function zeroTen(number) {
  if (number < 10) {
    return '0' + number
  } else {
    return number
  }
}

function getClassin() {
  const class_in = document.getElementById('class_in')
  const workshift = document.getElementById('workshift')
  getworkshiftID()
  let nowClass = localStorage.getItem('class')
  let workShiftID = localStorage.getItem('workshiftId')
  class_in.innerText = nowClass
  workshift.innerText = workShiftID
} 


renderNutList()
// render workshift list
function renderNutList() {
  const store_id = JSON.parse(localStorage.getItem
  ('store_id'))
  let items = []
  axios.get(`/api/getProductInfo/${store_id}`)
    .then((response)=> {
      items = response.data
      let nut_col = []
      let smoke_col = []
      let drink_col = []
      let saleitems = JSON.parse(localStorage.getItem('saleList'))
      let sale_value = {
        nut: 0,
        smoke: 0,
        drink:0,
        other: 0
      }
      let workshift_list = []
      for (i = 0; i < items.length; i++) {

        //  建立交班列表
        const workshiftItem = {
          product_id: 1, // 商品id
          product_class:"檳榔", //商品類別
          product_name: "菁仔", //商品名稱
          product_price: 50, // 商品價格
          inbound: 0,
          workbeg_on:0,
          work_beg:0,
          work_count:0,
     ｑ     workbeg_off:0,
          sum:0,
          sale_count:0
        }
        if (items[i].category === '檳榔') {
          let item = `
        <tr data-id=${items[i].product_id}>
          <tr>
            <td rowspan="2">${items[i].name}</td>
            <td>${items[i].price}</td>
            <td>${saleitems[i].inbound}</td>
            <td><input type="number" class="form-control" name="workbeg_m"></td>
            <td><input type="number" class="form-control" name="workbeg_m"></td>
            <td><input type="number" class="form-control" name="work_m"></td>
            <td><input type="number" class="form-control" name="gift_m"></td>
          </tr>
          <tr>
            <td colspan="4">金額:<span>${items[i].price * saleitems[i].sale_sum}</span></td>
            <td colspan="3">售量:<span><input type="number" class="form-control" value=${saleitems[i].sale_sum}></span></td>
          </tr>
        </tr>
      `
          nut_col += item
          sale_value.nut += items[i].price * saleitems[i].sale_sum
        } else if (items[i].category === '香菸') {
          let item = `
        <tr data-id=${items[i].product_id}>
          <tr>
            <td rowspan="2">${items[i].name}</td>
            <td>${items[i].price}</td>
            <td>${saleitems[i].inbound}</td>
            <td><input type="number" class="form-control" name="workbeg_m"></td>            
            <td><input type="number" class="form-control" name="workbeg_m"></td>
            <td><input type="number" class="form-control" name="workbeg_m"></td>
            <td><input type="number" class="form-control" name="workbeg_m"></td>
         </tr>
         <tr>
            <td colspan="4">金額:<span>${items[i].price * saleitems[i].sale_sum}</span></td>
            <td colspan="3">售量:<span><input type="text" class="form-control" value=${saleitems[i].sale_sum}></span></td>
         </tr>
        </tr>
      `
          smoke_col += item
          sale_value.smoke += items[i].price * saleitems[i].sale_sum
        } else if (items[i].category === '飲料') {
          let item = `
        <tr data-id=${items[i].product_id}>
          <tr>
          <td rowspan="2">${items[i].name}</td>
          <td>${items[i].price}</td>
          <td>${saleitems[i].inbound}</td>
          <td><input type="number" class="form-control" name="workbeg_m"></td>
          <td><input type="number" class="form-control" name="workbeg_m"></td>
          <td><input type="number" class="form-control" name="workbeg_m"></td>
          <td><input type="number" class="form-control" name="workbeg_m"></td>
        </tr>
        <tr>
          <td colspan="4">金額:<span>${items[i].price * saleitems[i].sale_sum}</span></td>
          <td colspan="3">售量:<span><input type="text" class="form-control" value=${saleitems[i].sale_sum}></span></td>
        </tr>
        </tr>
      `
          drink_col += item
          sale_value.drink += items[i].price * saleitems[i].sale_sum
        } else {
          let items = `
        <tr>
              <td rowspan="2">11111</td>
              <td>1</td>
              <td>1</td>
              <td><input type="number" class="form-control" name="workbeg_m"></td>
              <td><input type="number" class="form-control" name="workbeg_m"></td>
              <td><input type="number" class="form-control" name="workbeg_m"></td>
              <td><input type="number" class="form-control" name="workbeg_m"></td>
            </tr>
            <tr>
           <td colspan="4">金額:<span></span></td>
           <td colspan="3">售量:<span><input type="text" class="form-control"></span></td>
            </tr>
      `
        }
      }
      nutDatapanel.innerHTML = nut_col
      smokeDatapanel.innerHTML = smoke_col
      drinkDatapanel.innerHTML = drink_col
      saleMoney(sale_value)
    })
    .catch((err) => console.log(err))
  //let items = JSON.parse(localStorage.getItem('saleList'))  
}


function saleMoney (money_cat) {
  const money = document.getElementById("money")
  let sum = money_cat.nut + money_cat.smoke + money_cat.drink + money_cat.other
  let list = `
        <p class="h6 text-center">總金額：<span>${sum}元</span></p>
        <p class="h6 text-center">檳榔：<span>${money_cat.nut}元</span></p>
        <p class="h6 text-center">香菸：<span>${money_cat.smoke}元</span></p>
        <p class="h6 text-center">飲料：<span>${money_cat.drink}元</span></p>
        <p class="h6 text-center">其它：<span>${money_cat.other}元</span></p>
        <div class="col">
          <p class="h4 text-center">交班金額</p>
          <div class="input-group sm-3">
            <div class="input-group-prepend">
            <span class="input-group-text">$</span>
            </div>
            <input type="text" class="form-control" aria-label="Amount(to the nearest doollar)">
            <div class="input-group-append">
            <span class="input-group-text">元</span>
            </div>
          </div>
        </div>
        <p class="h4 text-center">短溢金額</p>
        <p class="h6 text-center" id="countMoney">0元</p>
  `
  money.innerHTML = list
}

function getworkshiftID() {
  const store_id = JSON.parse(localStorage.getItem('store_id'))
  axios.get(`/api/getCurrentWorkShiftId/${store_id}`)
    .then((response) => {
      let workId = response.data[0].shift_id
      // console.log(workId)
      //localStorage.setItem('workshiftId', workId)
    })
    .catch((err) => console.log(err))
}

// 取的進貨量

function getInboundInfo() {
  const shift_id = localStorage.getItem("workshiftId")
  axios.get(`/api/getInboundInfo/${shift_id}`)
    .then((response) => {
      localStorage.setItem("inboundList", JSON.stringify(response.data))
      let inbound = response.data
      let saleitems = JSON.parse(localStorage.getItem('saleList'))
      for (i = 0 ; i < saleitems.length; i++) {
        for (j = 0; j < inbound.length; j++) {
          let inbID = parseInt(inbound[j].product_id)
          if (saleitems[i].product_id === inbID) {
            saleitems[i].inbound = inbound[j].inbound_count
          } else {
            saleitems[i].inbound = 0
          }
        }
      }
      localStorage.setItem("saleList", JSON.stringify(saleitems))
    }) 
    .catch((err) => console.log(err))
}


// function getNutworkfifo() {
//   let workshift = 
// }