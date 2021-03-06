const db = require('../models/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//escpos
const escpos = require('escpos');

const PDF = require('pdfkit')
const fs = require('fs');
const { addListener } = require('process');

// get all
module.exports.checkinAll = (req, res) => {
  try {
    //const sql = 'SELECT * FROM check_in'
    //const sql = 'DELETE FROM check_in WHERE user is null'
    const sql = 'SELECT check_in.`store_id`, store.name, DATE(check_in.created_at) as checkinDate, Time(check_in.created_at) as checkinTime, class, user FROM check_in LEFT JOIN store ON check_in.`store_id` = store.id'
    db.query(sql, (err, result) => {
      const result1 = result
      res.json(result1)
    })
  } catch (err) {
    throw err;
  }
}
module.exports.inboundAll = (req, res) => {
  db.query('SELECT * FROM inbound', (err, result) => {
    if (err) throw err;
    const inboundAll = result
    res.json(inboundAll)
  })
}





module.exports.label_printAll = (req, res) => {
  db.query('SELECT * FROM label_print', (err, result) => {
    if(err) throw err;
    const labelPrint = result
    res.json(labelPrint)
  })
}
module.exports.productsAll = (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) throw err;
    const product = result
    res.json(product)
  })
}
module.exports.storeAll = (req, res) => {
  db.query('SELECT * FROM store', (err, result) => {
    if (err) throw err;
    const store = result
    res.json(store)
  })
}
module.exports.userAll = (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) throw err;
    const users = result;
    res.json(users)
  })
}
module.exports.vendor = (req, res) => {
  db.query('SELECT * FROM vendor', (err, result) => {
    if (err) throw err;
    const vendor = result
    res.json(vendor)
  })
}
module.exports.workshiftAll = (req, res) => {
  db.query('SELECT * FROM workshift', (err, result) => {
    if (err) throw err;
    const workShift = result
    res.json(workShift)
  })
}
module.exports.workshiftDtAll = (req, res) => {
  db.query('SELECT * FROM workshift_dt', (err, result) => {
    if (err) throw err;
    const workShift = result
    res.json(workShift)
  })
}

// api 01 ?????????????????? ???????????????????????????????????????
module.exports.getCurrentWorkShiftId = (req, res) => {
  const storeId = parseInt(req.params.store_id)
  const statusId = '??????'
  const sql = 'SELECT `created_at`, `user_id`, `user`, `store_id`, `class`, `status`, `shift_id` FROM `check_in` WHERE `store_id` = ? and `status` = ? ORDER by `created_at` DESC LIMIT 1'
  db.query(sql, [storeId, statusId], (err, result) => {
    if (err) throw err;
    const workshiftID = result
    res.json(workshiftID)
  })
}

// api 02 ????????????checkin
module.exports.clockInAndOut = (req, res) => {
  const userId = req.body.user_id
  const user = req.body.user
  const storeId = req.body.storeId
  const className = req.body.class
  const status = req.body.status
  let sql = 'INSERT INTO check_in (user_id, user, store_id, class, status) VALUES (?,?,?,?,?)'
  db.query(sql, [userId, user, storeId, className, status], (err, result) => {
    if (err) throw err
    console.log(storeId)
    db.query('SELECT `created_at`, `user_id`, `user`, `store_id`, `class`, `shift_id` FROM `check_in` WHERE `store_id` = ? ORDER by `created_at` DESC', storeId, (err, result) => {
      if (err) throw err
      const clockList = result
      res.json(clockList)
    })
  })
}

//  api 03 ???????????????????????????????????????
module.exports.getProductName = (req, res) => {
  const storeId = parseInt(req.params.store_id)
  const category = req.params.category
  db.query('SELECT id as product_id, name, inbound_unit, inbound_unit_count, stock, price, unit_count FROM products WHERE category = ? and store_id = ? and use_yn = 1', [category, storeId], (err, result) => {
    if (err) throw err;
    const productList = result
    res.json(productList)
  })
}

// api 03.0 ??????????????????????????????
module.exports.productNamebyStore = (req, res) => {
  const storeId = parseInt(req.params.store_id)
  db.query('SELECT id as product_id, name, category, price, stock,unit_count, inbound_unit, inbound_unit_count FROM products WHERE store_id = ? and use_yn = 1', storeId, (err, result) => {
    if (err) throw err;
    const productList = result
    res.json(productList)
  })
}

// api 3.1 ??????????????????
module.exports.getIngreName = (req, res) => {
  const storeId = parseInt(req.params.store_id)
  const category = '????????????'
  db.query('SELECT id as product_id, name FROM `products` WHERE category = ? and store_id = ? and use_yn = 1', [category, storeId], (err, result) => {
    if (err) throw err;
    const productList = result
    res.json(productList)
  })
}

// api 4 ????????????  ?????????????????????????????????????????????????????????????????????
module.exports.insertLabelPrint = (req, res) => {
  const labelData = {
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    store_id: req.body.store_id,
    class: req.body.class,
    user_id: req.body.user_id,
    user: req.body.user,
    package: req.body.package,
    piece: req.body.piece,
    total: req.body.total,
    broken: req.body.broken,
    shift_id: req.body.shift_id
  }

  let sql = 'INSERT INTO `label_print` (`product_id`,`product_name`,`store_id`,`class`,`user_id`,`user`,`package`,`piece`,`total`,`broken`,`shift_id`) VALUES(?,?,?,?,?,?,?,?,?,?,?)'
  console.log(labelData)
  db.query(sql, [labelData.product_id, labelData.product_name, labelData.store_id, labelData.class, labelData.user_id, labelData.user, labelData.package, labelData.piece, labelData.total, labelData.broken, labelData.shift_id], (err, result) => {
    if (err) throw err;
    let message = {
      status: 1
    }
    res.json(message)
  }
  )
}

// api 4.1 ???????????????????????????
module.exports.updateStock = (req, res) => {
  const product_id = parseInt(req.body.product_id)
  const product_name = req.body.product_name
  const inbound_stock = parseInt(req.body.inbound_stock)
  const sql = 'UPDATE `products` SET stock = ? WHERE id = ? and name =? '
  db.query(sql, [inbound_stock, product_id, product_name], (err, result) => {
    if (err) throw err;
    let message = {
      status: 1
    }
    res.json(message)
  })
}

// api 5 ??????????????????
module.exports.getProductInfo = (req, res) => {
  const storeId = req.params.store_id
  const sql = 'SELECT id as product_id,name,category,stock,price,unit,inbound_unit_count FROM bndb.products where store_id=? and use_yn=1'
  db.query(sql, storeId, (err, result) => {
    if (err) throw err;
    const productList = result
    res.json(productList)
    // product_id(int)??????????????? name(string)??????????????? stock(int)???????????? price(int)????????? unit(string)????????? inbound_unit_count(int)????????????????????? 
  })
}
// api 6????????????????????????
module.exports.getNutWorkInfo = (req, res) => {
  const shift_id = parseInt(req.params.shift_id)
  const sql = 'SELECT product_id,product_name,store_id,sum(package) as package,sum(broken) as broken,sum(total) as total FROM bndb.label_print where shift_id= ? group by product_id,product_name,store_id'
  db.query(sql, shift_id, (err, result) => {
    if (err) throw err;
    const workshift = result
    res.json(workshift)
    // product_id(int)??????????????? product_name(string)??????????????? store_id(int)???????????? package(int)????????? broken(int)??? ???????????? total(int)????????????
  })
}
// api 07 ??????????????????
module.exports.getInboundInfo = (req, res) => {
  const shift_id = req.params.shift_id
  const sql = 'SELECT product_id,product_name,store_id,category,sum(inbound_count) as inbound_count FROM bndb.inbound where shift_id=? group by store_id,product_id,product_name,category '
  db.query(sql, shift_id, (err, result) => {
    if (err) throw err;
    const inboundList = result
    res.json(inboundList)
    // product_id(int)??????????????? product_name(string)??????????????? product_id(int)???????????? inbound_count(int)???????????????

  })
}

// api 08 ????????????
module.exports.inserWorkShift = (req, res) => {
  const workShift = {
    store_id: req.body.store_id,
    class: req.body.class,
    user_id: req.body.user_id,
    user: req.body.user,
    operator: req.body.operator,
    successor: req.body.successor,
    handover_amount: req.body.handover_amount,
    shortage_amount: req.body.handover_amount,
    total_sales: req.body.total_sales,
    betelnut_sales: req.body.betelnut_sales,
    drinks_sales: req.body.drinks_sales,
    cigarette_sales: req.body.cigarette_sales,
    shift_id: req.body.shift_id
  }
  const sql = 'INSERT INTO `workshift` (`store_id`, `class`, `user_id`, `user`, `operator`, `successor`, `handover_amount`, `shortage_amount`, `total_sales`, `betelnut_sales`, `drinks_sales`, `cigarette_sales`, `shift_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
  db.query(sql, [workShift.store_id, workShift.class, workShift.user_id, workShift.user, workShift.operator, workShift.successor, workShift.handover_amount, workShift.shortage_amount, workShift.total_sales, workShift.betelnut_sales, workShift.drinks_sales, workShift.cigarette_sales, workShift.shift_id], (err, result) => {
    if (err) throw err;
    const message = {
      status: 1
    }
    res.json(message)
    // store_id(string):????????? class(string):??????(??????,??????,??????) user_id(string):??????????????? user(string):??????????????? operator(string):??????????????? successor(string):??????????????? handover_amount(string):???????????? shortage_amount(string):???????????? total_sales(string):???????????? betelnut_sales(string):??????????????? drinks_sales(string):??????????????? cigarette_sales(string):??????????????? shift_id(string):???????????? 
  })
}

//  api 09 ??????????????????
module.exports.inserWorkShiftDt = (req, res) => {
  const workshiftDt = {
    shift_id: req.body.shift_id,
    product_id: req.body.product_id,
    product_class: req.body.product_class,
    product_name: req.body.product_name,
    before_pcs: req.body.before_pcs,
    inbound_pcs: req.body.inbound_pcs,
    inbound_unit_sales_pcs: req.body.inbound_unit_sales_pcs,
    retail_unit_sales_pcs: req.body.retail_unit_sales_pcs,
    after_pcs: req.body.after_pcs,
    sales_pcs: req.body.sales_pcs,
    total_sales: req.body.total_sales,
    used_pcs: req.body.used_pcs,
    nut_package: req.body.nut_package,
    nut_package_pcs: req.body.nut_package_pcs,
    unit: req.body.unit,
    inbound_unit_count: req.body.inbound_unit_count
  }
  const sql = 'INSERT INTO `workshift_dt` (`shift_id`, `product_id`, `product_class`,  `product_name`, `before_pcs`, `inbound_pcs`, `inbound_unit_sales_pcs`, `retail_unit_sales_pcs`, `after_pcs`, `sales_pcs`, `total_sales`, `used_pcs`, `nut_package`, `nut_package_pcs`, `unit`, `inbound_unit_count`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  db.query(sql, [workshiftDt.shift_id, workshiftDt.product_id, workshiftDt.product_class, workshiftDt.product_name, workshiftDt.before_pcs, workshiftDt.inbound_pcs, workshiftDt.inbound_unit_sales_pcs, workshiftDt.retail_unit_sales_pcs, workshiftDt.after_pcs, workshiftDt.sales_pcs, workshiftDt.total_sales, workshiftDt.used_pcs, workshiftDt.nut_package, workshiftDt.nut_package_pcs, workshiftDt.unit, workshiftDt.inbound_unit_count], (err, result) => {
    if (err) throw err;
    const message = {
      status: 1
    }
    res.json(message)
    // shift_id(string):???????????? 
    //product_id(int):???????????? 
    // product_class(string):???????????? 
    // product_name(string):???????????? 
    // before_pcs(int):??????????????? 
    // inbound_pcs(int):???????????? 
    // inbound_unit_sales_pcs(int):????????????????????? 
    // retail_unit_sales_pcs(int):????????????????????? 
    // after_pcs(int):??????????????? 
    // sales_pcs(int):????????? 
    // total_sales(int):???????????? 
    // used_pcs(int):????????????????????????(????????????????????????????????????null) 
    // nut_package(int):???????????????????????? 
    // nut_package_pcs(int):?????????????????????????????? 
    // unit(string):???????????? 
    // inbound_unit_count(int):??????????????????
  })
}

// api 11 ????????????????????? 
module.exports.inbound = (req, res) => {
  const inboundValue = {
    store_id: req.body.store_id,
    store_name: req.body.store_name,
    category: req.body.category,
    product_name: req.body.product_name,
    product_id: req.body.product_id,
    inbound_count: req.body.inbound_count,
    inbound_unit: req.body.inbound_unit,
    inbound_unit_count: req.body.inbound_unit_count,
    shift_id: req.body.shift_id
  }
  console.log(inboundValue)
  const sql = "INSERT INTO `bndb`.`inbound` (`store_id`,`store_name`,`category`,`product_name`,`product_id`,  `inbound_count`, `inbound_unit`, `inbound_unit_count`,`shift_id`) VALUES(?,?,?,?,?,?,?,?,?)"
  db.query(sql, [inboundValue.store_id, inboundValue.store_name, inboundValue.category, inboundValue.product_name, inboundValue.product_id, inboundValue.inbound_count, inboundValue.inbound_unit, inboundValue.inbound_unit_count, inboundValue.shift_id], (err, result) => {
    if (err) {
      console.log('sql error', err)
    } else {
      console.log("success")
    }
  })
}

// api 11.1 ???????????????
module.exports.updateInBoundStock = (req, res) => {
  const id = req.body.product_id
  const newstock = req.body.stock
  const inbound_unit_count = req.body.inbound_unit_count
  db.query("SELECT stock FROM products WHERE id = ?", id, (err, result) => {
    if (err) throw err;
    let stock = result[0].stock
    stock = stock + (newstock * inbound_unit_count)
    console.log("??????" + stock)
    db.query("UPDATE products SET stock=?  where id=? ", [stock, id], (err, result) => {
      if (err) throw err;
      const message = { status: 1 }
      res.json(message)
    })
  })
  // update bndb.products set stock=stock+25  where id=10 and name="??????"
}

// api 12 ????????????
module.exports.getStore = (req, res) => {
  const vendor_id = parseInt(req.params.vendor_id)
  const sql = 'SELECT id AS store_id, name AS store_name FROM store WHERE vendor_id = ?'
  db.query(sql, vendor_id, (err, result) => {
    if (err) throw err;
    let list = result
    res.json(list)
  })
}

// api 13 ????????????
module.exports.getCategory = (req, res) => {
  const store_id = req.params.store_id
  const sql = 'SELECT DISTINCT category FROM products WHERE use_yn = 1 AND store_id = ?'
  db.query(sql, store_id, (err, result) => {
    if (err) throw err;
    let category = result
    res.json(category)
  })
}

// api 14 ?????????????????????
module.exports.getAllProductStock = (req, res) => {
  const storeId = req.params.store_id
  let SQL = 'SELECT category, name, stock FROM bndb.products WHERE store_id = ? AND use_yn = 1'
  db.query(SQL, storeId, (err, result) => {
    if (err) throw err;
    let stockList = result
    res.json(stockList)
  })
}

// api 15 ??????????????????????????????
module.exports.getSpecificCategoryStock = (req, res) => {
  const storeId = req.params.store_id
  const category = req.params.category
  const SQL = 'SELECT catagory, name sotck FROM bndb.products where store_id = ? and category = ?and use_yn = 1'
  db.query(SQL, [storeId, category], (err, result) => {
    if (err) throw err;
    let stockList = result
    res.json(stockList)
  })
}

// api 16 ??????????????????????????????
module.exports.getAllSaleAmount = (req, res) => {
  const vender_id = req.params.vender_id
  const start_time = req.params.start_time
  const end_time = req.params.end_time
  const SQL = 'with shift_id as (SELECT shift_id FROM bndb.workshift where store_id in (select id FROM bndb.store where vendor_id = ?) and date(created_at) >= ? and date(created_at) <= ? ) , sales as( SELECT  store_id, sum(m.betelnut_sales) as betelnut_sales, sum(m.drinks_sales) as drinks_sales, sum(m.cigarette_sales) as cigarette_sales, sum(m.total_sales) as total_sales, sum(m.others_sales) as others_sales FROM bndb.workshift as m join shift_id on m.shift_id = shift_id.shift_id group by store_id ), betelnut_count as( select m.store_id, sum(sales_pcs) as nut_sales_pcs from bndb.workshift as m join bndb.workshift_dt as dt on m.shift_id = dt.shift_id join shift_id on dt.shift_id = shift_id.shift_id where dt.product_class = "??????" group by m.store_id )select sales.store_id, nut_sales_pcs, betelnut_sales, drinks_sales, cigarette_sales, total_sales from sales left join betelnut_count on sales.store_id = betelnut_count.store_id'
  db.query(SQL, [vender_id, start_time, end_time], (err, result) => {
    if (err) throw err;
    const saleAmount = result
    res.json(saleAmount)
  })
}

// api 17 ????????????????????????
module.exports.getStoreSaleAmount = (req, res) => {
  const store_id = req.params.store_id
  const start_time = req.params.start_time
  const end_time = req.params.end_time
  const SQL = `with shift_id as 
    (
    SELECT shift_id
    FROM bndb.workshift
    where store_id = ? and date(created_at)>= ? and date(created_at)<= ? 
    ) , sales as 
    (
    SELECT 
    store_id,sum(m.betelnut_sales) as betelnut_sales, 
    sum(m.drinks_sales) as drinks_sales,
    sum(m.cigarette_sales) as cigarette_sales,
    sum(m.others_sales) as others_sales,
    sum(m.total_sales) as total_sales
    FROM bndb.workshift as m 
    join shift_id on m.shift_id=shift_id.shift_id
    group by store_id 
    ), betelnut_count as 
    (
    select m.store_id,sum(sales_pcs) as nut_sales_pcs
    from 
    bndb.workshift as m 
    join bndb.workshift_dt as dt on m.shift_id=dt.shift_id
    join shift_id on dt.shift_id=shift_id.shift_id
    where dt.product_class='??????' 
    group by m.store_id 
    )
    select sales.store_id,nut_sales_pcs,betelnut_sales,drinks_sales,cigarette_sales,total_sales
    from sales left join betelnut_count on sales.store_id=betelnut_count.store_id
    `
  db.query(SQL, [store_id, start_time, end_time], (err, result) => {
    if (err) throw err;
    const storeSaleAmount = result
    res.json(storeSaleAmount)
  })
}

// api 18 ??????????????????????????????
module.exports.getAllSaleOrder = (req, res) => {
  const vender_id = req.params.vender_id
  const start_time = req.params.start_time
  const end_time = req.params.end_time
  const SQL = `with shift_id as 
    (
    SELECT shift_id
    FROM bndb.workshift
    where store_id in (select id FROM bndb.store where vendor_id=?) and date(created_at)>=? and date(created_at)<=?
    )   
    select row_number() over (order by total_sales desc) row_num, product_name,total_sales
    from 
    (
    SELECT product_name,sum(total_sales) as total_sales
    FROM bndb.workshift_dt as dt 
    join shift_id on dt.shift_id=shift_id.shift_id
    group by product_name
    ) as t 
    order by total_sales desc
    `
  db.query(SQL, [vender_id, start_time, end_time], (err, result) => {
    if (err) throw err
    const saleOrder = result
    res.json(saleOrder)
  })
}

// api 19 ??????????????????????????????
module.exports.getStoreSaleOrder = (req, res) => {
  const store_id = req.params.store_id
  const start_time = req.params.start_time
  const end_time = req.params.end_time
  const SQL = `with shift_id as 
    (
    SELECT shift_id
    FROM bndb.workshift
    where store_id = ? and date(created_at)>=? and date(created_at)<= ?
    )
    select row_number() over (order by total_sales desc) row_num, product_name,total_sales
    from 
    (
    SELECT product_name,sum(total_sales) as total_sales
    FROM bndb.workshift_dt as dt 
    join shift_id on dt.shift_id=shift_id.shift_id
    group by product_name
    ) as t 
    order by total_sales desc
    `
  db.query(SQL, [store_id, start_time, end_time], (err, result) => {
    if (err) throw err;
    const storeOrder = result
    res.json(storeOrder)
  })
}

// api 20 ???????????????????????????
module.exports.getAllCheckOut = (req, res) => {
  const vender_id = req.params.vender_id
  const year = req.params.year
  const month = req.params.month
  const SQL = `
   with income as 
   (
   SELECT 
   year(created_at) as year,month(created_at) as month,
   store_id,
   sum(m.betelnut_sales) as betelnut_sales, 
   sum(m.drinks_sales) as drinks_sales,
   sum(m.cigarette_sales) as cigarette_sales,
   sum(m.others_sales) as others_sales
   FROM bndb.workshift as m 
   where store_id in (select id FROM bndb.store where vendor_id=?) and year(created_at)=? and month(created_at)=? 
   group by year(created_at),month(created_at),store_id
   ) 
   select income.*,inbound_cost,rent,salary,electricity_bill,water_bill,internet_bill,others
   from income left join bndb.monthly_cost as mc on income.store_id=mc.store_id and income.year=mc.year and income.month=mc.month
   `
  db.query(SQL, [vender_id, year, month], (err, result) => {
    if (err) throw err;
    const checkOut = result
    res.json(checkOut)
  })
}

// api 21 ????????????????????????
module.exports.getStoreCheckOut = (req, res) => {
  const store_id = req.params.store_id
  const year = req.params.year
  const month = req.params.month
  const SQL = `
    with income as 
  (
  SELECT 
  year(created_at) as year,month(created_at) as month,
  store_id,
  sum(m.betelnut_sales) as betelnut_sales, 
  sum(m.drinks_sales) as drinks_sales,
  sum(m.cigarette_sales) as cigarette_sales,
  sum(m.others_sales) as others_sales
  FROM bndb.workshift as m 
  where store_id =?  and year(created_at)=? and month(created_at)=? 
  group by year(created_at),month(created_at),store_id
  ) 
  select income.*,inbound_cost,rent,salary,electricity_bill,water_bill,internet_bill,others
  from income left join bndb.monthly_cost as mc on income.store_id=mc.store_id and income.year=mc.year and income.month=mc.month
  `
  db.query(SQL, [store_id, year, month], (err, result) => {
    if (err) throw err;
    const StoreCheckOut = result
    res.json(StoreCheckOut)
  })
}

// api 22 ????????????????????????
module.exports.insertMonthlyCost = (req, res) => {
  const monthly_cost = {
    year: req.body.year,
    month: req.body.month,
    store_id: req.body.store_id,
    inbound_cost: req.body.inbound_cost,
    rent: req.body.rent,
    salary: req.body.salary,
    electricity_bill: req.body.electricity_bill,
    water_bill: req.body.water_bill,
    internet_bill: req.body.internet_bill,
    others: req.body.others
  }
  const SQL = 'INSERT INTO `bndb`.`monthly_cost`(`year`,`month`,`store_id`,`inbound_cost`,`rent`,`salary`,`electricity_bill`,`water_bill``internet_bill`,`others`) VALUES (?,?,?,?,?,?,?,?,?,?);'
  db.query(SQL, [monthly_cost.year, monthly_cost.month, monthly_cost.store_id, monthly_cost.inbound_cost, monthly_cost.rent, monthly_cost.salary, monthly_cost.electricity_bill, monthly_cost.water_bill, monthly_cost.internet_bill, monthly_cost.others], (err, result) => {
    if (err) throw err;
    const status = 1
    res.json(status)
  })
}

// api 23 ?????????????????????
module.exports.updateMonthlyCost = (req, res) => {
  const monthly_cost = {
    year: req.body.year,
    month: req.body.month,
    store_id: req.body.store_id,
    inbound_cost: req.body.inbound_cost,
    rent: req.body.rent,
    salary: req.body.salary,
    electricity_bill: req.body.electricity_bill,
    water_bill: req.body.water_bill,
    internet_bill: req.body.internet_bill,
    others: req.body.others
  }
  const SQL = 'UPDATE `bndb`.`monthly_cost` SET `rent` = ?, `salary` = ?,`inbound_cost` = ?, `electricity_bill` = ?,`water_bill` = ?, `internet_bill` = ?,`others` = ? WHERE year=? and month=? and store_id=?'
  db.query(SQL, [monthly_cost.rent, monthly_cost.salary, monthly_cost.inbound_cost, monthly_cost.electricity_bill, monthly_cost.water_bill, monthly_cost.internet_bill, monthly_cost.others, monthly_cost.year, monthly_cost.month, monthly_cost.store_id], (err, result) => {
    if (err) throw err;
    const status = 1
    res.json(status)
  })
}

// api 24 ??????????????????
module.exports.getProductList = (req, res) => {
  const store_id = req.params.store_id
  const SQL = `SELECT id,category,name,barcode,cost,price,unit,unit_count,inbound_unit,inbound_unit_count FROM bndb.products where store_id=?`
  db.query(SQL, store_id, (err, result) => {
    if (err) throw err;
    const productList = result
    res.json(productList)
  })
}

// api 25 ??????????????????
module.exports.insertProductList = (req, res) => {
  const new_product = {
    id: req.body.id,
    store_id: req.body.store_id,
    name: req.body.name,
    category: req.body.category,
    barcode: req.body.barcode,
    cost: req.body.cost,
    price: req.body.price,
    unit: req.body.unit,
    unit_count: req.body.unit_count,
    stock: req.body.stock,
    use_yn: req.body.use_yn,
    inbound_unit: req.body.inbound_unit,
    inbound_unit_count: req.body.inbound_unit_count
  }
  const SQL = 'INSERT INTO `bndb`.`products`(`id`,`store_id`, `name`, `category`,`barcode`,`cost`,`price`,`unit`,`unit_count`,`stock`,`use_yn`,`inbound_unit`,`inbound_unit_count`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
  db.query(SQL, [new_product.id, new_product.store_id, new_product.name, new_product.category, new_product.barcode, new_product.cost, new_product.price, new_product.unit, new_product.unit_count, new_product.stock, new_product.use_yn, new_product.inbound_unit, new_product.inbound_unit_count], (err, result) => {
    if (err) throw err;
    const status = 1
    res.json(status)
  })
}

// api 26 ??????????????????
module.exports.updateProductList = (req, res) => {
  const new_product = {
    id: req.body.id,
    store_id: req.body.store_id,
    name: req.body.name,
    category: req.body.category,
    barcode: req.body.barcode,
    cost: req.body.cost,
    price: req.body.price,
    unit: req.body.unit,
    unit_count: req.body.unit_count,
    stock: req.body.stock,
    use_yn: req.body.use_yn,
    inbound_unit: req.body.inbound_unit,
    inbound_unit_count: req.body.inbound_unit_count
  }
  const SQL = 'UPDATE `bndb`.`products` SET `name` = ?, `category` = ?, `barcode` = ?, `cost` = ?, `price` = ?, `unit` = ?, `unit_count` = ?, `stock` = ?, `use_yn` = ?, `inbound_unit` = ?, `inbound_unit_count` = ? WHERE`id` = ?  AND`store_id` = ?;'
  db.query(SQL, [new_product.name, new_product.category, new_product.barcode, new_product.cost, new_product.price, new_product.unit, new_product.unit_count, new_product.stock, new_product.use_yn, new_product.inbound_unit, new_product.inbound_unit_count, new_product.id, new_product.store_id], (err, result) => {
    if(err) throw err;
    const status = 1
    res.json(status)
  })
}

// api 27 ??????????????????
module.exports.deleteProductList = (req, res) => {
  const product_id = req.body.product_id
  const store_id = req.body.store_id
  const SQL = 'DELETE FROM `bndb`.`products` WHERE`id` = ?  AND`store_id` = ?'
  db.query(SQL, [product_id, store_id], (err, result) => {
    if(err) throw err;
    const status = 1
    res.json(status)
  })
}

// create member 
module.exports.createMember = (req, res) => {
  const idnum = req.body.idnum
  const password = req.body.password
  // ???????????????
  const name = req.body.name
  const phone = req.body.phone 
  const address = req.body.address
  const saltRounds = 10
  bcrypt.hash(password, saltRounds, function(err, hash) {
      let saltPassword = hash
    db.query("SELECT * FROM users WHERE id = ?", idnum, (err, result) => {
      if (err) {
        console.log("SQL ERROR", err)
      } else if (Object.keys(result).length === 0) {
        // ????????????
        const sql = "INSERT INTO users (`id`, `password`,  `name`, `phone`, `address`) VALUES(?,?,?,?,?)"
        db.query(sql, [idnum, saltPassword, name, phone, address], (err, result) => {
          if (err) throw err;
          const message ={ 
            status : 1
          }
          res.json(status)
        })
      } else {
        const message = {
          status: `has same id in database:`,
        }
        res.json(message)
      }
    })
    })
}


// login 
module.exports.login = (req, res) => {
  const idnum = req.body.idnum
  const userPassword = req.body.password
  db.query('SELECT * FROM users WHERE id = ?', idnum, (err, result) => {
    if (err) {
      console.log('SQL error', error)
    } else if (Object.keys(result).length === 0) {
      const message = {
        ststus: 'no id number'
      }
      res.json(message)
    } else {
      const dbHashPassword = result[0].password
      bcrypt.compare(userPassword, dbHashPassword).then((response) => {
        if (response) { // ??????
          // ??????jwt
          const payload = {
            user_id: result[0].id,
            user_name: result[0].name
          }
          const token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, 'nut_manager');
          console.log('req.body', req.body, 'token', token)
          let na = [{
            status: "success login",
            idnum: idnum,
            password: userPassword,
            token: token
          }]
          res.json(na)
        } else {
          let message = {
            status: "????????????"
          }
          res.json(message)
        }
      })
    }
  })
}

// get user 
module.exports.userInfo = (req, res) => {
  const token = req.params.token
  const SECRET = 'nut_manager'
  const decoded = jwt.verify(token, SECRET)
  const user_id = decoded.payload.user_id
  db.query('SELECT store_id from users WHERE id = ?', user_id, (err, result) => {
    if (err) throw err;
    let storeid = result[0].store_id
    const userinfo = {
      user_id: decoded.payload.user_id,
      user_name: decoded.payload.user_name,
      store_id: storeid
    }
    res.json(userinfo)
  })


}

// get itemEdit 


// get store


// get checkin list
// module.exports.checkinlist

// insert product 
module.exports.addProduct = (req, res) => {
  const store_id = req.body.store_id // ??????
  const product_name = req.body.name  // ??????
  const category = req.body.category // ??????
  const cost = req.body.cost // ??????
  const price = req.body.price // ??????
  const unit = req.body.unit // ??????
  const unit_count = req.body.unit_count // ????????????
  const use_yn = req.body.use_yn // ????????????
  const sql = 'INSERT INTO products (`store_id`, `name`, `category`, `cost`, `price`, `unit`, `unit_count`, `use_yn`) VALUES (?,?,?,?,?,?,?,?)'
  db.query(sql, [store_id, product_name, category, cost, price, unit, unit_count, use_yn], (err, result) => {
    if (err) throw err;
    const message = {
      status: 1
    }
    res.json(message)
  })
}


module.exports.testPDF = (req, res) => {
  // ???????????? PDF (????????????????????????????????????????????? pt???
  // ?????? size ?????????????????????????????????????????????????????? error
  const doc = new PDF({
    size: [114, 85],
    margin: 0
  })
  doc.fontSize(20).text(`TEST`, 0, 35, { align: 'center' })
  doc.pipe(fs.createWriteStream('./test.pdf'))
  doc.end()
  console.log(doc)
}

