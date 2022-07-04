const submit = document.getElementById("submit")


submit.addEventListener("click", e => {
  e.preventDefault()
  getFormInfo()
})


function getFormInfo () {
  const createForm = document.getElementById("createForm")
  const id = createForm[0].value
  const password = createForm[1].value
  const name = createForm[3].value
  const phone = createForm[4].value
  const address = createForm[5].value
  console.log( id , password)
}