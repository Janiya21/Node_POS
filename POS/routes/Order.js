const express = require('express')
const mysql = require('mysql')
const db = require('../config/db')

const connection = mysql.createConnection(db.database)
const router = express.Router()

connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Connected to the MYSQL server');
        var userTableQuery = "CREATE TABLE IF NOT EXISTS orders (orderId VARCHAR(255) PRIMARY KEY, date VARCHAR(255), customerId Varchar(255))"
        connection.query(userTableQuery, function(err,result){
            if(err) throw err;
            console.log(result);
            if(result.warningCount === 0){
                console.log('Order table created');
            }
        })
    }
})

connection.connect(function (err) {
    if(err){
        console.log(err);
    }else{
        let orderDetailQuery = "CREATE TABLE IF NOT EXISTS orderDetails(" +
            "    orderId VARCHAR(6)," +
            "    itemCode VARCHAR(6)," +
            "    orderQty int," +
            "    price DOUBLE," +
            "    CONSTRAINT PRIMARY KEY (orderId,itemCode)," +
            "    CONSTRAINT FOREIGN KEY (orderId) REFERENCES orders(orderId)," +
            "    CONSTRAINT FOREIGN KEY (itemCode) REFERENCES items(code)" +
            ");"
        connection.query(orderDetailQuery, function (err,result) {
            if(err) throw  err
            if(result.warningCount === 0){
                console.log('OrderDetail table created');
            }
        })
    }
})

router.get('/',(req, res) =>{
    const query = "SELECT * FROM orders";

    connection.query(query,(err,rows) =>{
        if(err) throw err

        res.send(rows)
    })
})

router.post('/',(req, res) =>{
    const orderId = req.body.orderId
    const date = req.body.date
    const customerId = req.body.customerId
    let orderDetail =[];
    orderDetail = req.body.orderDetail

    const query = "INSERT INTO orders (orderId, date, customerId) VALUES (?,?,?)";

    connection.query(query, [orderId, date, customerId], (err) =>{
        if(err){
            res.send({"message" : "This Order Already Exists"})
        }else{
            for(let i=0; i < orderDetail.length; i++){
                let orderId = orderDetail[i].orderId;
                let itemCode = orderDetail[i].itemCode;
                let orderQty = orderDetail[i].orderQty;
                let price = orderDetail[i].price;
                let orderDetailQuery = "INSERT INTO orderdetails (orderId,itemCode,orderQty,cost) VALUES (?,?,?,?)"

                connection.query(orderDetailQuery,[orderId, itemCode, orderQty, price], (err)=>{
                    if(err){
                        res.send({
                            message:err,
                        })
                    }else{
                        res.send({message : "Order successfully added!"})
                    }
                })
            }
        }
    })
})

router.put('/',(req, res) =>{
    const orderId = req.body.orderId
    const date = req.body.date
    const customerId = req.body.customerId

    var query = "UPDATE orders SET date=?, customerId=? WHERE orderId=?"

    connection.query(query, [date, customerId, orderId], (err,rows) =>{
        if(err) console.log(err);
        
        if(rows.affectedRows > 0){
            res.send({'message' : 'Order Updated'})
        }else{
            res.send({'message' : 'Order not found'})
        }
    })
})

router.delete('/:orderId', (req, res) => {
    const orderId = req.params.orderId

    var query = "DELETE FROM orders WHERE orderId=?";

    connection.query(query, [orderId], (err, rows) => {
        if (err) console.log(err);

        if (rows.affectedRows > 0) {
            res.send({ 'message': 'Order deleted' })
        } else {
            res.send({ 'message': 'Order not found' })
        }
    })
})

router.get('/:orderId', (req, res) => {
    const orderId = req.params.orderId

    var query = "SELECT * FROM orders WHERE orderId=?"

    connection.query(query, [orderId], (err, rows) => {
        if (err) console.log(err);

        res.send(rows)
    })
})

module.exports = router