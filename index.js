const mysql=require('mysql');
const inquirer=require('inquirer');

var connection = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: '',
  // multipleStatements: true
});

//Prompt library

var accessPrompt = {
  type: "list",
  name: "access",
  message: "Welcome to Bamazon! Are you a customer, or an employee?",
  choices: ["Customer Portal", "Employee Portal"]


};	

var salesPrompt = {
	type: "list",
	name: "inventory",
	message: "Bamazon inventory: Please select which item you are interested in purchasing",
	choices: [1, 2, 3, 4]
};

function customerPurchase() {
	inquirer.prompt(salesPrompt).then(answers => {

	});
};

function initiateAccess() {
  inquirer.prompt(accessPrompt).then(answers => {
    if(answers.access == "Customer Portal"){

    } else if (answers.access == "Employee Portal"){
        console.log("Employee Portal!")
    }
	});
};

connection.connect( err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  connection.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = 'bamazon_db' AND table_name = 'product_list'", (error, results, fields) => {
  	if (results.length == 0){
  		connection.query("CREATE DATABASE IF NOT EXISTS bamazon_db", (error, results, fields) => {console.log(results)});
  		connection.query("CREATE TABLE bamazon_db.product_list (id int AUTO_INCREMENT PRIMARY KEY, product_name varchar(255), product_desc varchar(255), product_count int)");
  		console.log("database established!");
  	} else {
  		console.log(results)};
  })
  // initiateAccess();
});

