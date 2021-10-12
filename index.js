const mysql = require('mysql')
const express = require('express')

const app = express()
// const bodyparser = require('body-parser')
// app.use(bodyparser.json())
app.use(express.json()) // parse the incoming data -- middleware

require('dotenv').config()
let HOST = process.env.HOST
let USER = process.env.USER
let PASSWORD = process.env.PASSWORD
let DATABASE = process.env.DATABASE
let PORT = process.env.PORT

// database connection
const mysqlConnection = mysql.createConnection({
    host : HOST,
    user: USER,
    password : PASSWORD,
    database : DATABASE,
    port: PORT
})


mysqlConnection.connect((err) => {
    if(!err){
        console.log('database is connected')
    }
    else{
        console.log('database connection failed', JSON.stringify(err))
    }
})

app.listen(3600, () => {
    console.log('express is running')
})


app.get('/', (req,res) => {
    res.send('welcome to website')
})

// get all employees data
app.get('/employees', (req, res) => {
    mysqlConnection.query("SELECT * FROM testdb.persons", (err, rows, field) => {
        if(!err){
            // console.log(field)
            res.send(rows)
        }else{
            console.log(err)
        }
    })

})

// get employee data by id

app.get('/employee/:id', (req, res) => {
    mysqlConnection.query("SELECT * FROM testdb.persons WHERE personId = ?", [req.params.id], (err, rows, field) => {
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err)
        }
    })
})


// delete employee data by id

app.delete('/employee/:id', (req, res) => {

    let deletedItem;
    mysqlConnection.query("SELECT * FROM testdb.persons WHERE personId = ?", [req.params.id], (err, rows) => {
        if(!err){
            deletedItem = rows
        }
    })

    mysqlConnection.query("DELETE FROM testdb.persons WHERE personId = ?", [req.params.id], (err, rows) => {
        if(!err){
            res.send(deletedItem)
        }else{
            // console.log(err)
            res.send(err)
        }
    })
})

// insert employee data

app.post('/employee', (req, res) => {
    const body = req.body
    mysqlConnection.query("INSERT INTO testdb.persons (personId, firstName, city) values(?, ?, ?)", [body.personId, body.firstName, body.city], (err, rows, field) => {
        if(!err){
            // return the new added data
            mysqlConnection.query("SELECT * FROM testdb.persons WHERE personId = ?", [body.personId], (err, rows) => {
                if(!err){
                    res.send(rows)
                }
            })
        }
        else{
            res.send(err)
        }
    })
})

// update the employee data

app.put('/employee/:id', (req, res) => {
    const body = req.body, id = req.params.id
    mysqlConnection.query("UPDATE testdb.persons SET personId = ?, firstName = ?, city = ?  WHERE personId = ?", [body.personId, body.firstName, body.city, id] , (err, rows, field) => {
        if(!err){
            // return updated data
            mysqlConnection.query("SELECT * FROM testdb.persons WHERE personId = ?", [body.personId], (err, rows) => {
                if(!err){
                    res.send(rows)
                }
            })
            
        }
        else{
            res.send(err)
        }
    })
})


