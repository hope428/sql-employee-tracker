const addRolePrompts = (data) => {
  const deptArray = data.map((dept) => dept.name);
  return [
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
      choices: deptArray,
      name: "roleDepartment",
    },
  ];
};

module.exports = addRolePrompts;
