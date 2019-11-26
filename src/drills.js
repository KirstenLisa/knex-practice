require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
  })

function searchList(searchTerm) {
    knexInstance
      .select('*')
      .from('shopping_list')
      .where('name', 'ILIKE', `%${searchTerm}%`)
      .then(result => {
        console.log('SEARCH')
        console.log(result)
      })
  }

  searchList('carne')


function paginateProducts(pageNumber) {
    const productsPerPage = 6
    const offset = productsPerPage * (pageNumber - 1)
    knexInstance
      .select('name', 'price', 'date_added', 'checked', 'category')
      .from('shopping_list')
      .limit(productsPerPage)
      .offset(offset)
      .then(result => {
        console.log('PAGINATE')
        console.log(result)
      })
  }

  paginateProducts(2)

  function itemsAddedAfterDate(daysAgo) {
    knexInstance
      .select('name')
      .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
      )
      .from('shopping_list')
      .then(result => {
        console.log('ITEMS ADDED AFTER...')
        console.log(result)
      })
  }

  itemsAddedAfterDate(3)

  function totalCost() {
      knexInstance
        .select('category')
        .sum('price AS total_price')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log('TOTAL PRICE PER CATEGORY')
            console.log(result)
        })
  }

  totalCost()