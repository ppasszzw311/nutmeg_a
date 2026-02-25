const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'sqlite.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log('Initializing SQLite Database schema...');

    db.run(`CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255),
    name VARCHAR(255),
    phone VARCHAR(255),
    address TEXT,
    store_id INT
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS store (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    vendor_id INT
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS vendor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255)
  )`);

    // MySQL specific queries use bndb.products, let's just make the tables here anyway
    db.run(`CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY,
    store_id INT,
    name VARCHAR(255),
    category VARCHAR(255),
    barcode VARCHAR(255),
    cost INT,
    price INT,
    unit VARCHAR(50),
    unit_count INT,
    stock INT,
    use_yn INT,
    inbound_unit VARCHAR(50),
    inbound_unit_count INT
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS check_in (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(255),
    user VARCHAR(255),
    store_id INT,
    class VARCHAR(50),
    status VARCHAR(50),
    shift_id VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS workshift (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id INT,
    class VARCHAR(50),
    user_id VARCHAR(255),
    user VARCHAR(255),
    operator VARCHAR(255),
    successor VARCHAR(255),
    handover_amount INT,
    shortage_amount INT,
    total_sales INT,
    betelnut_sales INT,
    drinks_sales INT,
    cigarette_sales INT,
    others_sales INT DEFAULT 0,
    shift_id VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS workshift_dt (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shift_id VARCHAR(100),
    product_id INT,
    product_class VARCHAR(255),
    product_name VARCHAR(255),
    before_pcs INT,
    inbound_pcs INT,
    inbound_unit_sales_pcs INT,
    retail_unit_sales_pcs INT,
    after_pcs INT,
    sales_pcs INT,
    total_sales INT,
    used_pcs INT,
    nut_package INT,
    nut_package_pcs INT,
    unit VARCHAR(50),
    inbound_unit_count INT
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS inbound (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shift_id VARCHAR(100),
    store_id INT,
    store_name VARCHAR(255),
    category VARCHAR(255),
    product_name VARCHAR(255),
    product_id INT,
    inbound_count INT,
    inbound_unit VARCHAR(50),
    inbound_unit_count INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS label_print (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shift_id VARCHAR(100),
    product_id INT,
    product_name VARCHAR(255),
    store_id INT,
    class VARCHAR(50),
    user_id VARCHAR(255),
    user VARCHAR(255),
    package INT,
    piece INT,
    total INT,
    broken INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS monthly_cost (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INT,
    month INT,
    store_id INT,
    inbound_cost INT,
    rent INT,
    salary INT,
    electricity_bill INT,
    water_bill INT,
    internet_bill INT,
    others INT
  )`);

    console.log('Tables created successfully.');

    // Create admin user
    const adminId = 'admin';
    const plainPassword = 'admin';
    const saltRounds = 10;

    db.get("SELECT id FROM users WHERE id = ?", [adminId], (err, row) => {
        if (!row) {
            bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
                db.run("INSERT INTO users (id, password, name, store_id) VALUES (?, ?, ?, ?)", [adminId, hash, 'System Admin', 1], (err) => {
                    if (!err) console.log('Admin user seeded (id: admin, password: admin)');
                });
            });
        }
    });

    db.get("SELECT id FROM store WHERE id = 1", (err, row) => {
        if (!row) {
            db.run("INSERT INTO store (id, name, vendor_id) VALUES (1, 'Test Store', 1)");
            console.log('Store seeded');
        }
    });
});

setTimeout(() => {
    db.close();
    console.log('Init ended.');
}, 2000);
