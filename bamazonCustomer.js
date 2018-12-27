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
    if (err) throw err;
    console.log('The connection thread ID is :'+connection.threadId);
    Display();
    Search();

})

function Display(){

    connection.query('SELECT * FROM products',function(err,res){

        res.forEach(element => {
            // console.log(element.item_id);
            // console.log(element.product_name);
            // console.log(element.department_name);
            // console.log(element.price);
            // console.log(element.stock_quantity);
            console.log("\nItem ID:"+element.item_id+" Product Name:"+element.product_name+" Department Name:"+element.department_name+" Price:"+element.price+" Stock:"+element.stock_quantity);

        });  
    })
}

function Search(){
    inquirer.prompt([
        {name: 'prompt1',
        type: 'input',
        message: 'Select an item by the ID number'
        },
        {name: 'prompt2',
        type: 'input',
        message: 'Select the stock of the item'

        }]).then(function(answer){
            connection.query('SELECT * FROM products WHERE ?',{item_id: answer.prompt1},function(err,res){
                if (err) throw err;

                var remainder = res[0].stock_quantity - answer.prompt2;

                console.log("Item ID:"+res[0].item_id+" Product Name:"+res[0].product_name+" Department Name:"+res[0].department_name+" Price:"+res[0].price+" Stock:"+res[0].stock_quantity);

                if (remainder<0){
                    console.log("Insufficient quantity!")
                }

                connection.query('UPDATE products SET ? WHERE ?',
                [
                    {stock_quantity: remainder},
                    {item_id: answer.prompt1}
                ],
                function(err,res){
                    if (err) throw err;
                    connection.end(console.log("DONE"));
                })
            })

            
        })
}