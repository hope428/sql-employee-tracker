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
  db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, IF(employee.manager_id IS NOT NULL, CONCAT(manager.first_name, ' ', manager.last_name), NULL) as manager_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.id;", (err, data) => {
    console.table(data);

    init();
  });
}

function addDepartment() {
  inquirer.prompt(addDepartmentPrompts).then((data) => {
    db.query(`INSERT INTO department (name) VALUES (?)`, data.newDepartment);
    console.log("Department added!");
    init();
  });
}

function addRole() {
  db.promise()
    .query("SELECT * FROM department")
    .then((data) => {
      inquirer.prompt(addRolePrompts(data[0])).then((data) => {
        const roleName = data.roleName;
        const roleSalary = data.roleSalary;
        db.promise()
          .query("SELECT id FROM department WHERE ?", {
            name: data.roleDepartment,
          })
          .then((data) =>{
            db
              .promise()
              .query(
                `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                [roleName, roleSalary, data[0][0].id]
              )}
          )
          .then((data) => {
            console.log("Role successfully added!");
            init()});
      });
    });
}

function addEmployee() {
  //db query to get all info from roles
  db.query("SELECT * FROM role", (err, data) => {
    const roles = data;
    //db query to get all manager first names from employee table
    db.query(
      "SELECT first_name FROM employee WHERE manager_id is NULL",
      (err, data) => {
        const employees = data;
        //inquirer calls addEmployeePrompts, passing in roles and employee data
        inquirer.prompt(addEmployeePrompts(roles, employees)).then((data) => {
          const firstName = data.firstName;
          const lastName = data.lastName;
          const employeeRole = data.employeeRole;
          const employeeManager = data.employeeManager;
          //db query to get role id
          db.query(
            "SELECT id FROM role WHERE title = ?",
            employeeRole,
            (err, data) => {
              const roleID = data[0].id;
              //db query to get manager id from employee table
              if (employeeManager !== "None") {
                db.query(
                  "SELECT id FROM employee WHERE first_name = ?",
                  employeeManager,
                  (err, data) => {
                    const managerID = data[0].id;
                    db.query(
                      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                      [firstName, lastName, roleID, managerID]
                    );
                    console.log(
                      `New employee ${firstName} ${lastName} has been added`
                    );
                    init();
                  }
                );
              } else {
                //If no manager is selected from the list
                db.query(
                  `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                  [firstName, lastName, roleID, null]
                );
                console.log(
                  `New employee ${firstName} ${lastName} has been added`
                );
                init();
              }
            }
          );
        });
      }
    );
  });
}

function updateEmployeeRole() {
  db.promise()
    .query("SELECT first_name, last_name FROM employee")
    .then((data) => {
      const employeeNames = data[0];
      db.promise()
        .query("SELECT id, title FROM role")
        .then((data) => {
          const roles = data[0];
          inquirer
            .prompt(updateEmployeePrompts(employeeNames, roles))
            .then((data) => {
              const firstName = data.chosenEmployee.split(" ")[0];
              const lastName = data.chosenEmployee.split(" ")[1];
              db.promise()
                .query("SELECT id FROM role WHERE ?", {
                  title: data.chosenRole,
                })
                .then((data) => {
                  const roleId = data[0][0].id;
                  db.promise()
                    .query("UPDATE employee SET ? WHERE ? && ?", [
                      { role_id: roleId },
                      { first_name: firstName },
                      { last_name: lastName },
                    ])
                    .then((data) => {
                      console.log("Employee role has been updated");
                      init();
                    });
                });
            });
        });
    });
}

function exit() {
  console.log("Thanks for using!");
}

init();
