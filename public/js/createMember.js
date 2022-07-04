
const submit = document.getElementById("submit")


submit.addEventListener("click", e => {
  e.preventDefault()
  getFormInfo()
})


function getFormInfo () {
  const createForm = document.getElementById("createForm")
  const memberList = {
    id: createForm[0].value,
    password : createForm[1].value,
    name : createForm[3].value,
    phone : createForm[4].value,
    address : createForm[5].value
  }
  axios.post('/api/createMember', {
    idnum: memberList.id,
    password: memberList.password,
    name: memberList.name,
    phone: memberList.phone,
    address: memberList.address
  })
    .then((response) => {
      if (response.data.status === 1) {
        console.log('success create!')
      } else {
        console.log(response.data.status)
      }
    })
}