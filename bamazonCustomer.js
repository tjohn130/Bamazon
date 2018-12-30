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
    Search();

})

function Display(){
    //This function displays the The Database in an ordered list
    connection.query('SELECT * FROM products',function(err,res){

        res.forEach(element => {
            // console.log(element.item_id);
            // console.log(element.product_name);
            // console.log(element.department_name);
            // console.log(element.price);
            // console.log(element.stock_quantity);
            console.log("\nItem ID:"+element.item_id+" Product Name:"+element.product_name+" Department Name:"+element.department_name+" Price:"+element.price+" Stock:"+element.stock_quantity);
        });
        console.log("\n")  
    })
}

function Search(){
//This Function runs a the 'Display' function and ask the user for input
    Display();


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
                //This takes the amount for the database and subtracts the requested amount
                var remainder = res[0].stock_quantity - answer.prompt2;

                //Check if the amount if can be request due to space
                if  (remainder < 0){
                    //Disp
                    connection.end(console.log("Insuffient quantity!"));
                }

                //Run if amount is accepted
                else{

                //The Update Query Search
                connection.query('UPDATE products SET ? WHERE ?',
                [
                    {stock_quantity: remainder},
                    {item_id: answer.prompt1}
                ],
                function(err,res){
                    if (err) throw err;
                    //console.log(res)
                    connection.end(console.log("Your Order has been Processed"));
                })
                }
            })

            
        })
}