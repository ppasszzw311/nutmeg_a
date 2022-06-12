// make sale value
sale_value()
function sale_value() {
  const saleValue = JSON.parse(localStorage.getItem('saleValue'))
  const saleList = JSON.parse(localStorage.getItem('saleList'))
  if (!saleValue) {
    const cost = {
      store_id: parseInt(localStorage.getItem('store_id')),
      class: localStorage.getItem('class'),
      user_id: parseInt(localStorage.getItem('user_id')),
      user: localStorage.getItem('Name'),
      operator: '',
      successor: '',
      handover_amount: 0, // 交班金額
      shortage_amount: 0, // 短溢金額
      total_sales: 0, // 總銷售額
      betelnut_sales: 0, // 檳榔
      drinks_sales: 0, // 飲料      
      cigarette_sales: 0, // 香菸
      other_sales: 0,
      shift_id: localStorage.getItem('workshiftId')
    }
    localStorage.setItem('saleValue', JSON.stringify(cost))
  } else {
    saleValue.class = localStorage.getItem('class')
    saleValue.shift_id = localStorage.getItem('workshiftId')
    saleValue.store_id = parseInt(localStorage.getItem('user_id'))
    saleValue.user_id = parseInt(localStorage.getItem('user_id'))
    saleValue.user = localStorage.getItem('Name')
    saleList.forEach(item => {
      let clas = item.category
      if (clas == "檳榔") {
        saleValue.betelnut_sales += item.price * item.sale_sum
        saleValue.total_sales += item.price * item.sale_sum
        saleValue.shortage_amount = saleValue.total_sales - saleValue.handover_amount
        localStorage.setItem('saleValue', JSON.stringify(saleValue))
      } else if (clas == "香菸") {
        saleValue.cigarette_sales += item.price * item.sale_sum
        saleValue.total_sales += item.price * item.sale_sum
        saleValue.shortage_amount = saleValue.total_sales - saleValue.handover_amount
        localStorage.setItem('saleValue', JSON.stringify(saleValue))
      } else if (clas == "飲料") {
        saleValue.drinks_sales += item.price * item.sale_sum
        saleValue.total_sales += item.price * item.sale_sum
        saleValue.shortage_amount = saleValue.total_sales - saleValue.handover_amount
        localStorage.setItem('saleValue', JSON.stringify(saleValue))
      } else if (clas == "檳榔原料") {

      } else if (clas == "百貨") {
        saleValue.other_sales += item.price * item.sale_sum
        saleValue.total_sales += item.price * item.sale_sum
        saleValue.shortage_amount = saleValue.handover_amount - saleValue.total_sales
        localStorage.setItem('saleValue', JSON.stringify(saleValue))
      }
    })
  }
}