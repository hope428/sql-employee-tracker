const addEmployeePrompts = (data) => {
    const roleArray = data.map(role => role.title)
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
      choices: ["Leif Hetland", "Benjamin White", "None"],
      name: "employeeManager",
    },
  ];
};

module.exports = addEmployeePrompts;
