const mysql = require('mysql-await')
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
    
const mysqlConnection =  mysql.createConnection({
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
app.get('/employees', async(req, res) => {
    try{
        const result = await mysqlConnection.awaitQuery("SELECT * FROM testdb.persons")
        res.status(200).send(result)
    } catch(error){
        console.log({error})
        res.status(500).send(error.message)
    }
})

// get employee data by id

app.get('/employee/:id', async(req, res) => {
    try{
        const result = await mysqlConnection.awaitQuery("SELECT * FROM testdb.persons WHERE personId = ?", [req.params.id])
        res.status(200).send(result)
    } catch(error){
        console.log({error})
        res.status(500).send(error.message)
    }    
})


// delete employee data by id

app.delete('/employee/:id', async(req, res) => {
    try{
       const result = await mysqlConnection.awaitQuery("DELETE FROM testdb.persons WHERE personId = ?", [req.params.id])
       res.status(200).send(result)
    } catch(error){
        console.log({error})
        res.status(500).send(error.message)
    }
})

// insert employee data

app.post('/employee', async(req, res) => {
    const body = req.body
    try{
        const result = await mysqlConnection.awaitQuery("INSERT INTO testdb.persons (personId, firstName, city) values(?, ?, ?)", [body.personId, body.firstName, body.city])
        res.status(200).send(result)
    } catch(error){
        console.log({error})
        res.status(500).send(error.message)
    }
})

// update the employee data

app.put('/employee/:id', async(req, res) => {
    const body = req.body, id = req.params.id
    try{
        const result = await mysqlConnection.awaitQuery("UPDATE testdb.persons SET personId = ?, firstName = ?, city = ?  WHERE personId = ?", [body.personId, body.firstName, body.city, id])
        res.status(200).send(result)
    } catch(error){
        console.log({error})
        res.status(500).send(error.message)
    }
        
})


