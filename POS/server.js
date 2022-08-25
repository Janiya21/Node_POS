const express = require('express')
const customer = require('./routes/customer')
const item = require('./routes/item')
const user = require ('./routes/user')
const order = require ('./routes/Order')

const app = express()
const port = 4000