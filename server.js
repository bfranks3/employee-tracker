const express = require("express");
const inquirer = require("inquirer");
const { start } = require("repl");
const mysql = require("mysql");
const PORT = process.env.PORT || 3003;
const app = express();

const empTable = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM employee 
      LEFT JOIN manager ON employee.manager_id = manager.id
      LEFT JOIN roles ON employee.role_id = roles.id 
      LEFT JOIN department ON employee.department_id = department.id`;
      
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "denverbroncos",
    database: "store_employees",
  },
  console.log("Connected to the store_employees database.")
);

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
    
    const addDepartment = () => {
      inquirer
        .prompt({
          name: "dept",
          type: "input",
          message: "What is the name of the department?",
        })
        .then(function (response) {
          let sqlQuery = `INSERT INTO department SET ?`;
          db.query(sqlQuery, { department_name: response.dept }, (err, rows) => {
            if (err) throw err;
            viewDepartment();
            
          });
          
        });
    };
    
    const addRoles = () => {
      let departArray = [];
      db.query(`SELECT * FROM department`, function (err, results) {
        if (err) throw err;
        results.forEach((element) => {
          departArray.push(element.department_name);
        });
    
        inquirer
          .prompt([
            {
              name: "title",
              type: "input",
              message: "What is the name of this role?",
            },
            {
              name: "salary",
              type: "input",
              message: "What is the salary of this role?",
            },
            {
              name: "dept",
              type: "list",
              choices: departArray,
              message: "What department is this role in?",
            },
          ])
          .then(function (response) {
            let sqlQuery = `SELECT id FROM department WHERE department_name = ?`;
            db.query(sqlQuery, [response.dept], function (err, result) {
              if (err) throw err;
              console.log(result);
              db.query(
                `INSERT INTO roles SET ?`,
                {
                  title: response.title,
                  salary: response.salary,
                  department_id: result[0].id,
                },
                function (err, result) {
                  if (err) throw err;
                  viewRoles();
                  
                }
              );
            });
            
          });
      });
    };
    
    const updateRole = () => {
      inquirer
        .prompt([
          {
            name: "id",
            type: "input",
            message: "which employee would you like to update?",
          },
          {
            name: "role",
            type: "input",
            message: "What is the employees new role?",
          },
        ])
        .then((response) => {
          let sqlUpdate = `UPDATE employee SET role_id = ? WHERE id = ?`;
          db.query(sqlUpdate, [response.role, response.id], (err, rows) => {
            if (err) throw err;
            viewEmployee();
            
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
    
    app.use((req, res) => {
      res.status(404).end();
    });
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    startServer();
    