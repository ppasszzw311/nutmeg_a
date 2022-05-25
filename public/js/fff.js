for (i = 0; i < productList.length; i++) {
  const item_price = productList[i].price // 商品價格
  const stock = productList[i].stock // 商品庫存
  const inbound = 0 //進貨量
  const sale_value = 0 // 
  const item = {
    shift_id: workShiftId, // 工作代碼
    product_id: productList[i].id, // 商品id
    product_class: productList[i].category, // 商品類別
    product_name: productList[i].name, // 商品品名
    before_pcs: stock - inbound, // 上班量：庫存-進貨
    inbound_pcs: inbound, // 進貨量
    inbound_unit_sales_pcs: 0, // 進貨單位銷售量？？？ 
    retail_unit_sales_pcs: 0, // 進貨單位零售量 
    after_pcs: stock - sale_value, // 下班量：庫存 - 銷售
    sales_pcs: sale_value, // 銷售量
    total_sales: item_price * sale_value, // 銷售金額 價格 * 銷售量
    used_pcs: 0, // 檳榔原料使用量 庫存 - 工作量
    nut_package: 0, // 列印總包數
    nut_package_pcs: productList[i].unit_count, // 每包檳榔有多少顆
    unit: productList[i].inbount_unit, // 進貨單位
    inbound_unit_count: productList[i].inbound_unit_count // 進貨單位數量
  }
  workshiftDt_1.push(item)
}
