
// const node 
const dataPanel = document.getElementById("datapanel")
const store = document.getElementById("store")


// get data 
let datalist = []
const store_id = localStorage.getItem("store_id")
axios.get(`/api/getAllProductStock/${store_id}`)
  .then((response) => {
    datalist = response.data
    renderList(datalist)
  })
axios.get(`/api/getStore/${store_id}`)
  .then((response) => {
    let list = '<option selected>選擇類別</option>'
    let selection = response.data
    for (i = 0; i < selection.length; i++) {
      item = `
        <option value=${selection[i].store_id}>${selection[i].store_name}</option>
      `
      list += item
    }
    store.innerHTML = list
  })

store.addEventListener('change', e => {
  let target = e.target.value
  console.log(target)
})


// func 
function renderList(data) {
  let lists = ''
  for (i = 0; i < data.length; i++ ) {
    let item = `
       <tr data-id=${i+1}>
         <td>${i+1}</td>
         <td>${data[i].category}</td>
         <td>${data[i].name}</td>
         <td>${data[i].stock}</td>
       </tr>
    `
    lists += item
  }
  dataPanel.innerHTML = lists
}