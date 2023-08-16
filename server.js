const inquirer = require('inquirer');
const connection = require('./config/connection');

function getDepartments() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM department', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

function getRoles() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM role', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

function getEmployees() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM employee', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

async function addRole() {
    const departments = await getDepartments();
    const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter the title of the new role:'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for this role:'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for this role:',
            choices: departmentChoices
        }
    ])
    .then((answer) => {
        connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', 
        [answer.roleTitle, answer.roleSalary, answer.departmentId], 
        (err) => {
            if (err) throw err;
            console.log('Role added successfully!');
            init(); // Redirect back to the main menu
        });
    });
}

async function addEmployee() {
    const roles = await getRoles();
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    const employees = await getEmployees();
    const employeeChoices = employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
    employeeChoices.unshift({ name: 'No Manager', value: null });

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the role for this employee:',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the manager for this employee:',
            choices: employeeChoices
        }
    ])
    .then((answer) => {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
        [answer.firstName, answer.lastName, answer.roleId, answer.managerId === 'No Manager' ? null : answer.managerId], 
        (err) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            init(); // Redirect back to the main menu
        });
    });
}

function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ])
    .then((answer) => {
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, results) => {
        if (err) throw err;
        console.table(results);
        init(); // Redirect back to the main menu after displaying results
    });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        init(); // Redirect back to the main menu after displaying results
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        console.table(results);
        init(); // Redirect back to the main menu after displaying results
    });
}


function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the new department:'
        }
    ])
    .then((answer) => {
        connection.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName], (err) => {
            if (err) throw err;
            console.log('Department added successfully!');
            init(); // Redirect back to the main menu
        });
    });
}

async function updateEmployeeRole() {
    const employees = await getEmployees();
    const employeeChoices = employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

    const roles = await getRoles();
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee you want to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'newRoleId',
            message: 'Select the new role for this employee:',
            choices: roleChoices
        }
    ])
    .then((answer) => {
        connection.query('UPDATE employee SET role_id = ? WHERE id = ?', 
        [answer.newRoleId, answer.employeeId], 
        (err) => {
            if (err) throw err;
            console.log('Employee role updated successfully!');
            init(); // Redirect back to the main menu
        });
    });
}

// Call the init function to start the application
init();