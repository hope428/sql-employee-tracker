const addEmployeePrompts = [
    {
        message: "Enter first name",
        type: "input",
        name: "firstName"
    }, 
    {
        message: "Enter last name",
        type: "input",
        name: "lastName"
    }, 
    {
        message: "Enter role",
        type: "list",
        choices: ["Role 1", "Role 2", "Role 3"],
        name: "employeeRole"
    }, 
    {
        message: "Select employee manager",
        type: "list",
        choices: ["Leif Hetland", "Benjamin White", "None"],
        name: "employeeManager"
    }
]

module.exports = addEmployeePrompts