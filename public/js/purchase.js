

const nut = document.getElementById("data-panel-nut")
const smoke = document.getElementById("data-panel-smoke")
const drink = document.getElementById('data-panel-drink')
renderinboundlist()

function renderinboundlist() {
  const store_id = localStorage.getItem('store_id')
  const category = ['檳榔','香菸','飲料']
  const list = []
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