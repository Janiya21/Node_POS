const express = require('express')
const mysql = require('mysql2')
const db = require('../config/db')

const connection = mysql.createConnection(db.database)
const router = express.Router()

connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Connected to the MYSQL server');
        var userTableQuery = "CREATE TABLE IF NOT EXISTS customer (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), address Varchar(255), salary double)"
        connection.query(userTableQuery, function(err,result){
            if(err) throw err;
            console.log(result);
            if(result.warningCount === 0){
                console.log('Customer table created');
            }
        })
    }
})

router.get('/',(req, res) =>{   
    var query = "SELECT * FROM customer"

    connection.query(query,(err,rows) =>{
        if(err) throw err

        res.send(rows)
    })
})

router.post('/',(req, res) =>{
    const id = req.body.id
    const name = req.body.name
    const address = req.body.address
    const salary = req.body.salary
     
    var query = "INSERT INTO customer (id, name, address, salary) VALUES (?,?,?,?)"

    connection.query(query, [id, name, address, salary], (err) =>{
        if(err){
            res.send({"message" : "This customer is already Exists"})
        }else{
            res.send({"message" : "Customer succesfully added!"})
        }
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    var query = "SELECT * FROM customer WHERE id=?"

    connection.query(query, [id], (err, rows) => {
        if (err) console.log(err);

        res.send(rows)
    })
})

router.put('/',(req, res) =>{
    const id = req.body.id
    const name = req.body.name
    const address = req.body.address
    const salary = req.body.salary

    var query = "UPDATE customer SET name=?, address=?, salary=? WHERE id=?"

    connection.query(query, [name, address, salary, id], (err,rows) =>{
        if(err) console.log(err);
        
        if(rows.affectedRows > 0){
            res.send({'message' : 'Customer Updated'})
        }else{
            res.send({'message' : 'Not such a customer found'})
        }
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id

    var query = "DELETE FROM customer WHERE id=?";

    connection.query(query, [id], (err, rows) => {
        if (err) console.log(err);

        if (rows.affectedRows > 0) {
            res.send({ 'message': 'Customer deleted' })
        } else {
            res.send({ 'message': 'Not such a customer found' })
        }
    })
})

module.exports = router