const inquirer = require("inquirer");
const mysql = require("mysql2");
const menuQuestions = require("./prompts/menuQuestions");
const addDepartmentPrompts = require("./prompts/addDepartmentPrompts");
const addRolePrompts = require("./prompts/addRolePrompts");
const addEmployeePrompts = require("./prompts/addEmployeePrompts");
const updateEmployeePrompts = require("./prompts/updateEmployeePrompts");

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
  console.log("list all departments");
  init();
}

function viewRoles() {
  console.log("list all roles");
  init();
}

function viewEmployees() {
  console.log("list all employees");
  init();
}

function addDepartment() {
  inquirer.prompt(addDepartmentPrompts).then((data) => {
    console.log(data.newDepartment);
    init();
  });
}

function addRole() {
  inquirer.prompt(addRolePrompts).then((data) => {
    console.log(data);
    init();
  });
}

function addEmployee() {
  inquirer.prompt(addEmployeePrompts).then((data) => {
    console.log(data);
    console.log(
      `New employee ${data.firstName} ${data.lastName} has been added`
    );
    init();
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
