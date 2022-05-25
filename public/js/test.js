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

let workshiftDt_1 =[]
// 合併清單
for (i = 0; i < productList.length; i++ ) {
  const item_price = productList[i].price // 商品價格
  const stock = productList[i].stock // 商品庫存
  const inbound = 0 //進貨量
  const sale_value = 0 // 
  const item = {
    shift_id: workShiftId, // 工作代碼
    product_id: productList[i].id, // 商品id
    product_class: productList[i].category, // 商品類別
    product_name: productList[i].name, // 商品品名
    before_pcs: stock - inbound, // 上班量：庫存-進貨
    inbound_pcs: inbound, // 進貨量
    inbound_unit_sales_pcs: 0, // 進貨單位銷售量？？？ 
    retail_unit_sales_pcs: 0, // 進貨單位零售量 
    after_pcs: stock - sale_value, // 下班量：庫存 - 銷售
    sales_pcs: sale_value, // 銷售量
    total_sales: item_price * sale_value, // 銷售金額 價格 * 銷售量
    used_pcs: 0, // 檳榔原料使用量 庫存 - 工作量
    nut_package: 0, // 列印總包數
    nut_package_pcs: productList[i].unit_count, // 每包檳榔有多少顆
    unit: productList[i].inbount_unit, // 進貨單位
    inbound_unit_count: productList[i].inbound_unit_count // 進貨單位數量
  }
  workshiftDt_1.push(item)
}

localStorage.setItem('alllist', JSON.stringify(workshiftDt_1))

// 抓列表
let nut_list = []
let other_list = []
let all_item_list = JSON.parse(localStorage.getItem('alllist'))
all_item_list.forEach(item => {
  if(item.product_class === '檳榔') {
    nut_list.push(item)
  } else {
    other_list.push(item)
  }
  
});
console.log(nut_list)


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
  used_pcs:20,
  nut_package: 20,
  nut_package_pcs: 30,
  unit: '顆',
  inbound_unit_count: 1
}



// 測試按鈕
workShiftSummit.addEventListener('click', e => {
  // 點擊開始抓資料
  // 交班資料
  insertWorkShift_sale(workShift)
  // 交班明細
  insertWorkShift_saleDetail(workshiftDt)
  // 成功的訊息
  alert('丟進去囉')
})

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

// render table 
// render nut list 
function renderNutList(targetNode ,data) {
  let list = ``
  for (i = 0; i < data.length; i++ ) {
    let item = `
    <tr data-id=${data[i].product_id}>
      <tr>
        <td rowspan="2">${data[i].name}</td>
        <td>${data[i].price}</td>
        <td>${data[i].inbound_pcs}</td>
        <td><input type="number" class="form-control" name="becfore_pcs">${data[i].before_pcs}</td>
        <td><input type="number" class="form-control" name="nut_package">${data[i].nut_package}</td>
        <td><input type="number" class="form-control" name="uesd_pcs">${data[i].used_pcs}</td>
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
          <td colspan="3">售量:<span><input type="text" class="form-control" value=${  [i].sale_sum}></span></td>
        </tr>
      </tr>
    `
  }
}