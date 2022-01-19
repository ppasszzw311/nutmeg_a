require('dotenv').config()

module.exports = {
    mysqlinfo: {
      host: process.env.HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      port: process.env.PORT
    }
}