const dateTime = document.getElementById("datetime")
const nutCatory = document.getElementById('nutCatory')

const nut = document.getElementById('nut')
const smoke = document.getElementById('smoke')
const drink = document.getElementById('drink')

drink.addEventListener('change', e => {
  let name = e.target.name
  let value = e.target.value
  localStorage.setItem(name, value)
  let item_id = e.target.parentElement.parentElement.getAttribute("data-id") // name
  let sale = {
    item_id: parseInt(item_id),
    drink_give : parseInt(localStorage.getItem('drink_give')),
    drink_sale : parseInt(localStorage.getItem("drink_sale"))
  }
  localStorage.setItem("sale", JSON.stringify(sale))
})

ShowTime()
getClassin()
insertLabelPrint()

const store_id = localStorage.getItem('store_id')
let category1 = '檳榔'
axios.get(`/api/getProductName/${store_id}/${category1}`)
  .then((response) => {
    renderCategory(response.data)
    console.log(response.data)
    renderNutList(response.data)
  })
  .catch((err) => console.log(err))

let category2 = '香菸'
axios.get(`/api/getProductName/${store_id}/${category2}`)
  .then((response) => {
    renderSmokeList(response.data)
  })
  .catch((err) => console.log(err))

let category3 = '飲料'
axios.get(`/api/getProductName/${store_id}/${category3}`)
  .then((response) => {
    renderDrinkList(response.data)
  })
  .catch((err) => console.log(err))


function renderCategory(data) {
  list = ''
  for( i = 0; i < data.length; i++) {
    let row = `
      <option data-id="${data[i].product_id}" value="${data[i].name}">${data[i].name}</option>
    `
    list += row
  }
  nutCatory.innerHTML = list
}

function renderNutList (data) {
  list = ''
  for( i = 0; i < data.length; i++) {
    let row = `
      <tr>
        <td name="${data[i].product_id}">${data[i].name}</td>
        <td name="nut_total" class="total_value">0</td>
        <td ><input class="form-control" name="nut_give" type="number"></td>
        <td ><input class="form-control" name="nut_sale" type="number"></td>
      </tr>
    `
    list += row
  }
  nut.innerHTML = list
}

const label_num = document.getElementById('label_num')
label_num.addEventListener('change', e => {
  console.log(e.target.name, e.target.innerText, e.target.value)
  localStorage.setItem('')
})


function renderSmokeList (data) {
  list = ''
  for( i = 0; i < data.length; i++) {
    let row = `
      <tr data-id="${data[i].product_id}">
        <td name="${data[i].name}">${data[i].name}</td>
        <td name="smoke_total" class="total_value">0</td>
        <td name="smoke_give"><input class="form-control" type="number"></td>
        <td name="smoke_sale"><input class="form-control" type="number"></td>
      </tr>
    `
    list += row
  }
  smoke.innerHTML = list
}
function renderDrinkList (data) {
  list = ''
  for( i = 0; i < data.length; i++) {
    let row = `
      <tr data-id="${data[i].product_id}">
        <td name="${data[i].name}">${data[i].name}</td>
        <td name="drink_total" class="total_value">0</td>
        <td ><input class="form-control" name="drink_give" type="number"></td>
        <td ><input class="form-control" name="drink_sale" type="number"></td>
      </tr>
    `
    list += row
  }
  drink.innerHTML = list
}

function ShowTime() {
  let NowDate = new Date()
  let Y = NowDate.getFullYear()
  let M = zeroTen(NowDate.getMonth()+1) 
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
  let nowClass = localStorage.getItem('class')
  let workShiftID = localStorage.getItem('workshiftId')
  class_in.innerText = nowClass
  workshift.innerText = workShiftID
} 

function insertLabelPrint() { // 列印標籤
  const printLable = document.getElementById('printLable')
  let labelData = {
    product_id: parseInt(localStorage.getItem('product_id')),
    product_name: parseInt(localStorage.getItem('product_name')),
    store_id: parseInt(localStorage.getItem('store_id')),
    class: localStorage.getItem('class'),
    user_id: parseInt(localStorage.getItem('user_id')),
    user: localStorage.getItem('Name'),
    package: parseInt(localStorage.getItem('label_package')),
    piece: parseInt(localStorage.getItem('label_piece')),
    total: parseInt(localStorage.getItem('label_total')),
    broken: parseInt(localStorage.getItem('label_boken')),
    shift_id: localStorage.getItem('workshiftId')
  }
  printLable.addEventListener('click', e=>{
    console.log(e.target)
    axios.post('/api/insertLabelPrint', {
      product_id : labelData.product_id,
      product_name: labelData.product_name,
      store_id: labelData.store_id,
      class: labelData.class,
      user_id: labelData.user_id,
      user: labelData.user,
      package: labelData.package,
      piece: labelData.piece,
      total: labelData.total,
      break: labelData.broken,
      shift_id: labelData.shift_id
    })
      .then ((response) => {
        console.log(response.data)
      })
      .catch((err) => console.log(err))
    }) 
  localStorage.removeItem('product_id')
  localStorage.removeItem('product_name')
  localStorage.removeItem('label_package')
  localStorage.removeItem('label_piece')
  localStorage.removeItem('label_total')
  localStorage.removeItem('label_boken')
}
