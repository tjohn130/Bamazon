const mysql = require('mysql');
var inquirer = require("inquirer");
require("dotenv").config();

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.MYSQL_PW,
  database: "bamazon"
});

connection.connect(function(err){
    //Running App
    if (err) throw err;
    console.log('The connection thread ID is :'+connection.threadId);
    

})

inquirer.prompt({name: "test1",
type: "list",
message: "This is the test ?",
choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]})
.then(function(answer){
    
    switch(answer.test1){
        case "View Products for Sale":

        connection.query('SELECT * FROM products',function(err,res){
            if(err) throw err;

            res.forEach(element => {
                console.log("Item ID:"+element.item_id+
                " Product Name:"+element.product_name+
                " Department Name:"+element.department_name+
                " Price:"+element.price+
                " Stock:"+element.stock_quantity);
            })

            connection.end(console.log("Your request has been processed"));
        })
        
        break;

        case "View Low Inventory": 

        connection.query('SELECT * FROM products WHERE stock_quantity < 500',function(err,res){
            if(err) throw err;

            res.forEach(element => {
                console.log("Item ID:"+element.item_id+
                " Product Name:"+element.product_name+
                " Department Name:"+element.department_name+
                " Price:"+element.price+
                " Stock:"+element.stock_quantity);
            })

            connection.end(console.log("Your request has been processed"));
        })
        
        break;

        case "Add to Inventory": 
        
        inquirer.prompt([{
            name: 'StockID',
            type: 'input',
            message: 'Select an Item ID'}
            ,{
            name:'StockQ',
            type: 'input',
            message: 'Enter new quantity for stock item'}]).then(function(answer){

                connection.query('UPDATE products SET ? WHERE ?',
                [
                    {stock_quantity: answer.StockQ},
                    {item_id: answer.StockID}
                ],
                function(err,res){
                    if (err) throw err;
                    connection.end(console.log("Your request has been processed"));
                })
            })
        break;
        case "Add New Product": 

        inquirer.prompt([{
            name: 'product',
            type: 'input',
            message: "Enter an Item Name"}
            ,{
            name: 'depart',
            type: 'input',
            message: "Enter an Item Department's Name"}
            ,{
            name: 'price',
            type: 'input',
            message: 'Enter an Item Price'}
            ,{
            name: 'stock',
            type: 'input',
            message: "Enter an Item's Stock"}]).then(function(answer){

                connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?',
                (
                    answer.product,
                    answer.depart,
                    answer.price,
                    answer.stock
                )
                ,function(err,res){
                    if (err) throw err;
                    console.log(res)
                    connection.end(console.log("Your request has been processed"));
                })
            })


        break;
    }
})