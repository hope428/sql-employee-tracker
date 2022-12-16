INSERT INTO department (name)
VALUES
    ("Tech"),
    ("Customer Service"),
    ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Developer", 70000, 1), 
    ("Sales Associate", 12000, 2), 
    ("HR Rep", 55000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Walter", "White", 3, 3),
    ("Jesse", "Pinkman", 2, 3),
    ("Mike", "Ehrmantraut", 1, NULL);

-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
-- IF(employee.manager_id IS NOT NULL, manager.first_name, NULL) as manager_name
-- FROM employee 
-- JOIN role 
-- ON employee.role_id = role.id 
-- JOIN department 
-- ON department.id = role.department_id 
-- LEFT JOIN employee manager
-- ON employee.manager_id = manager.id
-- ORDER BY employee.id;