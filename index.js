const inquirer = require("inquirer");
const mysql = require("mysql2");
const ctable = require("console.table");
const menuQuestions = require("./prompts/menuQuestions");
const addDepartmentPrompts = require("./prompts/addDepartmentPrompts");
const addRolePrompts = require("./prompts/addRolePrompts");
const addEmployeePrompts = require("./prompts/addEmployeePrompts");
const updateEmployeePrompts = require("./prompts/updateEmployeePrompts");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "bluemoon",
    database: "employee_db",
  },
  console.log("Connected to employee_db!")
);

function init() {
  inquirer.prompt(menuQuestions).then((data) => {
    const action = data.action;
    switch (action) {
      case "View All Departments":
        viewDepartments();
        break;
      case "View All Roles":
        viewRoles();
        break;
      case "View All Employees":
        viewEmployees();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "Exit":
        exit();
        break;
    }
  });
}

function viewDepartments() {
  db.query("SELECT * FROM department", (err, data) => {
    console.table(data);
    init();
  });
}

function viewRoles() {
  db.query("SELECT * FROM role", (err, data) => {
    console.table(data);
    init();
  });
}

function viewEmployees() {
  db.query("SELECT * FROM employee", (err, data) => {
    console.table(data);
    init();
  });
}

function addDepartment() {
  inquirer.prompt(addDepartmentPrompts).then((data) => {
    db.query(`INSERT INTO department (name) VALUES (?)`, data.newDepartment);
    init();
  });
}

function addRole() {
  db.query("SELECT * FROM department", (err, data) => {
    inquirer
      .prompt(addRolePrompts(data))
      .then((data) => {
        return data;
      })
      //.then block takes data from prompts and calls db.query to retrieve dept id based on dept name
      .then((data) => {
        const roleName = data.roleName;
        const roleSalary = data.roleSalary;
        db.query(
          "SELECT id FROM department WHERE ?",
          { name: data.roleDepartment },
          (err, data) => {
            //db query to insert data with department id
            db.query(
              `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
              [roleName, roleSalary, data[0].id]
            );
            //calls main menu
            init();
          }
        );
      });
  });
}

function addEmployee() {
  db.query("SELECT * FROM role", (err, data) => {
    inquirer.prompt(addEmployeePrompts(data)).then((data) => {
      db.query(`INSERT INTO employee (first_name, last_name) VALUES (?, ?)`, [
        data.firstName,
        data.lastName,
      ]);
      console.log(
        `New employee ${data.firstName} ${data.lastName} has been added`
      );
      init();
    });
  });
}

function updateEmployeeRole() {
  inquirer.prompt(updateEmployeePrompts).then((data) => {
    if (data.chosenRole === "Cancel") {
      init();
    } else {
      console.log(data);
      console.log("Employee has been successfully updated!");
      init();
    }
  });
}

function exit() {
  console.log("Thanks for using!");
}

init();
