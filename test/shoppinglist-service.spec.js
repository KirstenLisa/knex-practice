const ShoppingListService = require('../src/shoppinglist-service')
const knex = require('knex')

describe(`Shopping-list service object`, function() {

    let db
    
    let testItems = [
        {
        product_id: 1,
        name: 'First test item',
        price: '13.10',
        category: 'Main',
        checked: false,
        date_added: new Date('2019-01-22T16:28:32.615Z'),
        },
        {
        product_id: 2,
        name: 'Second test item',
        price: '1.90',
        category: 'Snack',
        checked: true,
        date_added: new Date('2012-01-22T16:28:32.615Z'),
        },
        {
        product_id: 3,
        name: 'Third test item',
        price: '5.90',
        category: 'Lunch',
        checked: true,
        date_added: new Date('1919-12-22T16:28:32.615Z'),
        },
           ]

      before(() => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB,
        })
      })

      before(() => db('shopping_list').truncate())

      afterEach(() => db('shopping_list').truncate())

      after(() => db.destroy())

      context(`Given 'shopping_list' has data`, () => {
          beforeEach(() => {
            return db
              .into('shopping_list')
              .insert(testItems)
          })
          it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
        // test that ShoppingListService.getAllItems gets data from table
            return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql(testItems.map(item => ({
                ...item,
                date_added: new Date(item.date_added)
                })))
                        })
          })

          it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const idToGet = 3
            const thirdItem = testItems[idToGet - 1]
            return ShoppingListService.getById(db, idToGet)
              .then(actual => {
                expect(actual).to.eql({
                  product_id: idToGet,
                  name: thirdItem.name,
                  date_added: thirdItem.date_added,
                  price: thirdItem.price,
                  category: thirdItem.category,
                  checked: thirdItem.checked,
                })
              })
          })

          it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                const expected = testItems
                .filter((item) => item.product_id !== itemId)
                expect(allItems).to.eql(expected)
            })
        })

        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
            name: 'updated name',
            price: '99.99',
            category: 'Snack',
            checked: false,
            date_added: new Date(),
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                    product_id: idOfItemToUpdate,
                    ...newItemData,
               })
          })
    })

        })

        context(`Given 'shopping_list' has no data`, () => {
            it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
            .then(actual => {
            expect(actual).to.eql([])
            })
            })
        })

            it(`insertItem() inserts an item and resolves the item with an 'id'`, () => {
                const newItem = {
                name: 'Test new item',
                price: '9.99',
                category: 'Breakfast',
                checked: true,
                date_added: new Date('2020-01-01T00:00:00.000Z'),
              }
              return ShoppingListService.insertItem(db, newItem)
              .then(actual => {
                 expect(actual).to.eql({
                    product_id: 1,
                    name: newItem.name,
                    price: newItem.price,
                    category: newItem.category,
                    checked: newItem.checked,
                    date_added: newItem.date_added,
                 })
               })
             })

         

    })
  