
// // listener 
// const data_panel = document.getElementById('data-panel')
// const sel_name = document.getElementById("sel_name")
// const startDate = document.getElementById("startDate")
// const endDate = document.getElementById("endDate")


// // data
// let datalist = []

// getCheckList()
// // get all list 
// function getCheckList() {
//   axios.get('/api/checkin')
//     .then((response) => {
//       const store = parseInt(localStorage.getItem('store_id'))
//       datalist.push(...response.data)
//       datalist = datalist.filter((item) => item.store_id === store)
//       makList(datalist)
//     })
//     .catch((err) => console.log(err))
// }

// function makList(data) {
//   let list = ''
//   for (i = 0; i < data.length; i++) {
//     let rowdata = `
//       <tr>
//         <td>${data[i].store_id}</td>
//         <td>${data[i].name}</td>
//         <td>${data[i].checkinDate.substring(0, 10)}</td>
//         <td>${data[i].checkinTime}</td>
//         <td>${data[i].class}</td>
//         <td>${data[i].user}</td>
//       </tr>
//     `
//     list += rowdata
//   }
//   data_panel.innerHTML = list
// }

// // 