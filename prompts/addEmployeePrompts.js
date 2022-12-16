const addEmployeePrompts = (role, employee) => {
  const roleArray = role.map((role) => ({name: role.title, value: role.id}));
  const managers = employee.map(employee => employee.first_name)
  return [
    {
      message: "Enter first name",
      type: "input",
      name: "firstName",
    },
    {
      message: "Enter last name",
      type: "input",
      name: "lastName",
    },
    {
      message: "Enter role",
      type: "list",
      choices: roleArray,
      name: "employeeRole",
    },
    {
      message: "Select employee manager",
      type: "list",
      choices: [...managers, "None"],
      name: "employeeManager",
    },
  ];
};

module.exports = addEmployeePrompts;
