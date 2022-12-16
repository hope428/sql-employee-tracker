const updateEmployeePrompts = (employees, roles) => {
    const namesArray = []
    employees.map(employee => namesArray.push(`${employee.first_name} ${employee.last_name}`))
    const rolesArray = roles.map(role => ({name: role.title, value: role.id}))
  return [
    {
      message: "Which employee's role do you want to update?",
      type: "list",
      choices: namesArray,
      name: "chosenEmployee",
    },
    {
      message: "Which role do you want to assign to this employee?",
      type: "list",
      choices: rolesArray,
      name: "chosenRole",
    },
  ];
};

module.exports = updateEmployeePrompts;
