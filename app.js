const express = require('express')
const { engine } = require('express-handlebars')

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
app.use(express.static(__dirname + '/public'))


// db
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// page
app.get('/', menu.home) // home
app.get('/login', menu.login) // login
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


// get category and product
app.get('/api/getWorkShiftProductInfo/:store_id', api.getWorkShiftProductInfo)
app.get('/api/getProductName/:store_id/:category', api.getProductName)
// get product by workshift 
app.get('/api/getNutWorkInfo/:shift_id', api.getNutWorkInfo)
// get inbound information 
app.get('/api/getInboundInfo/:shift_id', api.getInboundInfo)

// post
app.post('/api/clockInAndOut', api.clockInAndOut)
app.post('/api/insertLabelPrint', api.insertLabelPrint)
app.post('/api/inserWorkShift', api.inserWorkShift)
app.post('/api/inserWorkShiftDt', api.inserWorkShiftDt)
app.post('/api/addproduct', api.addProduct)
app.post('/api/login', api.login)

//get user info
app.get('/api/userInfo/:token', api.userInfo)


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