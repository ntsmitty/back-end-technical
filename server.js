const express = require('express')

const db_config = require('./config/db_config');

const connection = require('./helpers/db/db_connection');
const query = require('./helpers/db/db_query');

const find_sub_lengths = require('./helpers/get_roll_sub_lengths');
const string_to_decimal_length = require('./helpers/string_to_decimal_length')
const get_sum = require('./helpers//get_sum')


const app = express()
const port = 3000; 


const next_to_print = {}

const query_pending_rush_items = 
`SELECT orders.order_date, 
    lineitems.rush, 
    lineitems.sku,
    components.id,
    components.status, 
    components.size
 FROM orders
    INNER JOIN lineitems 
        ON lineitems.order_id = orders.id
    INNER JOIN components
        ON components.line_item_id = lineitems.id
    WHERE components.status="Pending" AND lineitems.rush=true
    ORDER BY orders.order_date ASC` 

 const query_priority_components = 
 `SELECT orders.order_date, 
    lineitems.rush, 
    lineitems.sku,
    components.id,
    components.status, 
    components.size
  FROM orders
    INNER JOIN lineitems 
        ON lineitems.order_id = orders.id
    INNER JOIN components
        ON components.line_item_id = lineitems.id
    WHERE components.status="Pending" AND lineitems.rush=false
    ORDER BY orders.order_date ASC` 

app.param(['roll_length', 'rush'], async (req, res, next) => {
    return next();
})

app.get('/v1/order/:roll_length/:rush', async (req, res) => {
    const rush_order_lengths = []
    const plan = []
    let priority_components;
    let pending_priority_components;
    let rush_components;
    const { rush, roll_length } = req.params
    // starts db connection
    const conn = await connection(db_config).catch(e => {})


    // this is assuming there will not be enough rush orders 
    if (rush === 'true') {
        rush_components = await query(conn, query_pending_rush_items).catch(console.log);

        if (rush_components) {
            plan.push(...rush_components)
    
            for (rush_component of rush_components) {
                rush_order_lengths.push(string_to_decimal_length(rush_component.size))
            }
        }
     }
     
    if (get_sum(rush_order_lengths) < roll_length) {
        pending_priority_components = await query(conn, query_priority_components).catch(console.log);
            
        if (pending_priority_components) {
            priority_components = find_sub_lengths(rush_order_lengths, roll_length, pending_priority_components)
        }
            
        if (priority_components) {
            plan.push(...priority_components)
        }
    }
    
    next_to_print.roll_length = roll_length
    next_to_print.plan = plan;
    
    res.send({ next_to_print })
})


app.listen(port, () => console.log(`listening on port ${port}!`))

