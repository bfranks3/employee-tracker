INSERT INTO department (  name)
VALUES
    ( 'Purchasing'),
    ( 'Production'),
    ( 'Marketing');

INSERT INTO role ( title, salary, department_id)
VALUES
    ( 'Welder', 55000, 2),
    ( 'Worker', 37000, 2),
    ( 'Project Manager', 102000, 2),
    ( 'Sales Man', 63000, 3),
    ( 'Marketing Manager', 140000, 3),
    ( 'Accountant', 96000, 1),
    ( 'Head of Purchasing', 75000, 1);
    

INSERT INTO employee ( first_name, last_name, role_id, manager_id) 
VALUES
    ( 'Chuck', 'Morris', 1, 3 ),
    ( 'Alan', 'Barker', 2, 3),
    ( 'Todd', 'Andersen', 3, 5),
    ( 'Blake', 'Bell', 4, 5),
    ( 'Terry', 'Austin', 5, NULL),
    ( 'Johnny', 'McAfee', 6, 5 ),
    ( 'Ted', 'Housel', 7, 5),
    ( 'Brooke', 'Myers', 2, 3),
    ( 'Jane', 'Wison', 2, 3),
    ( 'Bobby', 'Hope', 1, 3);