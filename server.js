const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2')
const cTable = require('console.table');
const db = require('./db/connection');
const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    start();
  });
});
start = () => {userChoices()}


const userChoices = () => {
  inquirer.prompt([
    { type: 'list',
      name: 'choices',
      message: 'Please make a selection.',
      choices: [
        'View all Departments','View all Roles','View all Employees','Add a Department','Add a Role','Add an Employee','Update an Employee role','Quit']
    }
  ])
    .then((answers) => {
      switch (answers.choices) {
        case 'View all Departments':viewAllDepartments();
          break;
        case 'View all Roles':viewAllRoles();
          break;
        case 'View all Employees':viewAllEmployees();
          break;
        case 'Add a Department':addNewDeparment();
          break;
        case 'Add a Role':addNewRole();
          break;
        case 'Add an Employee':addNewEmployee();
          break;
        case 'Update an Employee Role':updateEmployees();
          break;
        case 'Quit':
          break;
      }
});
};


viewAllDepartments = () => {
    console.log('Departments')
    var sql = `SELECT department.id AS id, department.name AS department FROM department`;
    db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
    })
    userChoices()}
  

  viewAllRoles = () => {
    console.log('Roles')
      var sql = `SELECT roles.id, roles.title, department.name AS department, roles.salaryFROM roles INNER JOIN department ON roles.department_id = department.id`;
    db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
    })
    userChoices()}
  

  viewAllEmployees = () => {
    console.log('Employees')
    var sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN roles ON (roles.id = employee.role_id)
    INNER JOIN department ON (department.id = roles.department_id) ORDER BY employee.id;`;
      db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
    })
    userChoices()}
  

  addNewDeparment = () => {
    inquirer.prompt([
      { type: 'input',
        name: 'addDept',
        message: "What Department would you like to add?",
        validate: addDept => {
          if (addDept) {
            return true;
          } else {
            console.log('Please enter a valid Department!');
            return false;
          }
        }
      }
    ])
      .then(answer => {
        var sql = `INSERT INTO department (name) VALUES (?)`;
        db.query(sql, answer.addDept, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDept + " to Departments!");
        viewAllDepartments();
        });
      });
  };
  

  function addNewRole() {
    inquirer.prompt([
      { type: "input",
        message: "Enter employees Title",
        name: "roleTitle"},

      { type: "input",
        message: "Enter employees Salary",
        name: "roleSalary"},

      { type: "input",
        message: "Enter employees Department ID",
        name: "roleDept"}
    ])
      .then(function (res) {
        var sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
        var params = [res.roleTitle, res.roleSalary, res.roleDept];
        db.query(sql, params, (err, res) => {
          if (err) {throw err;}
          console.table(res);
         viewAllRoles()
        });
      });
  }
  

  addNewEmployee = () => {
    inquirer
      .prompt([
        { type: "input",
          message: "Enter Employees first name",
          name: "firstName"},

        { type: "input",
          message: "Enter Employees last name",
          name: "lastName"},

        { type: "input",
          message: "Enter Employees Role ID",
          name: "addRole"},

        { type: "input",
          message: "Enter Employees Manager ID",
          name: "addManager"}
      ])
      .then(function (res) {
        var sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        var params = [res.firstName, res.lastName, res.addRole, res.addManager];
        db.query(sql, params, (err, res) => {
          if (err) {throw err;}
          console.table(res);
          viewAllEmployees();
        });
      });
  }
  

  updateEmployees = () => {
    inquirer.prompt([
      { type: "input",
        message: "Enter updated Employee ID",
        name: "employeeID"},

      { type: "input",
        message: "Enter new Role ID for Employee",
        name: "newRole"}
    ])
    .then(function (res) {
        var sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        var params = [ res.newRole,res.employeeID];
        db.query(sql, params, (err, res) => {
          if (err) {throw err;}
          console.table(res);
         viewAllEmployees();
        })
      });
    }