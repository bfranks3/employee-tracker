SELECT 
    employee.role_id AS role_id, roles.title AS title
    FROM employee 
    JOIN roles ON employee.role_id = roles.id;

SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee LEFT JOIN manager ON employee.manager_id = manager.id

SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee 
LEFT JOIN manager ON employee.manager_id = manager.id
LEFT JOIN roles ON employee.role_id = roles.id 
LEFT JOIN department ON employee.department_id = department.id