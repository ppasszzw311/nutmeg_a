const dateTime = document.getElementById("datetime")
const nutCatory = document.getElementById('nutCatory')
const ingreCatory = document.getElementById('ingreCatory')
const labelPrint = document.getElementById('labelprint')

const nut = document.getElementById('nut')
const smoke = document.getElementById('smoke')
const drink = document.getElementById('drink')

const storeId1 = localStorage.getItem('store_id')


nut.addEventListener('change', e => {
  let value = parseInt(e.target.value)
  let item_id = parseInt(e.target.parentElement.parentElement.getAttribute("data-id")) // name
  let sale_list = JSON.parse(localStorage.getItem('saleList'))
  sale_list.filter((item) => {
    if (item.product_id === item_id) {
      item.sale_temp_count = value
    }
  })
  localStorage.setItem("saleList", JSON.stringify(sale_list))

})

smoke.addEventListener('change', e => {
  let value = parseInt(e.target.value)
  let item_id = parseInt(e.target.parentElement.parentElement.getAttribute("data-id")) // name
  let sale_list = JSON.parse(localStorage.getItem('saleList'))
  sale_list.filter((item) => {
    if (item.product_id === item_id) {
      item.sale_temp_count = value
    }
  })
  localStorage.setItem("saleList", JSON.stringify(sale_list))
})

drink.addEventListener('change', e => {
  let value = parseInt(e.target.value)
  let item_id = parseInt(e.target.parentElement.parentElement.getAttribute("data-id")) // name
  let sale_list = JSON.parse(localStorage.getItem('saleList'))
  sale_list.filter((item) => {
    if (item.product_id === item_id) {
      item.sale_temp_count = value
    }
  })
  localStorage.setItem("saleList", JSON.stringify(sale_list))
})

ShowTime()
getClassin()
insertLabelPrint()

salecount()
sale_list(storeId1)
productList(storeId1)
renderItemList()

getNutWorkInfo()

// function

// add sale list 




// 銷售
function salecount() {
  saleRecord.addEventListener('click', e => {
    let sale_list = JSON.parse(localStorage.getItem('saleList'))
    for (i = 0; i < sale_list.length; i++) {
      sale_list[i].sale_sum = sale_list[i].sale_sum + sale_list[i].sale_temp_count
      sale_list[i].sale_temp_count = 0
    }
    localStorage.setItem('saleList', JSON.stringify(sale_list))

    renderItemList()
  })
}

function renderItemList() {
  const sale_list = JSON.parse(localStorage.getItem('saleList'))

  const nutList = []
  const smokeList = []
  const drinkList = []
  for (i = 0; i < sale_list.length; i++) {
    if (sale_list[i].category === "檳榔") {
      nutList.push(sale_list[i])
    } else if (sale_list[i].category === "香菸") {
      smokeList.push(sale_list[i])
    } else if (sale_list[i].category === "飲料") {
      drinkList.push(sale_list[i])
    }
  }
  renderNutList(nutList)
  renderSmokeList(smokeList)
  renderDrinkList(drinkList)
  selector()
}

function selector() {
  let storeId = parseInt(localStorage.getItem('store_id'))
  axios.get(`/api/getIngreName/${storeId}`)
    .then((response) => {
      renderCategory(response.data, ingreCatory)
    })
    .catch((err) => console.log(err))

  axios.get(`/api/getProductName/${storeId}/檳榔`)
    .then((response) => {
      renderCategory(response.data, nutCatory)
    })
    .catch((err) => console.log(err))
}

function renderCategory(data, targetr) {
  list = '<option disabled selected value> 請選擇 </option>'
  for (i = 0; i < data.length; i++) {
    let row = `
      <option data-id="${data[i].product_id}" value="${data[i].product_id}">${data[i].name}</option>
    `
    list += row
  }
  targetr.innerHTML = list
}


function renderNutList(data) {
  list = ''
  for (i = 0; i < data.length; i++) {
    let row = `
      <tr data-id="${data[i].product_id}">
        <td name="${data[i].product_id}">${data[i].p_name}</td>
        <td name="nut_total" class="total_value">${data[i].sale_sum}</td>
        <td ><input class="form-control" name="nut_sale" type="number" value=${data[i].sale_temp_count}></td>
      </tr>
    `
    list += row
  }
  nut.innerHTML = list
}




function renderSmokeList(data) {
  list = ''
  for (i = 0; i < data.length; i++) {
    let row = `
      <tr data-id="${data[i].product_id}">
        <td name="${data[i].p_name}">${data[i].p_name}</td>
        <td name="smoke_total" class="total_value">${data[i].sale_sum}</td>
        <td name="smoke_sale"><input class="form-control" type="number" value=${data[i].sale_temp_count}></td>
      </tr>
    `
    list += row
  }
  smoke.innerHTML = list
}
function renderDrinkList(data) {
  list = ''
  for (i = 0; i < data.length; i++) {
    let row = `
      <tr data-id="${data[i].product_id}">
        <td name="${data[i].p_name}">${data[i].p_name}</td>
        <td name="drink_total" class="total_value">${data[i].sale_sum}</td>
        <td name="drink_sale"><input class="form-control" type="number" value=${data[i].sale_temp_count}></td>
      </tr>
    `
    list += row
  }
  drink.innerHTML = list
}

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
  let nowClass = localStorage.getItem('class')
  let workShiftID = localStorage.getItem('workshiftId')
  class_in.innerText = nowClass
  workshift.innerText = workShiftID
}

function insertLabelPrint() { // 列印標籤
  const printLable = document.getElementById('printLabel')

  printLable.addEventListener('click', e => {
    const nutCatory1 = document.getElementById('nutCatory')
    const ingreCatory1 = document.getElementById('ingreCatory')
    const package1 = document.getElementById('package')
    const piece = document.getElementById('piece')
    const broken = document.getElementById('broken')


    // 驗證用
    console.log(
      getProductinfo(4),
      ingreCatory1.validity.valueMissing,
      nutCatory1.value, // 檳榔品名取直
      ingreCatory1.value, // 檳榔原料取直
      nutCatory1.innerText,
      nutCatory1.validity.valueMissing,
      package1.checkValidity())

    // 讀資料
    let nut_id = parseInt(nutCatory1.value)
    let inger_id = parseInt(ingreCatory1.value)
    let nutinfo = getProductinfo(nut_id)
    let ingerinfo = getProductinfo(inger_id)
    let labelData = {
      product_id: nut_id,
      product_name: nutinfo.name,
      inger_name: ingerinfo.name,
      store_id: parseInt(localStorage.getItem('store_id')),
      class: nutinfo.category,
      user_id: parseInt(localStorage.getItem('user_id')),
      user: localStorage.getItem('Name'),
      package: parseInt(package1.value),
      piece: parseInt(piece.value),
      total: parseInt(package1.value) * parseInt(nutinfo.unit_count) + parseInt(piece.value),
      broken: parseInt(broken.value),
      shift_id: localStorage.getItem('workshiftId')
    }
    const label_value = {
      nut_id: labelData.product_id,
      nut_name: labelData.product_name,
      nut_package: labelData.package,
      nut_piece: labelData.piece,
      nut_total: labelData.total,
      nut_broken: labelData.broken,
      inger_id: parseInt(inger_id),
      inger_name: ingerinfo.name,
      inger_total: labelData.total + labelData.broken // 消耗量
    }
    const label_list = localStorage.getItem('labelList')
    // if (label_list === null) {
    //   const new_label_list = []
    //   new_label_list.push(label_value)
    //   localStorage.setItem("labelList", JSON.stringify(new_label_list))
    // } else {
    //   const new_label_list = JSON.parse(localStorage.getItem('labelList'))
    //   new_label_list.push(label_value)
    //   localStorage.setItem("labelList", JSON.stringify(new_label_list))
    // }

    axios.post('/api/insertLabelPrint', {
      product_id: labelData.product_id,
      product_name: labelData.product_name,
      store_id: labelData.store_id,
      class: labelData.class,
      user_id: labelData.user_id,
      user: labelData.user,
      package: labelData.package,
      piece: labelData.piece,
      total: labelData.total,
      broken: labelData.broken,
      shift_id: labelData.shift_id
    })
      .then((response) => {
        console.log(response.data)
      })
      .catch((err) => console.log(err))
    const print_text = {
      inger_name: labelData.inger_name,
      nut_name: labelData.product_name,
      package: labelData.package,
      piece: labelData.piece
    }
    let textlabel = print_text.inger_name + "," + print_text.nut_name + "," + print_text.package + "," + print_text.piece
    window.webkit.messageHandlers.NativeMethod.postMessage(textlabel);
    alert("hello")
  })
}
// 取商品資訊
function getProductinfo(id) {
  const lists = JSON.parse(localStorage.getItem("productList"))
  const result = lists.filter(item => item.id === parseInt(id));
  return result[0]
}

// 取得檳榔工作資料
function getNutWorkInfo() {
  let workshiftID = localStorage.getItem('workshiftId')
  let printlist = []
  axios.get(`/api/getNutWorkInfo/${workshiftID}`)
    .then((response) => {
      let product = JSON.parse(localStorage.getItem('productList'))
      let workitem = response.data
      localStorage.setItem('printList', JSON.stringify(workitem))
      let workitemid = []
      for (i = 0; i < workitem.length; i++) {
        let a = String(workitem[i].product_id)
        workitemid.push(a)
        console.log(workitemid)
      }
      product.forEach(item => {
        let id = item.id
        console.log(id)
        if (id.toString().includes(workitemid)) {
          let work = {
            id: item.id,
            package: workitem[i].package,
            piece: parseInt(workitem[i].total / item.unit_count),
            total: workitem[i].total
          }
          printlist.push(work)
        } else {
          let work = {
            id: item.id,
            package: 0,
            piece: 0,
            total: 0
          }
          printlist.push(work)
        }
      })
      localStorage.setItem('printlist', JSON.stringify(printlist))
    })
    .catch((err) => console.log(err))
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