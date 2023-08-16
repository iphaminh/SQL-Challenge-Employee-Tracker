-- Insert sample data into 'department' table
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('HR');

-- Insert sample data into 'role' table
INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 60000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 80000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', 75000, 3);

-- Insert sample data into 'employee' table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
