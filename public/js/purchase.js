const { default: axios } = require("axios")
const { response } = require("express")


const nut = document.getElementById("data-panel-nut")
const smoke = document.getElementById("data-panel-smoke")
const drink = document.getElementById('data-panel-drink')
renderinboundlist()

function renderinboundlist() {
  const store_id = localStorage.getItem('store_id')
  const category = ['檳榔','香菸','飲料']
  for ( i = 0; i < 3; i++) {
    let cat = category[i] 
    axios.get(`/api/getProductName/${store_id}/${category[i]}`)
      .then((response) => {
        if(cat === '檳榔') {
          nut.innerHTML = renderList(response.data)
          localStorage.setItem('nutlist', JSON.stringify(response.data))
        } else if (cat === '香菸') {
          smoke.innerHTML = renderList(response.data)
          localStorage.setItem('smokelist', JSON.stringify(response.data))
        } else {
          drink.innerHTML = renderList(response.data)
          localStorage.setItem('drinklist', JSON.stringify(response.data))
        }
      })
      .catch((err) => console.log(err))
  }
}

// 檳榔部分
nut.addEventListener('change', e => {
  let nut_list = localStorage.getItem('nutlist')
  nut_list = JSON.parse(nut_list)
  const changeItem = {
    id: parseInt(e.target.parentElement.parentElement.getAttribute("data-id")),
    value: parseInt(e.target.value)
  }
  nut_list.filter((item) => {
    if (item.product_id === changeItem.id ) {
      item.inbound = changeItem.value
    }
  })
  localStorage.setItem('nutlist', JSON.stringify(nut_list))
})

//香菸部分
smoke.addEventListener('change', e => {
  let smoke_list = localStorage.getItem('smokelist')
  smoke_list = JSON.parse(smoke_list)
  const changeItem = {
    id: parseInt(e.target.parentElement.parentElement.getAttribute("data-id")),
    value: parseInt(e.target.value)
  }
  smoke_list.filter((item) => {
    if (item.product_id === changeItem.id ) {
      item.inbound = changeItem.value
    }
  })
  localStorage.setItem('smokelist', JSON.stringify(smoke_list))
})

// 飲料部分
drink.addEventListener('change', e => {
  let drink_list = localStorage.getItem('drinklist')
  drink_list = JSON.parse(drink_list)
  const changeItem = {
    id: parseInt(e.target.parentElement.parentElement.getAttribute("data-id")),
    value: parseInt(e.target.value)
  }
  drink_list.filter((item) => {
    if (item.product_id === changeItem.id ) {
      item.inbound = changeItem.value
    }
  })
  localStorage.setItem('drinklist', JSON.stringify(drink_list))
})


function renderList(data) {
  let list = ''
  for (i = 0; i < data.length; i++) {
    const item = `
      <tr data-id="${data[i].product_id}">
        <td>${data[i].name}</td>
        <td><input class="form-control" type="number"></td>
      </tr>
    `
    list += item
  }
  return list
}

// inbound // 進貨 // name // 名稱 // product_id // 商品id

function inbound (category, list) {
  axios.post('/api/inbound', {
    store_id: parseInt(localStorage.getItem('store_id')),
    sotre_name: localStorage.getItem('Name'),
    category: category,
    product_name: list.name,
    product_id: list.product_id,
    inbound_count: list.inbound,
    inbound_unit: list.inbound_unit,
    inbound_unit_count: list.inbound_unit_count,
    shift_id: localStorage.getItem('workshiftId')
  })
    .then((response) => {
      console.log('success inbound')
    })
    .catch((err) => console.log(err))
}

