const userName = document.getElementById('userName')
const logout = document.getElementById('logout')

logout.addEventListener('click', e=> localStorage.clear())

getUserInfo()

// get user info 
function getUserInfo() {
  let token = JSON.parse(localStorage.getItem('token'))
  axios.get(`/api/userInfo/${token}`)
    .then( (response) => {
      let u_name = response.data.user_name
      let userid = response.data.user_id
      let store_id = response.data.store_id
      userName.innerText = u_name
      localStorage.setItem("Name", u_name)
      localStorage.setItem("user_id", userid)
      localStorage.setItem("store_id", store_id)
    })
    .catch( (err) => console.log(err))
}