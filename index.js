const inquirer = require('inquirer');
const table = require('console.table');
const db = require('./db/connection');

function startServer() {
    inquirer
        .prompt({
            message: "What would you like to do?",
            name: "start",
            type: "list",
            choices: [
                "View all employees",
                "View all roles",
                "View all departments",
                "Add an employee",
                "Add a department",
                "Add a role",
                "Update an employee's role",
                "Update an employee's manager",
            ],
        })
        .then(function (response) {
            switch (response.start) {
                case "View all employees":
                    viewEmployee();
                    break;

                case "View all departments":
                    viewDepartment();
                    break;

                case "View all roles":
                    viewRoles();
                    break;

                case "Add an employee":
                    addEmployee();
                    break;

                case "Add a department":
                    addDepartment();
                    break;

                case "Add a role":
                    addRoles();
                    break;

                case "Update an employee's role":
                    updateRole();
                    break;

                case "Update an employee's manager":
                    updateManager();
                    break;

            }
        });
}

const viewEmployee = () => {
    db.query(empTable, function (err, rows) {
        if (err) throw err;
        console.table(rows);
        startServer();
    });
};

const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name,
                 roles.title, departments.department, roles.salary,
                 concat(manager.first_name, ' ', manager.last_name) manager
                 FROM employees employee
                 INNER JOIN roles ON employee.role_id = roles.id
                 INNER JOIN departments ON roles.department_id = departments.id
                 LEFT JOIN employees manager ON manager.id = employee.manager_id`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        }
        console.table(rows);
        mainMenu();
    });
};
const viewDepartment = () => {
    const deptQuery = `SELECT * FROM department`;
    db.query(deptQuery, function (err, rows) {
        if (err) throw err;
        console.table(rows);
        startServer();
    });
};
const viewRoles = () => {
    const rolesQuery = `SELECT * FROM roles`;
    db.query(rolesQuery, function (err, rows) {
        if (err) throw err;
        console.table(rows);
        startServer();
    });
};

const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: "fName",
                type: "input",
                message: "What is the employees first name?",
            },
            {
                name: "lName",
                type: "input",
                message: "What is the employees last name",
            },
        ])
        .then((answer) => {
            const params = [answer.fName, answer.lName];

            const roleSql = `SELECT roles.id, roles.title FROM roles`;
            db.query(roleSql, (err, data) => {
                if (err) throw err;
                const role = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer
                    .prompt([
                        {
                            name: "role",
                            type: "list",
                            message: "What is the employees role?",
                            choices: role,
                        },
                    ])
                    .then((roleChoice) => {
                        const role = roleChoice.role;
                        params.push(role);

                        const managerSql = `SELECT * FROM manager`;

                        db.query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({
                                name: first_name + " " + last_name,
                                value: id,
                            }));

                            inquirer
                                .prompt([
                                    {
                                        name: "manager",
                                        type: "list",
                                        message: "Who is the employees manager?",
                                        choices: managers,
                                    },
                                ])
                                .then((managerChoice) => {
                                    const manager = managerChoice.manager;
                                    params.push(manager);

                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES (?, ?, ?, ?)`;

                                    db.query(sql, params, (err, result) => {
                                        if (err) throw err;
                                        console.log("Employee has been added");

                                        viewEmployee();

                                    });
                                });
                        });
                    });
            });
        });
};

const updateRole = () => {
    const employees = [];
    db.query(`SELECT employees.id, employees.first_name, employees.last_name FROM employees`, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        result.forEach(item => {
            const name = `${item.first_name} ${item.last_name}`;
            employees.push(name);
        });

        inquirer.prompt([
            {
                type: 'list',
                name: 'update',
                message: `Who's role do you want to update?`,
                choices: employees
            },
            {
                type: 'input',
                name: 'new_role',
                message: `What is their new role id?`,
                validate: input => {
                    if (!isNaN(input)) {
                        return true;
                    } else {
                        console.log(' Please enter a number');
                        return false;
                    };
                }
            }
        ]).then(input => {
            const split = input.update.split(' ');
            const sql = `UPDATE employees
                         SET role_id = ${input.new_role}
                         WHERE first_name = '${split[0]}'
                         AND last_name = '${split[1]}'`
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log(result);
                mainMenu();
            });
        });
    });
};
const updateManager = () => {
    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "Which employee would you like to update?",
        },
        {
          name: "manager",
          type: "input",
          message: "Who is this employees new manager?",
        },
      ])
      .then((response) => {
        let sqlUpdate = `UPDATE employee SET manager_id = ? WHERE id = ?`;
        db.query(sqlUpdate, [response.manager, response.id], (err, rows) => {
          if (err) throw err;
          viewEmployee();
          
        });
      });
  };
  const done = () => {
    console.log('Goodbye!');
    process.exit();
};

mainMenu();

init();