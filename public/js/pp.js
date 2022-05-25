// node
const data_panel = document.getElementById("data-panel")
const sel_name = document.getElementById("sel_name")
const startDate = document.getElementById("startDate")
const endDate = document.getElementById("endDate")

// test aa 
const test_aa = document.querySelector(".test-aa")


const checkinList = []

axios.get('/api/checkin')
  .then((response) => {
    checkinList.push(...response.data)
    makList(checkinList)
    pagelist(checkinList)
  })
  .catch((err) => console.log(err))

function filterList(data, key = null) {

}

// 產生分頁
function pagelist(data) {
  const page_n = date.length
  test_aa.innerHTML = page_n
}

// 產生清單
function makList(data) {
  let list = ''
  for (i = 0; i < data.length; i++) {
    let rowdata = `
      <tr>
        <td>${data[i].store_id}</td>
        <td>${data[i].name}</td>
        <td>${data[i].checkinDate.substring(0, 10)}</td>
        <td>${data[i].checkinTime}</td>
        <td>${data[i].class}</td>
        <td>${data[i].user}</td>
      </tr>
    `
    list += rowdata
  }
  data_panel.innerHTML = list
}
