const mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "P@ssw0rd",
  database: "Bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    Display();

    connection.end();
})

function Display(){
    var query = 'SELECT * FROM product';
    connection.query(query,function(err,res){
        res.forEach(element => {
            console.log(element.item_id);
            console.log(element.product_name);
            console.log(element.department_name);
            console.log(element.price);
            console.log(element.stock_quantity);
            console.log()
        });  
    })
}

function Search(){
    inquirer.prompt([
        {name: 'prompt1',
        type: 'input',
        message: ''},{}])
}