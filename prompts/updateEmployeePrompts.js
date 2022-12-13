const updateEmployeePrompts = [
    {
        message: "Which employee do you want to update?",
        type: 'list',
        choices: ["list", "of", "employees"],
        name: "chosenEmployee"
    }, {
        message: "Which role do you want to assign to this employee?",
        type: 'list',
        choices: ["list", "of", "roles", "Cancel"],
        name: "chosenRole"
    }
]

module.exports = updateEmployeePrompts