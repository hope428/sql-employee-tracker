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
  db.query(
    "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id",
    (err, data) => {
      console.table(data);
      init();
    }
  );
}

function viewEmployees() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, IF(employee.manager_id IS NOT NULL, CONCAT(manager.first_name, ' ', manager.last_name), NULL) as manager_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.id;",
    (err, data) => {
      console.table(data);

      init();
    }
  );
}

async function addDepartment() {
  const data = await inquirer.prompt(addDepartmentPrompts)
  await db.promise().query(`INSERT INTO department (name) VALUES (?)`, data.newDepartment);
  init();
}

async function addRole() {
  const departments = await db.promise().query("SELECT id, name FROM department")
  const rolePromptData = await inquirer.prompt(addRolePrompts(departments[0]))
  const {roleName, roleSalary, roleDepartment} = rolePromptData;
  await db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
      [roleName, roleSalary, roleDepartment])
  init();
}

async function addEmployee() {
  const roleData = await db.promise().query("SELECT title, id FROM role")
  const managerList = await db.promise().query("SELECT first_name FROM employee WHERE manager_id is NULL")
  const data = await inquirer.prompt(addEmployeePrompts(roleData[0], managerList[0]))
  const {firstName, lastName, employeeRole, employeeManager} = data;
  if(employeeManager !== 'None'){
    const managerID = await db.promise().query("SELECT id FROM employee WHERE first_name = ?", employeeManager)
    const parsedID = managerID[0][0].id
    await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstName, lastName, employeeRole, parsedID])
  } else {
    await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstName, lastName, employeeRole, null])
  }
  console.log(`New employee ${firstName} ${lastName} has been added`);
  init();
}

async function updateEmployeeRole() {
  const employeeNames = await db.promise().query("SELECT first_name, last_name FROM employee")
  const rolesInfo = await db.promise().query("SELECT id, title FROM role")
  const names = employeeNames[0]
  const roles = rolesInfo[0]
  const newdata = await inquirer.prompt(updateEmployeePrompts(names, roles))
  const firstName = newdata.chosenEmployee.split(" ")[0];
  const lastName = newdata.chosenEmployee.split(" ")[1];
  const roleId = newdata.chosenRole;
  await db.promise().query("UPDATE employee SET ? WHERE ? && ?", [
        { role_id: roleId },
        { first_name: firstName },
        { last_name: lastName },
      ])
  console.log("Employee role has been updated");
  init();
}

function exit() {
  console.log("Thanks for using!");
  process.exit(0)
}

init();
