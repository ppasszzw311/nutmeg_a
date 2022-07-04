const express = require('express')
const { engine } = require('express-handlebars')
const sassMiddleware = require('node-sass-middleware')
const path = require('path')



const PORT = process.env.PORT || '4400'

const app = express()
app.set('port', PORT)

// main js
const menu = require('./lib/handlers')
// set api
const api = require('./lib/api')

// set engine
app.engine('handlebars', engine ({extname:'.hbs', defultLayous: 'main', }))
app.set('view engine', 'handlebars')
app.set('views', './views')

// set public filedirect 
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
  })
)
app.use(express.static(__dirname + '/public'))


// db
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// page
app.get('/', menu.start) // home
app.get('/createMember', menu.createMember)
app.get('/login', menu.login) // login
app.get('/home', menu.home) // main
app.get('/checkin' ,menu.checkin) // checkin
app.get('/workshift', menu.workshift) // work shift
app.get('/printAndSale', menu.printAndSale)
app.get('/checkinList', menu.checkinList)
app.get('/purchase', menu.purchase)
app.get('/backend/manager', menu.manager)
app.get('/backend/saleRank', menu.saleRank)
app.get('/backend/monlyReport', menu.monlyReport)
app.get('/backend/itemData', menu.itemData)
app.get('/backend/errorfix', menu.errorfix)
app.get('/backend/record', menu.record)

// test 
app.get('/testcss', menu.pagetest)
app.get('/test/a', menu.test)
app.get('/test', menu.testwork)
app.get('/pagetest', menu.pp)



// get all 
app.get('/api/checkin', api.checkinAll)
app.get('/api/inbound', api.inboundAll)
app.get('/api/labelPrint', api.label_printAll)
app.get('/api/product', api.productsAll)
app.get('/api/store', api.storeAll)
app.get('/api/user', api.userAll)
app.get('/api/vendor', api.vendor)
app.get('/api/workshift', api.workshiftAll)
app.get('/api/workshiftDt', api.workshiftDtAll)


// post
app.get('/testPDF', api.testPDF)



app.post('/api/addproduct', api.addProduct)
app.post('/api/login', api.login)

//get user info
app.get('/api/userInfo/:token', api.userInfo)

//// from api doc by ming
// 01 workshift number now
app.get('/api/getCurrentWorkShiftId/:store_id', api.getCurrentWorkShiftId)
// 02 check in 
app.post('/api/clockInAndOut', api.clockInAndOut)
// 03 get product name 
app.get('/api/getProductName/:store_id/:category', api.getProductName)
app.get('/api/getProductName/:store_id', api.productNamebyStore)
// 03.1 get ingre Name
app.get('/api/getIngreName/:store_id', api.getIngreName)
// 04 instert a label
app.post('/api/insertLabelPrint', api.insertLabelPrint)
// 04.1 update stock
app.put('/api/updateStock', api.updateStock)
// 05 get category and product
app.get('/api/getProductInfo/:store_id', api.getProductInfo)
// 06 get product by workshift 
app.get('/api/getNutWorkInfo/:shift_id', api.getNutWorkInfo)
// 07 get inbound information 
app.get('/api/getInboundInfo/:shift_id', api.getInboundInfo)
// 08 insert work shift infomation
app.post('/api/inserWorkShift', api.inserWorkShift)
// 09 insert work shift detail
app.post('/api/inserWorkShiftDt', api.inserWorkShiftDt)
// 10 clock out 與02重複
// 11 in bound
app.post('/api/inbound', api.inbound)
// 11.1 updata in bound stock
app.post('/api/updateInBoundStock', api.updateInBoundStock)
// 12 get store
app.get('/api/getStore/:vendor_id', api.getStore)
// 13 get category
app.get('/api/getCategory/store_id', api.getCategory)
// 14 get all product stock
app.get('/api/getAllProductStock/:store_id', api.getAllProductStock)
// 15 get specific category stock
app.get('/api/getSpecificCategoryStock/:store_id/:category', api.getSpecificCategoryStock)
// 16 get all sale amount
app.get('/api/getAllSaleAmount/:vender_id/:start_time/:end_time', api.getAllSaleAmount)
// 17 get store sale amount
app.get('/api/getStoreSaleAmount/:store_id/:start_time/:end_time', api.getStoreSaleAmount)
// 18 get all sale order
app.get('/api/getAllSaleOrder/:vender_id/:start_time/:end_time', api.getAllSaleOrder)
// 19 get store sale order
app.get('/api/getStoreSaleOrder/:store_id/:start_time/:end_time', api.getStoreSaleOrder)
// 20 get all check out 
app.get('/api/getAllCheckOut/:vender_id/:year/:month', api.getAllCheckOut)
// 21 get store check out
app.get('/api/getStoreCheckOut/:store_id/:year/:month', api.getStoreCheckOut)
// 22 insert monthly cost
app.post('/api/insertMonthlyCost', api.insertMonthlyCost)
// 23 update monthly cost
app.post('/api/updateMonthlyCost', api.updateMonthlyCost)
// 24 get product list
app.get('/api/getProductList/:store_id', api.getProductList)
// 25 insert product list
app.post('/api/insertProductList', api.insertProductList)
// 26 update product list
app.post('/api/updateProductList', api.updateProductList)
// 27 delete Product List 
app.post('/api/deleteProductList', api.deleteProductList)

app.post('/api/createMember', api.createMember)


// 自訂404
app.use(menu.notFound)

// 自訂500 網頁
app.use(menu.serverError)

if(require.main === module) {
  app.listen(PORT, () => console.log(`
  Express started on http://localhost:${PORT}; `
  ))
} else {
  module.exports = app
}