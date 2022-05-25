const hello = document.querySelector('p')
const id = localStorage.getItem('store_id')
if (id.length === 9) {
  window.location.href = '/login'
} else {
  window.location.href = '/home'
}



