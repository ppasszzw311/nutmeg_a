//
const dateTime = document.getElementById("datetime")
const nutDatapanel = document.getElementById("nutDatapanel")
const smokeDatapanel = document.getElementById("smokeDatapanel")
const drinkDatapanel = document.getElementById("drinkDatapanel")
const otherDatapanel = document.getElementById("otherDatapanel")
const workshiftCheck = document.getElementById("workshiftcheck")
const checkWorkshift = document.getElementById("checkWorkshift")
const workShiftMember = document.querySelector(".workShiftMember")


//
ShowTime() // 時間
getClassin() // 值班班別
getInboundInfo()

// event listener 
nutDatapanel.addEventListener('change', e => {
  let targetItem = e.target
  let itemID = parseInt(targetItem.getAttribute('data-id'))
  let itemName = targetItem.name
  let itemValue = parseInt(targetItem.value)
  changeSaleList(itemID, itemValue)
  const testalaa = JSON.parse(localStorage.getItem('saleList'))
  changeSaleCost()
  changeworkList(itemID, itemName, itemValue)
  renderTotalList()
  renderWorkShiftList(testalaa)
})

drinkDatapanel.addEventListener('change', e => {
  let targetItem = e.target
  let itemID = parseInt(targetItem.getAttribute('data-id'))
  let itemValue = parseInt(targetItem.value)
  changeSaleList(itemID, itemValue)
  const testalaa = JSON.parse(localStorage.getItem('saleList'))
  changeSaleCost()
  renderTotalList()
  renderWorkShiftList(testalaa)
})
smokeDatapanel.addEventListener('change', e => {
  let targetItem = e.target
  let itemID = parseInt(targetItem.getAttribute('data-id'))
  let itemValue = parseInt(targetItem.value)
  changeSaleList(itemID, itemValue)
  const testalaa = JSON.parse(localStorage.getItem('saleList'))
  changeSaleCost()
  renderTotalList()
  renderWorkShiftList(testalaa)
})
otherDatapanel.addEventListener('change', e => {
  let targetItem = e.target
  let itemID = parseInt(targetItem.getAttribute('data-id'))
  let itemValue = parseInt(targetItem.value)
  changeSaleList(itemID, itemValue)
  const testalaa = JSON.parse(localStorage.getItem('saleList'))
  changeSaleCost()
  renderTotalList()
  renderWorkShiftList(testalaa)
})
money.addEventListener('change', e => {
  let target = parseInt(e.target.value)
  let saleValue = JSON.parse(localStorage.getItem('saleValue'))
  saleValue.handover_amount = target
  saleValue.shortage_amount = saleValue.total_sales - saleValue.handover_amount
  localStorage.setItem('saleValue', JSON.stringify(saleValue))
  changeSaleCost()
  renderTotalList()
  renderWorkShiftList(testalaa)
  checkWW()
})
workShiftMember.addEventListener('change', e => {
  let target = e.target.name
  let value = e.target.value
  console.log(target, value)
  if (target === 'operator') {
    let saleValue = JSON.parse(localStorage.getItem('saleValue'))
    console.log(value)
    saleValue.operator = value
    localStorage.setItem('saleValue', JSON.stringify(saleValue))
    changeSaleCost()
    renderTotalList()
    renderWorkShiftList(testalaa)
    checkWW()
  } else {
    let saleValue = JSON.parse(localStorage.getItem('saleValue'))
    console.log(value)
    saleValue.successor = value
    localStorage.setItem('saleValue', JSON.stringify(saleValue))
    changeSaleCost()
    renderTotalList()
    renderWorkShiftList(testalaa)
    checkWW()
  }
})


// 送出
workshiftcheck.addEventListener('click', e => {
  const list = JSON.parse(localStorage.getItem('saleValue'))
  insertWorkShift_sale(list)
  pushWorkShiftList()
  alert('success')
  // 清除銷售列表，重設
  window.location.href = '/home'
})
//綁修改

const operator = document.getElementById("operator")
const successor = document.getElementById("successor")




// 先拿商品名單
const productList = JSON.parse(localStorage.getItem('productList'))
// 拿銷售名單
const saleList = JSON.parse(localStorage.getItem('saleList'))
// 拿進貨名單
const inboundList = JSON.parse(localStorage.getItem('inboundList'))
// 拿列印標籤名單
// 先拿workshiftID 
const workShiftId = localStorage.getItem('workshiftId')

getworkprintList(workShiftId)
const parintLsit = JSON.parse(localStorage.getItem('parintList'))
// 使用交班表

const workShiftSummit = document.getElementById('summit_workshift')


function pushWorkShiftList() {
  let workshiftDt_1 = []
  const saleValue = JSON.parse(localStorage.getItem('saleValue'))
  const saleList = JSON.parse(localStorage.getItem('saleList'))
  const work_list = JSON.parse(localStorage.getItem('workList'))
  saleList.forEach(item => {
    if (item.category.toString() === '檳榔') {
      let id = String(item.product_id)
      let newitem = work_list.filter(a => a.id.toString().includes(id))
      let package = newitem[0].workPackage
      let piece = newitem[0].workPiece
      const list = {
        shift_id: saleValue.shift_id,
        product_id: item.product_id,
        product_class: item.category,
        product_name: item.p_name,
        before_pcs: item.stock - item.inbound,
        inbound_pcs: item.inbound * item.inbound_unit_count,
        inbound_unit_sales_pcs: parseInt(item.inbound / item.inbound_unit_count),
        retail_unit_sales_pcs: item.sale_sum - parseInt(item.inbound / item.inbound_unit_count),
        after_pcs: item.stock - item.sale_sum,
        sales_pcs: item.sale_sum,
        total_sales: item.sale_sum * item.price,
        used_pcs: null,
        nut_package: package,
        nut_package_pcs: piece,
        unit: null,
        inbound_unit_count: item.inbound
      }
      insertWorkShift_saleDetail(list)
    } else {
      const list = {
        shift_id: saleValue.shift_id,
        product_id: item.product_id,
        product_class: item.category,
        product_name: item.p_name,
        before_pcs: item.stock - item.inbound,
        inbound_pcs: item.inbound * item.inbound_unit_count,
        inbound_unit_sales_pcs: parseInt(item.inbound / item.inbound_unit_count),
        retail_unit_sales_pcs: item.sale_sum - parseInt(item.inbound / item.inbound_unit_count),
        after_pcs: item.stock - item.sale_sum,
        sales_pcs: item.sale_sum,
        total_sales: item.sale_sum * item.price,
        used_pcs: null,
        nut_package: null,
        nut_package_pcs: null,
        unit: null,
        inbound_unit_count: item.inbound
      }
      insertWorkShift_saleDetail(list)
    }
  })

}


// 抓列表
let nut_list = []
let other_list = []



// 定義要輸入的列表，測試用
// 交班表
let workShift = {
  store_id: 1,
  class: '早班',
  user_id: 1002,
  user: '內湖中和店',
  operator: '上一班的人',
  successor: '下一班的人',
  handover_amount: 15400,
  shortage_amount: 300,
  total_sales: 20,
  betelnut_sales: 10000,
  drinks_sales: 3100,
  cigarette_sales: 2300,
  shift_id: 'testall'
}
// 交班明細，要從商品銷售列表跑出來
const workshiftDt = {
  shift_id: 'testall',
  product_id: 1,
  product_class: '檳榔',
  product_name: '白中白',
  before_pcs: 45,
  inbound_pcs: 5,
  inbound_unit_sales_pcs: 30,
  retail_unit_sales_pcs: 1,
  after_pcs: 10,
  sales_pcs: 40,
  total_sales: 40,
  used_pcs: 20,
  nut_package: 20,
  nut_package_pcs: 30,
  unit: '顆',
  inbound_unit_count: 1
}

// 改銷售數量
function changeSaleList(id, value) {
  let saleList = JSON.parse(localStorage.getItem('saleList'))
  saleList.forEach(element => {
    if (element.product_id === id) {
      element.sale_sum = value
    }
  });
  localStorage.setItem('saleList', JSON.stringify(saleList))
  checkWW()
  renderTotalList()
}

function insertWorkShift_sale(data) {
  axios.post('/api/inserWorkShift', {
    store_id: data.store_id,
    class: data.class,
    user_id: data.user_id,
    user: data.user,
    operator: data.operator,
    successor: data.successor,
    handover_amount: data.handover_amount,
    stort_amount: data.stort_amount,
    total_sales: data.total_sales,
    betelnut_sale: data.betelnut_sale,
    drinks_sales: data.drinks_sales,
    cigarette_sales: data.cigarette_sales,
    shift_id: data.shift_id
  })
    .then((response) => {
      console.log(response.data)
    })
    .catch((err) => console.log(err))
}

function insertWorkShift_saleDetail(data) {
  axios.post('/api/inserWorkShiftDt', {
    shift_id: data.shift_id,
    product_id: data.product_id,
    product_class: data.product_class,
    product_name: data.product_name,
    before_pcs: data.before_pcs,
    inbound_pcs: data.inbound_pcs,
    inbound_unit_sales_pcs: data.inbound_unit_sales_pcs,
    retail_unit_sales_pcs: data.retail_unit_sales_pcs,
    after_pcs: data.after_pcs,
    sales_pcs: data.sales_pcs,
    total_sales: data.total_sales,
    used_pcs: data.used_pcs,
    nut_package: data.nut_package,
    nut_package_pcs: data.nut_package_pcs,
    unit: data.unit,
    inbound_unit_count: data.inbound_unit_count
  })
    .then((response) => {
      console.log(response.data)
    })
    .catch((err) => console.log(err))
}

// 取得列印標籤清單
function getworkprintList(workshiftID) {
  let printList = []
  axios.get('/api/labelPrint')
    .then((response) => {
      const allList = response.data

      for (i = 0; i < allList.length; i++) {
        if (allList[i].shift_id === workshiftID) {
          printList.push(allList[i])
        }
      }
      localStorage.setItem('printList', JSON.stringify(printList))
    })
    .catch((err) => console.log(err))
}
makeWorkList()
function makeWorkList() {
  let printList = JSON.parse(localStorage.getItem('printList'))
  let productList = JSON.parse(localStorage.getItem('productList'))
  productList = productList.filter((item) => item.category === '檳榔')
  workList = []
  productList.forEach((item) => {
    let id = String(item.id)
    let itemlist = printList.filter((element) => element.product_id.toString().includes(id))
    if (itemlist.length > 0) {
      let work_package = function () {
        let package = 0
        itemlist.forEach((ans) => {
          package += ans.package
        })
        return package
      }
      let work_piece = function () {
        let piece = 0
        itemlist.forEach((ans) => {
          piece += ans.piece
        })
        return piece
      }
      let work_list = {
        id: item.id,
        name: item.name,
        unit_count: item.unit_count,
        workPackage: work_package(),
        workPiece: work_piece()
      }
      workList.push(work_list)
    } else {
      let work_list = {
        id: item.id,
        name: item.name,
        unit_count: item.unit_count,
        workPackage: 0,
        workPiece: 0
      }
      workList.push(work_list)
    }
  })
  localStorage.setItem('workList', JSON.stringify(workList))
}



// render table 
// render nut list 
function renderNutList(targetNode, data) {
  let workList = JSON.parse(localStorage.getItem('workList'))
  let list = ``
  for (i = 0; i < data.length; i++) {
    let id = data[i].product_id
    let matchItem = workList.filter((item) => item.id === id)
    let package = matchItem.workPackage
    let piece = matchItem.workPiece
    let item = `
    <tr data-id=${data[i].product_id}>
      <tr>
        <td rowspan="2">${data[i].name}</td>
        <td>${data[i].price}</td>
        <td>${data[i].inbound_pcs}</td>
        <td><input type="number" class="form-control" name="becfore_pcs">${data[i].before_pcs}</td>
        <td><input type="number" class="form-control" name="nut_package">${package}</td>
        <td><input type="number" class="form-control" name="uesd_pcs">${piece}</td>
        <td><input type="number" class="form-control" name="aftet_pcs">${data[i].after_pcs}</td>
      </tr>
      <tr>
        <td colspan="4">金額:<span>${items[i].price * saleitems[i].sale_sum}</span></td>
        <td colspan="3">售量:<span><input type="text" class="form-control" value=${data[i].sales_pcs}></span></td>
      </tr>
    </tr>
      `
    list += item
  }
  targetNode.innerHTML = list
}
// render other list 
function renderOtherList(targetNode, data) {
  let list = ``
  for (i = 0; i < data.length; i++) {
    let item = `
      <tr data-id=${data[i].product_id}>
        <tr>
          <td rowspan="2">${data[i].product_name}</td>
          <td>${data[i].price}</td>
          <td>${data[i].inbound}</td>
          <td><input type="number" class="form-control" name="before_pcs"></td>
          <td><input type="number" class="form-control" name="before_pcs"></td>
          <td><input type="number" class="form-control" name="after_pcs"></td>
          <td><input type="number" class="form-control" name="after_pcs"></td>
        </tr>
        <tr>
          <td colspan="4">金額:<span>${items[i].price * data[i].sale_sum}</span></td>
          <td colspan="3">售量:<span><input type="text" class="form-control" value=${[i].sale_sum}></span></td>
        </tr>
      </tr>
    `
  }
}

let testalaa = JSON.parse(localStorage.getItem('saleList'))
renderWorkShiftList(testalaa)
function renderWorkShiftList(list) {
  let nutCol = ``
  let drinkCol = ``
  let smokeCol = ``
  let otherCol = ``
  let workList = JSON.parse(localStorage.getItem('workList'))
  for (i = 0; i < list.length; i++) {
    let category = list[i].category
    if (category == '檳榔') {
      let id = String(list[i].product_id)
      let itemList = workList.filter((item) => item.id.toString().includes(id))
      let package = itemList[0].workPackage
      let piece = itemList[0].workPiece
      let item = `
        <tr data-id=${list[i].product_id}>
          <tr>
            <td rowspan="2">${list[i].p_name}</td>
            <td>${list[i].price}</td>
            <td>${list[i].inbound}</td>
            <td><input type="number" class="form-control" data-id=${list[i].product_id} name="before_package" value=${list[i].stock - list[i].inbound}></td>
            <td><input type="number" class="form-control" data-id=${list[i].product_id} name="work_package" value=${package}></td>
            <td><input type="number" class="form-control" data-id=${list[i].product_id} name=work_piece" value=${piece}></td>
            <td><input type="number" class="form-control" data-id=${list[i].product_id} name="after_piece" value=${list[i].stock - list[i].sale_sum}></td>
          </tr>
          <tr>
            <td colspan="4">金額:<span>${list[i].price * list[i].sale_sum}</span></td>
            <td colspan="3">售量:<span><input type="number" class="form-control" data-id=${list[i].product_id} value=${list[i].sale_sum}></span></td>
          </tr>
        </tr>
      `
      nutCol += item
    } else if (category == '飲料') {
      let before_package = parseInt((list[i].stock - list[i].inbound) / list[i].inbound_unit_count)
      let before_pcs = (list[i].stock - list[i].inbound) - (list[i].inbound_unit_count * before_package)
      let after_package = parseInt((list[i].stock - list[i].sale_sum) / list[i].inbound_unit_count)
      let after_pcs = (list[i].stock - list[i].sale_sum) - (list[i].inbound_unit_count * after_package)
      let item = `
        <tr data-id=${list[i].product_id}>
          <tr>
            <td rowspan="2">${list[i].p_name}</td>
            <td>${list[i].price}</td>
            <td>${list[i].inbound}</td>
            <td><input type="number" class="form-control" name="before_package" value=${before_package}></td>            
            <td><input type="number" class="form-control" name="before_pcs" value=${before_pcs}></td>
            <td><input type="number" class="form-control" name="after_package" value=${after_package}></td>
            <td><input type="number" class="form-control" name="after_pcs" value=${after_pcs}></td>
         </tr>
         <tr>
            <td colspan="4">金額:<span>${list[i].price * list[i].sale_sum}</span></td>
            <td colspan="3">售量:<span><input type="text" class="form-control" data-id=${list[i].product_id} value=${list[i].sale_sum}></span></td>
         </tr>
        </tr>
      `
      drinkCol += item
    } else if (category == '香菸') {
      let before_package = parseInt((list[i].stock - list[i].inbound) / list[i].inbound_unit_count)
      let before_pcs = (list[i].stock - list[i].inbound) - (list[i].inbound_unit_count * before_package)
      let after_package = parseInt((list[i].stock - list[i].sale_sum) / list[i].inbound_unit_count)
      let after_pcs = (list[i].stock - list[i].sale_sum) - (list[i].inbound_unit_count * after_package)
      let item = `
        <tr data-id=${list[i].product_id}>
          <tr>
            <td rowspan="2">${list[i].p_name}</td>
            <td>${list[i].price}</td>
            <td>${list[i].inbound}</td>
            <td><input type="number" class="form-control" name="before_package" value=${before_package}></td>            
            <td><input type="number" class="form-control" name="before_pcs" value=${before_pcs}></td>
            <td><input type="number" class="form-control" name="after_package" value=${after_package}></td>
            <td><input type="number" class="form-control" name="after_pcs" value=${after_pcs}></td>
         </tr>
         <tr>
            <td colspan="4">金額:<span>${list[i].price * list[i].sale_sum}</span></td>
            <td colspan="3">售量:<span><input type="text" class="form-control" data-id=${list[i].product_id} value=${list[i].sale_sum}></span></td>
         </tr>
        </tr>
      `
      smokeCol += item
    } else if (category == '原料') {
      console.log('原料哈囉')
    } else {
      let before_package = parseInt((list[i].stock - list[i].inbound) / list[i].inbound_unit_count)
      let before_pcs = (list[i].stock - list[i].inbound) - (list[i].inbound_unit_count * before_package)
      let after_package = parseInt((list[i].stock - list[i].sale_sum) / list[i].inbound_unit_count)
      let after_pcs = (list[i].stock - list[i].sale_sum) - (list[i].inbound_unit_count * after_package)
      let item = `
        <tr data-id=${list[i].product_id}>
          <tr>
            <td rowspan="2">${list[i].p_name}</td>
            <td>${list[i].price}</td>
            <td>${list[i].inbound}</td>
            <td><input type="number" class="form-control" name="before_package" value=${before_package}></td>            
            <td><input type="number" class="form-control" name="before_pcs" value=${before_pcs}></td>
            <td><input type="number" class="form-control" name="after_package" value=${after_package}></td>
            <td><input type="number" class="form-control" name="after_pcs" value=${after_pcs}></td>
         </tr>
         <tr>
            <td colspan="4">金額:<span>${list[i].price * list[i].sale_sum}</span></td>
            <td colspan="3">售量:<span><input type="text" class="form-control" data-id=${list[i].product_id} value=${list[i].sale_sum}></span></td>
         </tr>
        </tr>
      `
      otherCol += item
    }
  }

  // innerhtml 
  nutDatapanel.innerHTML = nutCol
  smokeDatapanel.innerHTML = smokeCol
  drinkDatapanel.innerHTML = drinkCol
  otherDatapanel.innerHTML = otherCol
}


// 寫總數
changeSaleCost()
function changeSaleCost() {
  let cost = JSON.parse(localStorage.getItem('saleValue'))
  if (cost.length !== 1) {
    let cost = {
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
  }
  let list = JSON.parse(localStorage.getItem('saleList'))
  list.forEach(item => {
    let clas = item.category
    if (clas == "檳榔") {
      cost.betelnut_sales += item.price * item.sale_sum
      cost.total_sales += item.price * item.sale_sum
      cost.shortage_amount = cost.total_sales - cost.handover_amount
      localStorage.setItem('saleValue', JSON.stringify(cost))
    } else if (clas == "香菸") {
      cost.cigarette_sales += item.price * item.sale_sum
      cost.total_sales += item.price * item.sale_sum
      cost.shortage_amount = cost.total_sales - cost.handover_amount
      localStorage.setItem('saleValue', JSON.stringify(cost))
    } else if (clas == "飲料") {
      cost.drinks_sales += item.price * item.sale_sum
      cost.total_sales += item.price * item.sale_sum
      cost.shortage_amount = cost.total_sales - cost.handover_amount
      localStorage.setItem('saleValue', JSON.stringify(cost))
    } else if (clas == "檳榔原料") {

    } else if (clas == "百貨") {
      cost.other_sales += item.price * item.sale_sum
      cost.total_sales += item.price * item.sale_sum
      cost.shortage_amount = cost.handover_amount - cost.total_sales
      localStorage.setItem('saleValue', JSON.stringify(cost))
    }
  })
}

// 總金額對應
renderTotalList()
function renderTotalList() {
  const money_cat = JSON.parse(localStorage.getItem('saleValue'))
  const money = document.getElementById("money")
  const workShiftMember = document.querySelector(".workShiftMember")
  let sum = money_cat.betelnut_sales + money_cat.drinks_sales + money_cat.cigarette_sales + money_cat.other_sales
  let list = `
        <p class="h6 text-center">總金額：<span>${sum}元</span></p>
        <p class="h6 text-center">檳榔：<span>${money_cat.betelnut_sales}元</span></p>
        <p class="h6 text-center">香菸：<span>${money_cat.cigarette_sales}元</span></p>
        <p class="h6 text-center">飲料：<span>${money_cat.drinks_sales}元</span></p>
        <p class="h6 text-center">其它：<span>${money_cat.other_sales}元</span></p>
        <div class="col">
          <p class="h4 text-center">交班金額</p>
          <div class="input-group sm-3">
            <div class="input-group-prepend">
            <span class="input-group-text">$</span>
            </div>
            <input type="text" class="form-control" id="handover_amount" aria-label="Amount(to the nearest doollar)" value=${money_cat.handover_amount}>
            <div class="input-group-append">
            <span class="input-group-text">元</span>
            </div>
          </div>
        </div>
        <p class="h4 text-center">短溢金額</p>
        <p class="h6 text-center" id="countMoney">${sum - money_cat.handover_amount}元</p>
  `
  let member = `
        <p class="h5 text-center">值班人: <span class="h6"><input class="form-control" type="text" id="operator" name="operator" value=${money_cat.operator}></span></p>
          <p class="h5 text-center">接班人: <span class="h6"><input class="form-control" type="text" id="successor" name="successor" value=${money_cat.successor}></span></p>
          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#CheckList" id="submit1">
              請確認交班
            </button>
            <a href="/home">
              <button class="btn btn-secondary">關閉</button>
            </a>
          </div>
  `
  money.innerHTML = list
  workShiftMember.innerHTML = member
}

// 工作明細確認

function checkWW() {
  const workAll = JSON.parse(localStorage.getItem('saleValue'))
  let item = `
          <div class="row">
            <p>班次：<span>${workAll.class}</span></p>
            <p>工作編號：<span>${workAll.shift_id}</span></p>
            <p>值班人：<span>${workAll.operator}</span></p>
            <p>接班人：<span>${workAll.successor}</span></p>
          </div>
          <div class="row">
            <p>檳榔銷售金額：<span>${workAll.betelnut_sales}</span>元</p>
            <p>香菸銷售金額：<span>${workAll.cigarette_sales}</span>元</p>
            <p>飲料銷售金額：<span>${workAll.drinks_sales}</span>元</p>
            <p>其他銷售金額：<span>${workAll.other_sales}</span>元</p>
            <p><strong>總金額：<span>${workAll.total_sales}</span>元</strong> </p>
            <p><strong>交班金額：<span>${workAll.handover_amount}</span>元</strong> </p>
            <p><strong>短缺金額：<span>${workAll.shortage_amount}</span>元</strong> </p>
          </div>
  `
  checkWorkshift.innerHTML = item
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
  getworkshiftID()
  let nowClass = localStorage.getItem('class')
  let workShiftID = localStorage.getItem('workshiftId')
  class_in.innerText = nowClass
  workshift.innerText = workShiftID
}

function getworkshiftID() {
  const store_id = JSON.parse(localStorage.getItem('store_id'))
  axios.get(`/api/getCurrentWorkShiftId/${store_id}`)
    .then((response) => {
      let workId = response.data[0].shift_id
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
      for (i = 0; i < saleitems.length; i++) {
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

// change work 

function changeworkList(id, fieldname, Value) {
  const workList = JSON.parse(localStorage.getItem('workList'))
  workList.forEach(item => {
    let itemId = String(item.id)
    if (itemId === String(id)) {
      let field = fieldname
      if (field === 'work_package') {
        item.workPackage = parseInt(Value)
      } else if (field === 'work_piece') {
        item.workPiece = parseInt(Value)
      }
    }
  })
  localStorage.setItem('workList', JSON.stringify(workList))
}