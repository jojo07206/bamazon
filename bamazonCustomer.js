var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
    });
});

readProducts();
runSearch();

function runSearch() {
    inquirer
        .prompt([
            {
                name: "productID",
                type: "input",
                message: "Please enter the product ID you would like to purchase: "
            },
            {
                name: "productQuantity",
                type: "input",
                message: "How many would you like to buy? "
            }
        ])
        .then(function (answer) {

            var input_id = answer.productID;
            var input_quantity = answer.productQuantity;

            connection.query("SELECT stock_quantity, price FROM products WHERE item_id = " + input_id, function (err, result) {
                if (err) throw err;
                var current_quantity = result[0].stock_quantity;
                var price = result[0].price;
                var total = price * input_quantity;
                if (input_quantity < current_quantity) {
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: current_quantity - input_quantity
                            },
                            {
                                item_id: input_id
                            }
                        ],
                    );
                    console.log("Your total is: " + total);
                } else {
                    console.log(result);
                    console.log(current_quantity);
                    console.log(price);
                    console.log("Insufficient quantity!");
                }
            });
        }
        )
};

function readProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
    });
}

