const addRolePrompts = [
  {
    message: "What is the name of the role you would like to add?",
    type: "input",
    name: "roleName",
  },
  {
    message: "What is the salary of the role?",
    type: "input",
    name: "roleSalary",
  },
  {
    message: "What is the department of the role?",
    type: "list",
    choices: ["Sales", "Legal", "Tech"],
    name: "roleDepartment",
  },
];

module.exports = addRolePrompts;
