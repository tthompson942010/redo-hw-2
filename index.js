const mysql=require('mysql');
const inquirer=require('inquirer');

var connection = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
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

//----

// If the database doesn't exist, build it and populate with a few (coronavirus quarantine-inspired) products
function buildTheDatabase() {
  connection.query("CREATE DATABASE IF NOT EXISTS bamazon_db");
  connection.changeUser({database: "bamazon_db"});
  connection.query("CREATE TABLE IF NOT EXISTS product_list (id int AUTO_INCREMENT PRIMARY KEY, product_name varchar(255), product_desc varchar(255), product_count int)", (error, results) => {
     if (error) throw error;
   });
  console.log("database established!");
  var product1 = new Product("surgical masks", "N95 masks to prevent contamination", 20);
  var product2 = new Product("rubber golves", "surgical gloves to prevent contamination", 20);
  var product3 = new Product("toilet paper", "Charmin Ultra, 4 ply!", 20);
  var product4 = new Product("disinfecting wipes", "Lysol brand disinfecting wipes for quick cleanup!", 20);
  var product5 = new Product("hand sanitizer", "Germ-X brand alcohol based hand sanitizer", 20);
  var starterProducts = [product1, product2, product3, product4, product5];
  starterProducts.forEach(x => {
    populateDatabase(x);
  });
};

// Creates a product object to pass to the database
function Product(productName, productDesc, productCount) {
  this.product_name= productName;
  this.product_desc= productDesc;
  this.product_count= productCount;
};

// Adds the object to the database
function populateDatabase(product_info) {
    let sql = "INSERT INTO product_list SET ?";
    connection.query(sql, product_info, (error, results, field) => {
      if (error) throw error;
      console.log("1 row affected");
      console.log(results); 
    });
};

// allows the customer to select and purchase a product, modifying the database accordingly.
function customerPurchase() {
	inquirer.prompt(salesPrompt).then(answers => {
		console.log("you selected ${answers}");
	});
};

// selects which portal to access; one for purchases, the other for restock/adding products.
function initiateAccessPrompt() {
  inquirer.prompt(accessPrompt).then(answers => {
    if(answers.access == "Customer Portal"){
    	customerPurchase();
    } else if (answers.access == "Employee Portal"){
        console.log("Employee Portal!")
    };
	});
};

// initiates connection to the database
connection.connect( err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  };
  connection.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = 'bamazon_db' AND table_name = 'product_list'", (error, results, fields) => {
  	if (results.length == 0){
      buildTheDatabase();
  	};   
    connection.changeUser({database: "bamazon_db"});
    initiateAccessPrompt();
  });

});

