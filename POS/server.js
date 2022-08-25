const express = require('express')
const customer = require('./routes/customer')
const item = require('./routes/item')
const order = require('./routes/Order')

const app = express()
const port = 3000

app.use(express.json())
app.use('/customer', customer)
app.use('/items', item)
app.use('/orders',order)


app.listen(port, () => {
    console.log(`app starting on ${port}`);
})