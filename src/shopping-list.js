require('dotenv').config()
const knex = require('knex')
const ShoppingListService = require('./shoppinglist-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

console.log(ShoppingListService.getAllItems())