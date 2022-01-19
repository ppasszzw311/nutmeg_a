
// const 
const submit = document.getElementById('login-button')

submit.addEventListener('click', (e) =>{
  e.preventDefault()
  let a = getLoginInfo()
  logincheck()
})


function getLoginInfo () {
  const form = document.getElementById('login')
  const id = form[0].value
  const password = form[1].value
  payload = {
    user_id: id,
    user_password: password
  }
  return payload
}

function logincheck () {
  const form = document.getElementById('login')
  const id = form[0].value
  const password = form[1].value
  axios.post('/api/login', {
    idnum: id,
    password: password
  })
    .then( (response) => {
      let aa =response.data[0].token
      localStorage.setItem("token", JSON.stringify(aa))
      window.location.href = '/'
    })
    .catch( (err) => console.log(err))
}