const express = require('express')
const customer = require('./routes/customer')
const item = require('./routes/item')
const order = require('./routes/Order')

const app = express()
const port = 4000

app.use(express.json())
app.use('app/api/customer', customer)
app.use('app/api/items', item)
app.use('app/api/orders',order)


app.listen(port, () => {
    console.log(`app starting on ${port}`);
})