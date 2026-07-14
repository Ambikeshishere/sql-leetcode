/* =============================================
   SQLCode - SQL Practice Platform
   Main JavaScript
   ============================================= */

// =============================================
// PROBLEMS DATABASE
// =============================================
const PROBLEMS = [
    {
        id: 1,
        title: "Retrieve All Employees",
        difficulty: "Easy",
        tags: ["Select"],
        acceptance: 89,
        description: `<p>Write a SQL query to retrieve all columns from the <code>Employees</code> table.</p>
<p>Return all rows and all columns.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "age", type: "INT", description: "Employee age" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "SELECT * FROM Employees;",
            output: `| id | name           | age | salary   | department  |
|----|----------------|-----|----------|-------------|
| 1  | Alice Johnson  | 28  | 75000.00 | Engineering |
| 2  | Bob Smith      | 35  | 82000.00 | Marketing   |
| 3  | Carol White    | 42  | 95000.00 | Engineering |
| 4  | David Brown    | 31  | 68000.00 | HR          |
| 5  | Eva Martinez   | 26  | 72000.00 | Marketing   |
| 6  | Frank Lee      | 38  | 105000.00| Engineering |
| 7  | Grace Kim      | 29  | 78000.00 | HR          |
| 8  | Henry Wilson   | 45  | 120000.00| Engineering |`
        },
        notes: "Use the <code>SELECT *</code> statement to retrieve all columns.",
        defaultQuery: "SELECT * FROM Employees;",
        testCases: [
            { input: "", expected: "SELECT * FROM Employees;", description: "Select all employees" }
        ],
        solution: `SELECT * FROM Employees;`,
        solutionExplanation: "Using SELECT * retrieves all columns from the specified table."
    },
    {
        id: 2,
        title: "Filter Employees by Department",
        difficulty: "Easy",
        tags: ["Select"],
        acceptance: 85,
        description: `<p>Write a SQL query to find all employees who work in the <strong>Engineering</strong> department.</p>
<p>Return all columns for matching employees.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "age", type: "INT", description: "Employee age" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "SELECT * FROM Employees WHERE department = 'Engineering';",
            output: `| id | name           | age | salary   | department  |
|----|----------------|-----|----------|-------------|
| 1  | Alice Johnson  | 28  | 75000.00 | Engineering |
| 3  | Carol White    | 42  | 95000.00 | Engineering |
| 6  | Frank Lee      | 38  | 105000.00| Engineering |
| 8  | Henry Wilson   | 45  | 120000.00| Engineering |`
        },
        notes: "Use the <code>WHERE</code> clause to filter rows based on a condition.",
        defaultQuery: "SELECT * FROM Employees\nWHERE department = ",
        testCases: [
            { input: "", expected: "SELECT * FROM Employees WHERE department = 'Engineering';", description: "Filter by Engineering department" }
        ],
        solution: `SELECT * FROM Employees\nWHERE department = 'Engineering';`,
        solutionExplanation: "Use WHERE clause to filter rows where department equals 'Engineering'."
    },
    {
        id: 3,
        title: "Count Employees per Department",
        difficulty: "Easy",
        tags: ["Aggregation"],
        acceptance: 82,
        description: `<p>Write a SQL query to count the number of employees in each department.</p>
<p>Return the department name and the count of employees, ordered by count in descending order.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "SELECT department, COUNT(*) as cnt\nFROM Employees\nGROUP BY department\nORDER BY cnt DESC;",
            output: `| department  | cnt |
|-------------|-----|
| Engineering | 4   |
| Marketing   | 2   |
| HR          | 2   |`
        },
        notes: "Use <code>GROUP BY</code> with <code>COUNT(*)</code> to aggregate rows by a column value.",
        defaultQuery: "SELECT department, COUNT(*) as employee_count\nFROM Employees\nGROUP BY department\nORDER BY employee_count DESC;",
        testCases: [
            { input: "", expected: "SELECT department, COUNT(*) as employee_count FROM Employees GROUP BY department ORDER BY employee_count DESC;", description: "Count employees per department" }
        ],
        solution: `SELECT department, COUNT(*) as employee_count\nFROM Employees\nGROUP BY department\nORDER BY employee_count DESC;`,
        solutionExplanation: "GROUP BY groups rows by department, COUNT(*) counts each group."
    },
    {
        id: 4,
        title: "Find High Earners",
        difficulty: "Easy",
        tags: ["Select", "Aggregation"],
        acceptance: 78,
        description: `<p>Write a SQL query to find employees with a salary greater than <strong>80000</strong>.</p>
<p>Return the employee name and salary, sorted by salary in descending order.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "SELECT name, salary FROM Employees\nWHERE salary > 80000\nORDER BY salary DESC;",
            output: `| name           | salary   |
|----------------|----------|
| Henry Wilson   | 120000.00|
| Frank Lee      | 105000.00|
| Carol White    | 95000.00 |
| Bob Smith      | 82000.00 |`
        },
        notes: "Use comparison operators like <code>></code>, <code><</code>, <code>>=</code>, <code><=</code> in the WHERE clause.",
        defaultQuery: "SELECT name, salary\nFROM Employees\nWHERE salary > 80000\nORDER BY salary DESC;",
        testCases: [
            { input: "", expected: "SELECT name, salary FROM Employees WHERE salary > 80000 ORDER BY salary DESC;", description: "Find employees with salary > 80000" }
        ],
        solution: `SELECT name, salary\nFROM Employees\nWHERE salary > 80000\nORDER BY salary DESC;`,
        solutionExplanation: "Filter with WHERE salary > 80000, then ORDER BY salary DESC."
    },
    {
        id: 5,
        title: "Employee Order Details",
        difficulty: "Easy",
        tags: ["Joins"],
        acceptance: 76,
        description: `<p>Write a SQL query to retrieve all orders along with the employee name who placed each order.</p>
<p>Return the order id, product name, amount, and employee name. Sort by order id.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        extraSchema: {
            table: "Orders",
            columns: [
                { name: "order_id", type: "INT", description: "Primary key" },
                { name: "employee_id", type: "INT", description: "Foreign key to Employees" },
                { name: "product", type: "VARCHAR", description: "Product name" },
                { name: "amount", type: "DECIMAL", description: "Order amount" },
                { name: "order_date", type: "DATE", description: "Date of order" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');

        CREATE TABLE Orders (
            order_id INTEGER PRIMARY KEY,
            employee_id INTEGER,
            product TEXT,
            amount DECIMAL(10,2),
            order_date TEXT,
            FOREIGN KEY (employee_id) REFERENCES Employees(id)
        );
        INSERT INTO Orders VALUES (101, 1, 'Laptop', 1299.99, '2024-01-15');
        INSERT INTO Orders VALUES (102, 2, 'Monitor', 449.99, '2024-01-16');
        INSERT INTO Orders VALUES (103, 1, 'Keyboard', 89.99, '2024-01-17');
        INSERT INTO Orders VALUES (104, 3, 'Desk', 599.99, '2024-01-18');
        INSERT INTO Orders VALUES (105, 2, 'Mouse', 29.99, '2024-01-19');
        INSERT INTO Orders VALUES (106, 4, 'Chair', 399.99, '2024-01-20');`,
        example: {
            input: "SELECT o.order_id, o.product, o.amount, e.name AS employee_name\nFROM Orders o\nJOIN Employees e ON o.employee_id = e.id\nORDER BY o.order_id;",
            output: `| order_id | product  | amount  | employee_name |
|----------|----------|---------|---------------|
| 101      | Laptop   | 1299.99 | Alice Johnson |
| 102      | Monitor  | 449.99  | Bob Smith     |
| 103      | Keyboard | 89.99   | Alice Johnson |
| 104      | Desk     | 599.99  | Carol White   |
| 105      | Mouse    | 29.99   | Bob Smith     |
| 106      | Chair    | 399.99  | David Brown   |`
        },
        notes: "Use <code>JOIN</code> (or <code>INNER JOIN</code>) to combine rows from two tables based on a related column.",
        defaultQuery: "SELECT o.order_id, o.product, o.amount, e.name AS employee_name\nFROM Orders o\nJOIN Employees e ON o.employee_id = e.id\nORDER BY o.order_id;",
        testCases: [
            { input: "", expected: "SELECT o.order_id, o.product, o.amount, e.name AS employee_name FROM Orders o JOIN Employees e ON o.employee_id = e.id ORDER BY o.order_id;", description: "Join orders with employees" }
        ],
        solution: `SELECT o.order_id, o.product, o.amount, e.name AS employee_name\nFROM Orders o\nJOIN Employees e ON o.employee_id = e.id\nORDER BY o.order_id;`,
        solutionExplanation: "INNER JOIN combines rows where employee_id matches Employees.id."
    },
    {
        id: 6,
        title: "Average Salary by Department",
        difficulty: "Medium",
        tags: ["Aggregation", "Joins"],
        acceptance: 71,
        description: `<p>Write a SQL query to find the average salary for each department.</p>
<p>Return the department name and average salary, rounded to 2 decimal places. Only show departments with an average salary greater than 70000. Sort by average salary descending.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "SELECT department, ROUND(AVG(salary), 2) AS avg_salary\nFROM Employees\nGROUP BY department\nHAVING AVG(salary) > 70000\nORDER BY avg_salary DESC;",
            output: `| department  | avg_salary |
|-------------|------------|
| Engineering | 98750.00   |
| Marketing   | 77000.00   |
| HR          | 73000.00   |`
        },
        notes: "Use <code>HAVING</code> to filter groups after aggregation (unlike WHERE which filters before). <code>ROUND()</code> rounds the result.",
        defaultQuery: "SELECT department, ROUND(AVG(salary), 2) AS avg_salary\nFROM Employees\nGROUP BY department\nHAVING AVG(salary) > 70000\nORDER BY avg_salary DESC;",
        testCases: [
            { input: "", expected: "SELECT department, ROUND(AVG(salary), 2) AS avg_salary FROM Employees GROUP BY department HAVING AVG(salary) > 70000 ORDER BY avg_salary DESC;", description: "Average salary by department" }
        ],
        solution: `SELECT department, ROUND(AVG(salary), 2) AS avg_salary\nFROM Employees\nGROUP BY department\nHAVING AVG(salary) > 70000\nORDER BY avg_salary DESC;`,
        solutionExplanation: "GROUP BY department, use AVG() aggregate, filter with HAVING."
    },
    {
        id: 7,
        title: "Rank Employees by Salary",
        difficulty: "Medium",
        tags: ["Window Functions"],
        acceptance: 65,
        description: `<p>Write a SQL query to rank employees by salary within each department.</p>
<p>Return the employee name, department, salary, and their rank (1 being highest salary). Use the <code>RANK()</code> window function. Sort by department and rank.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "SELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank\nFROM Employees\nORDER BY department, salary_rank;",
            output: `| name           | department  | salary   | salary_rank |
|----------------|-------------|----------|-------------|
| Henry Wilson   | Engineering | 120000.00| 1           |
| Frank Lee      | Engineering | 105000.00| 2           |
| Carol White    | Engineering | 95000.00 | 3           |
| Alice Johnson  | Engineering | 75000.00 | 4           |
| Bob Smith      | Marketing   | 82000.00 | 1           |
| Eva Martinez   | Marketing   | 72000.00 | 2           |
| Grace Kim      | HR          | 78000.00 | 1           |
| David Brown    | HR          | 68000.00 | 2           |`
        },
        notes: "<code>RANK()</code> assigns a rank to each row within a partition. <code>PARTITION BY</code> divides the result set into groups. <code>ORDER BY</code> within the OVER clause determines the ranking order.",
        defaultQuery: "SELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank\nFROM Employees\nORDER BY department, salary_rank;",
        testCases: [
            { input: "", expected: "SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM Employees ORDER BY department, salary_rank;", description: "Rank employees by salary within department" }
        ],
        solution: `SELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank\nFROM Employees\nORDER BY department, salary_rank;`,
        solutionExplanation: "RANK() OVER (PARTITION BY department ORDER BY salary DESC) gives each employee a rank within their department."
    },
    {
        id: 8,
        title: "Find Duplicate Emails",
        difficulty: "Medium",
        tags: ["Subqueries", "Aggregation"],
        acceptance: 62,
        description: `<p>Write a SQL query to find all duplicate email addresses in the <code>Users</code> table.</p>
<p>Return the email and the count of occurrences, sorted by count descending.</p>`,
        schema: {
            table: "Users",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "User name" },
                { name: "email", type: "VARCHAR", description: "Email address" },
                { name: "created_at", type: "DATE", description: "Registration date" }
            ]
        },
        setupSQL: `CREATE TABLE Users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TEXT
        );
        INSERT INTO Users VALUES (1, 'Alice', 'alice@example.com', '2024-01-01');
        INSERT INTO Users VALUES (2, 'Bob', 'bob@example.com', '2024-01-02');
        INSERT INTO Users VALUES (3, 'Carol', 'alice@example.com', '2024-01-03');
        INSERT INTO Users VALUES (4, 'David', 'david@example.com', '2024-01-04');
        INSERT INTO Users VALUES (5, 'Eve', 'bob@example.com', '2024-01-05');
        INSERT INTO Users VALUES (6, 'Frank', 'carol@example.com', '2024-01-06');
        INSERT INTO Users VALUES (7, 'Grace', 'alice@example.com', '2024-01-07');`,
        example: {
            input: "SELECT email, COUNT(*) AS cnt\nFROM Users\nGROUP BY email\nHAVING COUNT(*) > 1\nORDER BY cnt DESC;",
            output: `| email           | cnt |
|-----------------|-----|
| alice@example.com | 3 |
| bob@example.com   | 2 |`
        },
        notes: "GROUP BY the email column and use HAVING COUNT(*) > 1 to find duplicates.",
        defaultQuery: "SELECT email, COUNT(*) AS cnt\nFROM Users\nGROUP BY email\nHAVING COUNT(*) > 1\nORDER BY cnt DESC;",
        testCases: [
            { input: "", expected: "SELECT email, COUNT(*) AS cnt FROM Users GROUP BY email HAVING COUNT(*) > 1 ORDER BY cnt DESC;", description: "Find duplicate emails" }
        ],
        solution: `SELECT email, COUNT(*) AS cnt\nFROM Users\nGROUP BY email\nHAVING COUNT(*) > 1\nORDER BY cnt DESC;`,
        solutionExplanation: "GROUP BY email, filter groups with HAVING COUNT(*) > 1 to find duplicates."
    },
    {
        id: 9,
        title: "Department Salary Statistics",
        difficulty: "Medium",
        tags: ["Aggregation", "Window Functions"],
        acceptance: 58,
        description: `<p>Write a SQL query to calculate the total, average, min, and max salary for each department.</p>
<p>Also include the overall company average salary as a separate column. Round all values to 2 decimal places. Sort by total salary descending.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "SELECT department,\n  ROUND(SUM(salary), 2) AS total_salary,\n  ROUND(AVG(salary), 2) AS avg_salary,\n  MIN(salary) AS min_salary,\n  MAX(salary) AS max_salary,\n  (SELECT ROUND(AVG(salary), 2) FROM Employees) AS company_avg\nFROM Employees\nGROUP BY department\nORDER BY total_salary DESC;",
            output: `| department  | total_salary | avg_salary | min_salary | max_salary | company_avg |
|-------------|-------------|------------|------------|------------|-------------|
| Engineering | 395000.00   | 98750.00   | 75000.00   | 120000.00  | 86875.00    |
| Marketing   | 154000.00   | 77000.00   | 72000.00   | 82000.00   | 86875.00    |
| HR          | 146000.00   | 73000.00   | 68000.00   | 78000.00   | 86875.00    |`
        },
        notes: "You can use a subquery to compute the overall average. Window functions like <code>AVG() OVER()</code> can also be used.",
        defaultQuery: "SELECT department,\n  ROUND(SUM(salary), 2) AS total_salary,\n  ROUND(AVG(salary), 2) AS avg_salary,\n  MIN(salary) AS min_salary,\n  MAX(salary) AS max_salary\nFROM Employees\nGROUP BY department\nORDER BY total_salary DESC;",
        testCases: [
            { input: "", expected: "SELECT department, ROUND(SUM(salary), 2) AS total_salary, ROUND(AVG(salary), 2) AS avg_salary, MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM Employees GROUP BY department ORDER BY total_salary DESC;", description: "Department salary statistics" }
        ],
        solution: `SELECT department,\n  ROUND(SUM(salary), 2) AS total_salary,\n  ROUND(AVG(salary), 2) AS avg_salary,\n  MIN(salary) AS min_salary,\n  MAX(salary) AS max_salary,\n  (SELECT ROUND(AVG(salary), 2) FROM Employees) AS company_avg\nFROM Employees\nGROUP BY department\nORDER BY total_salary DESC;`,
        solutionExplanation: "Use multiple aggregate functions: SUM, AVG, MIN, MAX. Subquery for company-wide average."
    },
    {
        id: 10,
        title: "Find Second Highest Salary",
        difficulty: "Medium",
        tags: ["Subqueries"],
        acceptance: 55,
        description: `<p>Write a SQL query to find the second highest distinct salary from the <code>Employees</code> table.</p>
<p>If there is no second highest salary, return NULL.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "SELECT MAX(salary) AS second_highest\nFROM Employees\nWHERE salary < (SELECT MAX(salary) FROM Employees);",
            output: `| second_highest |
|----------------|
| 105000.00      |`
        },
        notes: "One approach: find the max salary that is less than the overall max. Another approach uses LIMIT/OFFSET or window functions.",
        defaultQuery: "SELECT MAX(salary) AS second_highest\nFROM Employees\nWHERE salary < (SELECT MAX(salary) FROM Employees);",
        testCases: [
            { input: "", expected: "SELECT MAX(salary) AS second_highest FROM Employees WHERE salary < (SELECT MAX(salary) FROM Employees);", description: "Find second highest salary" }
        ],
        solution: `SELECT MAX(salary) AS second_highest\nFROM Employees\nWHERE salary < (SELECT MAX(salary) FROM Employees);`,
        solutionExplanation: "Subquery gets the max salary, outer query finds the max salary less than that."
    },
    {
        id: 11,
        title: "Employee Self-Join: Managers",
        difficulty: "Hard",
        tags: ["Joins", "Subqueries"],
        acceptance: 48,
        description: `<p>Write a SQL query to find each employee along with their manager's name.</p>
<p>Return employee name, employee salary, and manager name. If an employee has no manager, show 'None'. Sort by employee name.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "manager_id", type: "INT", description: "Foreign key to manager (self-referencing)" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT,
            manager_id INTEGER,
            FOREIGN KEY (manager_id) REFERENCES Employees(id)
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering', 6);
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing', NULL);
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering', 6);
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR', NULL);
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing', 2);
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering', NULL);
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR', 4);
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering', 6);`,
        example: {
            input: "SELECT e.name AS employee, e.salary, COALESCE(m.name, 'None') AS manager\nFROM Employees e\nLEFT JOIN Employees m ON e.manager_id = m.id\nORDER BY e.name;",
            output: `| employee       | salary   | manager     |
|----------------|----------|-------------|
| Alice Johnson  | 75000.00 | Frank Lee   |
| Bob Smith      | 82000.00 | None        |
| Carol White    | 95000.00 | Frank Lee   |
| David Brown    | 68000.00 | None        |
| Eva Martinez   | 72000.00 | Bob Smith   |
| Frank Lee      | 105000.00| None        |
| Grace Kim      | 78000.00 | David Brown |
| Henry Wilson   | 120000.00| Frank Lee   |`
        },
        notes: "A <code>self-join</code> joins a table with itself. Use <code>LEFT JOIN</code> to include employees without managers. <code>COALESCE()</code> returns the first non-NULL value.",
        defaultQuery: "SELECT e.name AS employee, e.salary, COALESCE(m.name, 'None') AS manager\nFROM Employees e\nLEFT JOIN Employees m ON e.manager_id = m.id\nORDER BY e.name;",
        testCases: [
            { input: "", expected: "SELECT e.name AS employee, e.salary, COALESCE(m.name, 'None') AS manager FROM Employees e LEFT JOIN Employees m ON e.manager_id = m.id ORDER BY e.name;", description: "Find employee-manager pairs" }
        ],
        solution: `SELECT e.name AS employee, e.salary, COALESCE(m.name, 'None') AS manager\nFROM Employees e\nLEFT JOIN Employees m ON e.manager_id = m.id\nORDER BY e.name;`,
        solutionExplanation: "LEFT JOIN the Employees table to itself (self-join) on manager_id = id. LEFT JOIN keeps all employees even if they have no manager."
    },
    {
        id: 12,
        title: "Running Total of Salaries",
        difficulty: "Hard",
        tags: ["Window Functions"],
        acceptance: 45,
        description: `<p>Write a SQL query to compute the running (cumulative) total of salaries, ordered by hire date.</p>
<p>Return employee name, salary, hire date, and the running total. Use a window function.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "hire_date", type: "DATE", description: "Hire date" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT,
            manager_id INTEGER,
            hire_date TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering', 6, '2022-03-15');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing', NULL, '2021-07-20');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering', 6, '2020-01-10');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR', NULL, '2023-06-01');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing', 2, '2023-02-28');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering', NULL, '2019-11-05');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR', 4, '2022-09-12');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering', 6, '2018-04-22');`,
        example: {
            input: "SELECT name, salary, hire_date,\n  SUM(salary) OVER (ORDER BY hire_date) AS running_total\nFROM Employees\nORDER BY hire_date;",
            output: `| name           | salary   | hire_date | running_total |
|----------------|----------|-----------|---------------|
| Henry Wilson   | 120000.00| 2018-04-22| 120000.00     |
| Carol White    | 95000.00 | 2020-01-10| 215000.00     |
| Bob Smith      | 82000.00 | 2021-07-20| 297000.00     |
| Alice Johnson  | 75000.00 | 2022-03-15| 372000.00     |
| Grace Kim      | 78000.00 | 2022-09-12| 450000.00     |
| Eva Martinez   | 72000.00 | 2023-02-28| 522000.00     |
| David Brown    | 68000.00 | 2023-06-01| 590000.00     |`
        },
        notes: "<code>SUM() OVER (ORDER BY ...)</code> creates a running total. The window function calculates a cumulative sum over an ordered set of rows.",
        defaultQuery: "SELECT name, salary, hire_date,\n  SUM(salary) OVER (ORDER BY hire_date) AS running_total\nFROM Employees\nORDER BY hire_date;",
        testCases: [
            { input: "", expected: "SELECT name, salary, hire_date, SUM(salary) OVER (ORDER BY hire_date) AS running_total FROM Employees ORDER BY hire_date;", description: "Compute running salary total" }
        ],
        solution: `SELECT name, salary, hire_date,\n  SUM(salary) OVER (ORDER BY hire_date) AS running_total\nFROM Employees\nORDER BY hire_date;`,
        solutionExplanation: "SUM(salary) OVER (ORDER BY hire_date) computes a running cumulative sum ordered by hire_date."
    },
    {
        id: 13,
        title: "Top N Salaries per Department",
        difficulty: "Hard",
        tags: ["Window Functions", "CTE"],
        acceptance: 42,
        description: `<p>Write a SQL query to find the top 2 highest-paid employees in each department.</p>
<p>Return employee name, department, salary, and their rank within the department. Only include ranks 1 and 2. Sort by department and rank.</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "salary", type: "DECIMAL", description: "Annual salary" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "WITH RankedEmployees AS (\n  SELECT name, department, salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn\n  FROM Employees\n)\nSELECT name, department, salary, rn AS salary_rank\nFROM RankedEmployees\nWHERE rn <= 2\nORDER BY department, salary_rank;",
            output: `| name           | department  | salary   | salary_rank |
|----------------|-------------|----------|-------------|
| Henry Wilson   | Engineering | 120000.00| 1           |
| Frank Lee      | Engineering | 105000.00| 2           |
| Bob Smith      | Marketing   | 82000.00 | 1           |
| Eva Martinez   | Marketing   | 72000.00 | 2           |
| Grace Kim      | HR          | 78000.00 | 1           |
| David Brown    | HR          | 68000.00 | 2           |`
        },
        notes: "Use a <code>CTE</code> (Common Table Expression) with <code>ROW_NUMBER()</code> to rank employees, then filter for top N. <code>ROW_NUMBER()</code> assigns unique sequential numbers.",
        defaultQuery: "WITH RankedEmployees AS (\n  SELECT name, department, salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn\n  FROM Employees\n)\nSELECT name, department, salary, rn AS salary_rank\nFROM RankedEmployees\nWHERE rn <= 2\nORDER BY department, salary_rank;",
        testCases: [
            { input: "", expected: "WITH RankedEmployees AS (SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn FROM Employees) SELECT name, department, salary, rn AS salary_rank FROM RankedEmployees WHERE rn <= 2 ORDER BY department, salary_rank;", description: "Top 2 earners per department" }
        ],
        solution: `WITH RankedEmployees AS (\n  SELECT name, department, salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn\n  FROM Employees\n)\nSELECT name, department, salary, rn AS salary_rank\nFROM RankedEmployees\nWHERE rn <= 2\nORDER BY department, salary_rank;`,
        solutionExplanation: "CTE defines a temporary result with ROW_NUMBER() to rank, then filter WHERE rn <= 2."
    },
    {
        id: 14,
        title: "Delete Duplicate Rows",
        difficulty: "Hard",
        tags: ["DML", "Subqueries"],
        acceptance: 38,
        description: `<p>Write SQL statements to remove duplicate rows from the <code>Contacts</code> table, keeping only the row with the lowest <code>id</code> for each unique combination of name and email.</p>
<p>First write a SELECT query to identify the duplicates, then write the DELETE statement.</p>`,
        schema: {
            table: "Contacts",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Contact name" },
                { name: "email", type: "VARCHAR", description: "Email address" },
                { name: "phone", type: "VARCHAR", description: "Phone number" }
            ]
        },
        setupSQL: `CREATE TABLE Contacts (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT
        );
        INSERT INTO Contacts VALUES (1, 'Alice', 'alice@example.com', '555-0101');
        INSERT INTO Contacts VALUES (2, 'Bob', 'bob@example.com', '555-0102');
        INSERT INTO Contacts VALUES (3, 'Alice', 'alice@example.com', '555-0103');
        INSERT INTO Contacts VALUES (4, 'Carol', 'carol@example.com', '555-0104');
        INSERT INTO Contacts VALUES (5, 'Bob', 'bob@example.com', '555-0105');
        INSERT INTO Contacts VALUES (6, 'David', 'david@example.com', '555-0106');`,
        example: {
            input: "-- Identify duplicates\nSELECT name, email, MIN(id) AS keep_id, COUNT(*) AS dup_count\nFROM Contacts\nGROUP BY name, email\nHAVING COUNT(*) > 1;",
            output: `| name  | email           | keep_id | dup_count |
|-------|-----------------|---------|-----------|
| Alice | alice@example.com | 1     | 2         |
| Bob   | bob@example.com   | 2     | 2         |`
        },
        notes: "In SQLite, you can delete duplicates using a subquery: <code>DELETE FROM Contacts WHERE id NOT IN (SELECT MIN(id) FROM Contacts GROUP BY name, email);</code>",
        defaultQuery: "-- Find duplicates first\nSELECT name, email, MIN(id) AS keep_id, COUNT(*) AS dup_count\nFROM Contacts\nGROUP BY name, email\nHAVING COUNT(*) > 1;",
        testCases: [
            { input: "", expected: "SELECT name, email, MIN(id) AS keep_id, COUNT(*) AS dup_count FROM Contacts GROUP BY name, email HAVING COUNT(*) > 1;", description: "Identify duplicate contacts" }
        ],
        solution: `-- Step 1: Identify duplicates\nSELECT name, email, MIN(id) AS keep_id, COUNT(*) AS dup_count\nFROM Contacts\nGROUP BY name, email\nHAVING COUNT(*) > 1;\n\n-- Step 2: Delete duplicates (keeping lowest id)\nDELETE FROM Contacts\nWHERE id NOT IN (\n  SELECT MIN(id) FROM Contacts GROUP BY name, email\n);`,
        solutionExplanation: "Group by name and email to find duplicates, then DELETE rows whose id is not the minimum for that group."
    },
    {
        id: 15,
        title: "Pivot Department Headcount",
        difficulty: "Hard",
        tags: ["CTE", "Aggregation"],
        acceptance: 35,
        description: `<p>Write a SQL query to create a pivot table showing the count of employees per department, with departments as columns.</p>
<p>The output should have a single row with columns: Engineering, HR, Marketing (and any other departments present).</p>`,
        schema: {
            table: "Employees",
            columns: [
                { name: "id", type: "INT", description: "Primary key" },
                { name: "name", type: "VARCHAR", description: "Employee name" },
                { name: "department", type: "VARCHAR", description: "Department name" }
            ]
        },
        setupSQL: `CREATE TABLE Employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER,
            salary DECIMAL(10,2),
            department TEXT
        );
        INSERT INTO Employees VALUES (1, 'Alice Johnson', 28, 75000, 'Engineering');
        INSERT INTO Employees VALUES (2, 'Bob Smith', 35, 82000, 'Marketing');
        INSERT INTO Employees VALUES (3, 'Carol White', 42, 95000, 'Engineering');
        INSERT INTO Employees VALUES (4, 'David Brown', 31, 68000, 'HR');
        INSERT INTO Employees VALUES (5, 'Eva Martinez', 26, 72000, 'Marketing');
        INSERT INTO Employees VALUES (6, 'Frank Lee', 38, 105000, 'Engineering');
        INSERT INTO Employees VALUES (7, 'Grace Kim', 29, 78000, 'HR');
        INSERT INTO Employees VALUES (8, 'Henry Wilson', 45, 120000, 'Engineering');`,
        example: {
            input: "SELECT\n  SUM(CASE WHEN department = 'Engineering' THEN 1 ELSE 0 END) AS Engineering,\n  SUM(CASE WHEN department = 'HR' THEN 1 ELSE 0 END) AS HR,\n  SUM(CASE WHEN department = 'Marketing' THEN 1 ELSE 0 END) AS Marketing\nFROM Employees;",
            output: `| Engineering | HR | Marketing |
|-------------|----|-----------|
| 4           | 2  | 2         |`
        },
        notes: "Use <code>CASE WHEN</code> expressions inside aggregate functions to pivot rows into columns. This is a common technique when the database doesn't support native PIVOT.",
        defaultQuery: "SELECT\n  SUM(CASE WHEN department = 'Engineering' THEN 1 ELSE 0 END) AS Engineering,\n  SUM(CASE WHEN department = 'HR' THEN 1 ELSE 0 END) AS HR,\n  SUM(CASE WHEN department = 'Marketing' THEN 1 ELSE 0 END) AS Marketing\nFROM Employees;",
        testCases: [
            { input: "", expected: "SELECT SUM(CASE WHEN department = 'Engineering' THEN 1 ELSE 0 END) AS Engineering, SUM(CASE WHEN department = 'HR' THEN 1 ELSE 0 END) AS HR, SUM(CASE WHEN department = 'Marketing' THEN 1 ELSE 0 END) AS Marketing FROM Employees;", description: "Pivot headcount by department" }
        ],
        solution: `SELECT\n  SUM(CASE WHEN department = 'Engineering' THEN 1 ELSE 0 END) AS Engineering,\n  SUM(CASE WHEN department = 'HR' THEN 1 ELSE 0 END) AS HR,\n  SUM(CASE WHEN department = 'Marketing' THEN 1 ELSE 0 END) AS Marketing\nFROM Employees;`,
        solutionExplanation: "CASE WHEN creates a flag per department, SUM counts non-zero flags = department count."
    }
];

// =============================================
// APP STATE
// =============================================
const state = {
    currentPage: 'problems',
    currentProblem: null,
    solvedProblems: JSON.parse(localStorage.getItem('solvedProblems') || '{}'),
    submissions: JSON.parse(localStorage.getItem('submissions') || '[]'),
    streak: parseInt(localStorage.getItem('streak') || '0'),
    lastVisit: localStorage.getItem('lastVisit') || null,
    testCases: [],
    db: null // sql.js database instance
};

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadSqlEngine();
    updateStreak();
    renderProblemList();
    bindEvents();
    updateStats();
});

async function loadSqlEngine() {
    // sql.js is loaded via <script> tag from CDN
    try {
        if (typeof initSqlJs === 'function') {
            const SQL = await initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
            });
            state.SQL = SQL;
            console.log('SQL engine loaded successfully');
        } else {
            console.warn('initSqlJs not available');
            state.SQL = null;
        }
    } catch (e) {
        console.warn('sql.js not loaded:', e);
        state.SQL = null;
    }
}

function updateStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (state.lastVisit === today) return;

    if (state.lastVisit === yesterday) {
        state.streak++;
    } else if (state.lastVisit !== today) {
        state.streak = 1;
    }

    state.lastVisit = today;
    localStorage.setItem('streak', state.streak);
    localStorage.setItem('lastVisit', today);
    document.getElementById('streakCount').textContent = state.streak;
}

function updateStats() {
    let easy = 0, med = 0, hard = 0;
    for (const [id, solved] of Object.entries(state.solvedProblems)) {
        if (!solved) continue;
        const p = PROBLEMS.find(pr => pr.id === parseInt(id));
        if (!p) continue;
        if (p.difficulty === 'Easy') easy++;
        else if (p.difficulty === 'Medium') med++;
        else hard++;
    }
    document.getElementById('easyCount').textContent = easy;
    document.getElementById('medCount').textContent = med;
    document.getElementById('hardCount').textContent = hard;
}

// =============================================
// NAVIGATION
// =============================================
function navigateTo(page) {
    state.currentPage = page;

    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    if (page === 'problems') {
        document.getElementById('problemsPage').classList.remove('hidden');
        document.querySelector('[data-page="problems"]').classList.add('active');
    } else if (page === 'workspace') {
        document.getElementById('workspacePage').classList.remove('hidden');
    } else if (page === 'submissions') {
        document.getElementById('submissionsPage').classList.remove('hidden');
        document.querySelector('[data-page="submissions"]').classList.add('active');
        renderAllSubmissions();
    } else if (page === 'leaderboard') {
        document.getElementById('leaderboardPage').classList.remove('hidden');
        document.querySelector('[data-page="leaderboard"]').classList.add('active');
        renderLeaderboard();
    }
}

// =============================================
// PROBLEM LIST
// =============================================
function renderProblemList(filter = {}) {
    const tbody = document.getElementById('problemListBody');
    const search = (filter.search || '').toLowerCase();
    const difficulty = filter.difficulty || 'all';
    const tag = filter.tag || 'all';

    let filtered = PROBLEMS.filter(p => {
        if (search && !p.title.toLowerCase().includes(search) && !p.id.toString().includes(search)) return false;
        if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
        if (tag !== 'all' && !p.tags.includes(tag)) return false;
        return true;
    });

    document.getElementById('totalProblems').textContent = PROBLEMS.length;
    document.getElementById('showingCount').textContent = filtered.length;

    tbody.innerHTML = filtered.map(p => {
        const solved = state.solvedProblems[p.id];
        const statusIcon = solved
            ? '<span class="status-icon solved"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></span>'
            : '<span class="status-icon unsolved"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><circle cx="12" cy="12" r="10"/></svg></span>';

        return `<tr onclick="openProblem(${p.id})">
            <td class="col-status" style="text-align:center">${statusIcon}</td>
            <td class="col-id"><span class="problem-id">${p.id}</span></td>
            <td class="col-title"><a class="problem-title-link" href="#">${p.title}</a></td>
            <td class="col-difficulty"><span class="difficulty-badge ${p.difficulty}">${p.difficulty}</span></td>
            <td class="col-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</td>
            <td class="col-acceptance"><span class="acceptance">${p.acceptance}%</span></td>
        </tr>`;
    }).join('');
}

// =============================================
// OPEN PROBLEM
// =============================================
function openProblem(id) {
    const problem = PROBLEMS.find(p => p.id === id);
    if (!problem) return;

    state.currentProblem = problem;

    // Update description
    document.getElementById('problemTitle').textContent = `${problem.id}. ${problem.title}`;
    const diffBadge = document.getElementById('problemDifficulty');
    diffBadge.textContent = problem.difficulty;
    diffBadge.className = `difficulty-badge ${problem.difficulty}`;
    document.getElementById('problemTag').textContent = problem.tags[0] || '';
    document.getElementById('problemAcceptance').textContent = `Acceptance: ${problem.acceptance}%`;
    document.getElementById('problemDescription').innerHTML = problem.description;

    // Schema
    let schemaHtml = `<table>
        <thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>`;
    if (problem.schema) {
        schemaHtml += `<tr><td colspan="3" style="color:var(--accent-primary);font-weight:600;padding:8px 14px;background:var(--bg-editor)">${problem.schema.table}</td></tr>`;
        problem.schema.columns.forEach(c => {
            schemaHtml += `<tr><td>${c.name}</td><td>${c.type}</td><td>${c.description}</td></tr>`;
        });
    }
    if (problem.extraSchema) {
        schemaHtml += `<tr><td colspan="3" style="color:var(--accent-primary);font-weight:600;padding:8px 14px;background:var(--bg-editor)">${problem.extraSchema.table}</td></tr>`;
        problem.extraSchema.columns.forEach(c => {
            schemaHtml += `<tr><td>${c.name}</td><td>${c.type}</td><td>${c.description}</td></tr>`;
        });
    }
    schemaHtml += '</tbody></table>';
    document.getElementById('schemaTable').innerHTML = schemaHtml;

    // Example
    document.getElementById('exampleBox').innerHTML = `
        <div class="example-label">Input</div>
        <pre>${escapeHtml(problem.example.input)}</pre>
        <div class="output-label">Output</div>
        <pre>${escapeHtml(problem.example.output)}</pre>`;

    // Notes
    document.getElementById('problemNotes').innerHTML = problem.notes || '';

    // Editor
    document.getElementById('sqlEditor').value = problem.defaultQuery || '';
    updateLineNumbers();

    // Test cases
    state.testCases = problem.testCases.map((tc, i) => ({
        ...tc,
        id: i,
        actual: ''
    }));
    renderTestCases();

    // Reset results
    document.getElementById('resultContainer').innerHTML = `
        <div class="result-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
            <p>Run your query to see results</p>
        </div>`;
    document.getElementById('runtimeDisplay').textContent = '';

    // Solution tab
    document.getElementById('solutionContent').innerHTML = state.solvedProblems[id]
        ? `<h3 style="margin-bottom:8px">Solution</h3><p style="color:var(--text-muted);margin-bottom:12px">${problem.solutionExplanation}</p><pre>${escapeHtml(problem.solution)}</pre>`
        : '<p class="hint-text">Solve the problem to unlock the solution!</p>';

    // Submissions tab
    const problemSubs = state.submissions.filter(s => s.problemId === id);
    if (problemSubs.length > 0) {
        document.getElementById('submissionsHistory').innerHTML = problemSubs.map(s => `
            <div class="submission-item">
                <span class="submission-status ${s.passed ? 'pass' : 'fail'}">${s.passed ? 'Accepted' : 'Wrong Answer'}</span>
                <span class="submission-time">${new Date(s.date).toLocaleString()}</span>
            </div>`).join('');
    } else {
        document.getElementById('submissionsHistory').innerHTML = '<p class="hint-text">No submissions yet for this problem.</p>';
    }

    navigateTo('workspace');
}

// =============================================
// SQL EXECUTION
// =============================================
function executeSQL(sql, setupSQL) {
    if (!state.SQL) {
        return { error: 'SQL engine not loaded. Please refresh the page.' };
    }

    try {
        const db = new state.SQL.Database();
        if (setupSQL) {
            db.run(setupSQL);
        }
        const results = db.exec(sql);
        db.close();

        // db.exec returns [] for statements that don't return rows
        // Return a structured result
        if (results.length === 0) {
            return { results: [{ columns: [], values: [] }] };
        }
        return { results };
    } catch (e) {
        return { error: e.message };
    }
}

function normalizeSQL(sql) {
    return sql.replace(/\s+/g, ' ').trim().replace(/;$/, '').trim().toUpperCase();
}

function compareResults(userResults, expectedSQL, setupSQL) {
    const expected = executeSQL(expectedSQL, setupSQL);
    if (expected.error) return { pass: false, error: 'Test case error: ' + expected.error };

    if (userResults.error) return { pass: false, error: userResults.error };

    // Get the result set (first result object from exec)
    const userResult = userResults.results;
    const expectedResult = expected.results;

    if (!userResult || userResult.length === 0) {
        if (!expectedResult || expectedResult.length === 0) return { pass: true };
        return { pass: false, error: 'Query returned no results' };
    }

    const userRes = userResult[0];
    const expRes = expectedResult[0];

    // If either has no data, check if both are empty
    if (!userRes.values || userRes.values.length === 0) {
        if (!expRes.values || expRes.values.length === 0) return { pass: true, userResult: userRes, expectedResult: expRes };
        return { pass: false, error: 'Query returned no rows', userResult: userRes, expectedResult: expRes };
    }

    // Compare columns (case-insensitive, order-insensitive)
    const userCols = (userRes.columns || []).map(c => c.toLowerCase()).sort();
    const expCols = (expRes.columns || []).map(c => c.toLowerCase()).sort();
    if (JSON.stringify(userCols) !== JSON.stringify(expCols)) {
        return {
            pass: false,
            error: `Expected ${expRes.columns.length} columns, got ${userRes.columns.length} columns.\nExpected: ${expRes.columns.join(', ')}\nGot: ${userRes.columns.join(', ')}`
        };
    }

    // Compare rows (order-insensitive for most cases, but we'll be lenient)
    const normalizeValue = (v) => {
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'number') return parseFloat(v.toFixed(6)).toString();
        return String(v).trim();
    };

    const normalizeRow = (row) => row.map(normalizeValue).join('|');

    const userRows = new Set(userRes.values.map(normalizeRow));
    const expRows = new Set(expRes.values.map(normalizeRow));

    // Check if expected is subset of user (user may have extra rows)
    let missing = [];
    for (const row of expRows) {
        if (!userRows.has(row)) missing.push(row);
    }

    if (missing.length > 0) {
        return {
            pass: false,
            error: `Expected rows not found:\n${missing.slice(0, 5).join('\n')}`,
            userResult: userRes,
            expectedResult: expRes
        };
    }

    // Allow extra rows but warn
    const extraRows = userRows.size - expRows.size;

    return {
        pass: true,
        userResult: userRes,
        expectedResult: expRes,
        extraRows
    };
}

// =============================================
// RUN / SUBMIT
// =============================================
function runQuery() {
    const sql = document.getElementById('sqlEditor').value.trim();
    if (!sql) {
        showToast('Please write a query first', 'warning');
        return;
    }

    const problem = state.currentProblem;
    if (!problem) return;

    const startTime = performance.now();
    const result = executeSQL(sql, problem.setupSQL);
    const runtime = (performance.now() - startTime).toFixed(1);

    document.getElementById('runtimeDisplay').textContent = `Runtime: ${runtime}ms`;

    if (result.error) {
        renderResult({ pass: false, error: result.error });
        switchTab('right', 'result');
        return;
    }

    // Compare against test cases
    const testResult = compareResults(result, problem.testCases[0].expected, problem.setupSQL);
    testResult.runtime = runtime;
    renderResult(testResult);
    switchTab('right', 'result');
}

function submitQuery() {
    const sql = document.getElementById('sqlEditor').value.trim();
    if (!sql) {
        showToast('Please write a query first', 'warning');
        return;
    }

    const problem = state.currentProblem;
    if (!problem) return;

    const startTime = performance.now();
    let allPassed = true;
    let firstError = null;
    let lastResult = null;

    for (const tc of problem.testCases) {
        const result = executeSQL(sql, problem.setupSQL);
        const testResult = compareResults(result, tc.expected, problem.setupSQL);
        lastResult = testResult;

        if (!testResult.pass) {
            allPassed = false;
            if (!firstError) firstError = testResult;
        }
    }

    const runtime = (performance.now() - startTime).toFixed(1);
    document.getElementById('runtimeDisplay').textContent = `Runtime: ${runtime}ms`;

    const submission = {
        problemId: problem.id,
        query: sql,
        passed: allPassed,
        date: new Date().toISOString(),
        runtime
    };

    state.submissions.unshift(submission);
    localStorage.setItem('submissions', JSON.stringify(state.submissions));

    if (allPassed) {
        state.solvedProblems[problem.id] = true;
        localStorage.setItem('solvedProblems', JSON.stringify(state.solvedProblems));
        updateStats();
        showToast('Accepted! All test cases passed.', 'success');

        // Update solution tab
        document.getElementById('solutionContent').innerHTML = `
            <h3 style="margin-bottom:8px">Solution</h3>
            <p style="color:var(--text-muted);margin-bottom:12px">${problem.solutionExplanation}</p>
            <pre>${escapeHtml(problem.solution)}</pre>`;

        renderProblemList(getCurrentFilters());
    } else {
        showToast('Wrong Answer - Check the results tab', 'error');
    }

    const displayResult = allPassed ? lastResult : firstError;
    displayResult.runtime = runtime;
    renderResult(displayResult);
    switchTab('right', 'result');
}

// =============================================
// RENDER RESULTS
// =============================================
function renderResult(testResult) {
    const container = document.getElementById('resultContainer');

    if (testResult.error && !testResult.userResult) {
        container.innerHTML = `
            <div class="result-box error">
                <div class="result-header">
                    <span class="result-icon">!</span>
                    Runtime Error
                </div>
                <div class="result-error">${escapeHtml(testResult.error)}</div>
            </div>`;
        return;
    }

    const statusClass = testResult.pass ? 'accepted' : 'wrong';
    const statusText = testResult.pass ? 'Accepted' : 'Wrong Answer';
    const statusIcon = testResult.pass ? '✓' : '✗';

    let html = `
        <div class="result-box ${statusClass}">
            <div class="result-header">
                <span class="result-icon">${statusIcon}</span>
                ${statusText}
                ${testResult.runtime ? `<span style="margin-left:auto;font-weight:400;font-size:13px;color:var(--text-muted)">Runtime: ${testResult.runtime}ms</span>` : ''}
            </div>`;

    if (testResult.error && testResult.userResult) {
        html += `<div class="result-error" style="border-top:1px solid var(--border-color)">${escapeHtml(testResult.error)}</div>`;
    }

    if (testResult.userResult) {
        html += `<div class="result-body">
            <div class="test-case-result-label">Your Output:</div>
            <table class="result-table">
                <thead><tr>${testResult.userResult.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
                <tbody>${testResult.userResult.values.map(row =>
                    `<tr>${row.map(v => `<td>${v === null ? '<span style="color:var(--text-muted)">NULL</span>' : escapeHtml(String(v))}</td>`).join('')}</tr>`
                ).join('')}</tbody>
            </table>`;

        if (testResult.expectedResult && !testResult.pass) {
            html += `<div class="test-case-result-label" style="margin-top:12px">Expected Output:</div>
            <table class="result-table">
                <thead><tr>${testResult.expectedResult.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
                <tbody>${testResult.expectedResult.values.map(row =>
                    `<tr>${row.map(v => `<td>${v === null ? '<span style="color:var(--text-muted)">NULL</span>' : escapeHtml(String(v))}</td>`).join('')}</tr>`
                ).join('')}</tbody>
            </table>`;
        }

        if (testResult.extraRows && testResult.extraRows > 0) {
            html += `<p style="margin-top:8px;font-size:12px;color:var(--orange)">Note: ${testResult.extraRows} extra row(s) in output</p>`;
        }

        html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
}

// =============================================
// TEST CASES UI
// =============================================
function renderTestCases() {
    const container = document.getElementById('testCaseList');
    container.innerHTML = state.testCases.map((tc, i) => `
        <div class="test-case-item" data-id="${tc.id}">
            <div class="test-case-header">
                <span>Case ${i + 1}: ${escapeHtml(tc.description || '')}</span>
                ${state.testCases.length > 1 ? `<button class="test-case-delete" onclick="removeTestCase(${tc.id})">&times;</button>` : ''}
            </div>
            <textarea class="test-case-textarea" placeholder="Expected SQL output query..." onchange="updateTestCase(${tc.id}, this.value)">${escapeHtml(tc.expected)}</textarea>
        </div>
    `).join('');
}

function addTestCase() {
    const maxId = state.testCases.reduce((max, tc) => Math.max(max, tc.id), -1);
    state.testCases.push({ id: maxId + 1, expected: '', description: 'New test case', actual: '' });
    renderTestCases();
}

function removeTestCase(id) {
    state.testCases = state.testCases.filter(tc => tc.id !== id);
    renderTestCases();
}

function updateTestCase(id, value) {
    const tc = state.testCases.find(t => t.id === id);
    if (tc) tc.expected = value;
}

// =============================================
// EDITOR
// =============================================
function updateLineNumbers() {
    const editor = document.getElementById('sqlEditor');
    const gutter = document.getElementById('editorGutter');
    const lines = editor.value.split('\n').length;
    gutter.innerHTML = Array.from({ length: Math.max(lines, 20) }, (_, i) =>
        `<span class="line-num">${i + 1}</span>`
    ).join('');
}

function syncScroll() {
    const editor = document.getElementById('sqlEditor');
    const gutter = document.getElementById('editorGutter');
    gutter.scrollTop = editor.scrollTop;
}

// =============================================
// TABS
// =============================================
function switchTab(panel, tabName) {
    const prefix = panel === 'left' ? 'leftPanel' : 'rightPanel';
    const panelEl = document.getElementById(prefix);
    panelEl.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    panelEl.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    panelEl.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    if (panel === 'left') {
        if (tabName === 'description') document.getElementById('descriptionTab').classList.add('active');
        if (tabName === 'solution') document.getElementById('solutionTab').classList.add('active');
        if (tabName === 'submissions-tab') document.getElementById('submissionsTab').classList.add('active');
    } else {
        if (tabName === 'editor') document.getElementById('editorTab').classList.add('active');
        if (tabName === 'testcase') document.getElementById('testcaseTab').classList.add('active');
        if (tabName === 'result') document.getElementById('resultTab').classList.add('active');
    }
}

// =============================================
// FILTERS
// =============================================
function getCurrentFilters() {
    return {
        search: document.getElementById('searchInput').value,
        difficulty: document.getElementById('difficultyFilter').value,
        tag: document.getElementById('tagFilter').value
    };
}

// =============================================
// SUBMISSIONS PAGE
// =============================================
function renderAllSubmissions() {
    const tbody = document.getElementById('allSubmissionsBody');
    if (state.submissions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:40px">No submissions yet</td></tr>';
        return;
    }

    tbody.innerHTML = state.submissions.map(s => {
        const problem = PROBLEMS.find(p => p.id === s.problemId);
        return `<tr>
            <td><span class="difficulty-badge ${s.passed ? 'Easy' : 'Hard'}" style="font-size:12px">${s.passed ? 'Accepted' : 'Wrong'}</span></td>
            <td><a class="problem-title-link" href="#" onclick="openProblem(${s.problemId});return false">${problem ? problem.title : 'Unknown'}</a></td>
            <td style="color:var(--text-muted)">SQL</td>
            <td style="color:var(--text-muted)">${s.runtime || '-'}ms</td>
            <td style="color:var(--text-muted)">${new Date(s.date).toLocaleDateString()}</td>
        </tr>`;
    }).join('');
}

// =============================================
// LEADERBOARD
// =============================================
function renderLeaderboard() {
    const container = document.getElementById('leaderboardContainer');
    const fakeData = [
        { name: 'SQL_Master', solved: 15, avatar: 'S' },
        { name: 'QueryNinja', solved: 13, avatar: 'Q' },
        { name: 'DataWiz', solved: 11, avatar: 'D' },
        { name: 'JoinExpert', solved: 9, avatar: 'J' },
        { name: 'AggPro', solved: 7, avatar: 'A' },
        { name: 'WindowKing', solved: 5, avatar: 'W' },
        { name: 'CTEFan', solved: 3, avatar: 'C' },
    ];

    // Update your position
    const mySolved = Object.values(state.solvedProblems).filter(Boolean).length;
    if (mySolved > 0) {
        fakeData.push({ name: 'You', solved: mySolved, avatar: 'Y', isMe: true });
        fakeData.sort((a, b) => b.solved - a.solved);
    }

    container.innerHTML = fakeData.map((item, i) => `
        <div class="leaderboard-item" ${item.isMe ? 'style="border-color:var(--accent-primary)"' : ''}>
            <div class="leaderboard-rank">#${i + 1}</div>
            <div class="leaderboard-avatar" ${item.isMe ? 'style="background:var(--accent-primary);color:white"' : ''}>${item.avatar}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${item.name} ${item.isMe ? '(You)' : ''}</div>
                <div class="leaderboard-solved">${item.solved} problems solved</div>
            </div>
            <div class="leaderboard-score">${item.solved * 10}</div>
        </div>
    `).join('');
}

// =============================================
// EVENT BINDINGS
// =============================================
function bindEvents() {
    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    document.querySelector('.logo').addEventListener('click', () => navigateTo('problems'));

    // Back button
    document.getElementById('backBtn').addEventListener('click', () => {
        renderProblemList(getCurrentFilters());
        navigateTo('problems');
    });

    // Editor
    const editor = document.getElementById('sqlEditor');
    editor.addEventListener('input', updateLineNumbers);
    editor.addEventListener('scroll', syncScroll);

    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 4;
            updateLineNumbers();
        }
        // Ctrl/Cmd + Enter to run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runQuery();
        }
    });

    // Font size
    document.getElementById('editorFontSize').addEventListener('change', (e) => {
        editor.style.fontSize = e.target.value + 'px';
        document.getElementById('editorGutter').style.fontSize = e.target.value + 'px';
        updateLineNumbers();
    });

    // Buttons
    document.getElementById('runBtn').addEventListener('click', runQuery);
    document.getElementById('submitBtn').addEventListener('click', submitQuery);
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (state.currentProblem) {
            editor.value = state.currentProblem.defaultQuery || '';
            updateLineNumbers();
        }
    });
    document.getElementById('addTestCase').addEventListener('click', addTestCase);

    // Filters
    document.getElementById('searchInput').addEventListener('input', () => renderProblemList(getCurrentFilters()));
    document.getElementById('difficultyFilter').addEventListener('change', () => renderProblemList(getCurrentFilters()));
    document.getElementById('tagFilter').addEventListener('change', () => renderProblemList(getCurrentFilters()));

    // Panel tabs
    document.querySelectorAll('#leftPanel .panel-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab('left', tab.dataset.tab));
    });
    document.querySelectorAll('#rightPanel .panel-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab('right', tab.dataset.tab));
    });

    // Resize handle
    initResize();

    // Modal close
    document.getElementById('modalClose').addEventListener('click', () => {
        document.getElementById('modalOverlay').classList.add('hidden');
    });
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalOverlay')) {
            document.getElementById('modalOverlay').classList.add('hidden');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('modalOverlay').classList.add('hidden');
        }
    });
}

// =============================================
// RESIZE HANDLER
// =============================================
function initResize() {
    const handle = document.getElementById('resizeHandle');
    const leftPanel = document.getElementById('leftPanel');
    const rightPanel = document.getElementById('rightPanel');
    let isResizing = false;

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        handle.classList.add('active');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const container = document.querySelector('.workspace-layout');
        const rect = container.getBoundingClientRect();
        const offset = e.clientX - rect.left;
        const totalWidth = rect.width;
        const percentage = (offset / totalWidth) * 100;
        const clamped = Math.max(20, Math.min(80, percentage));

        leftPanel.style.width = clamped + '%';
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            handle.classList.remove('active');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

// =============================================
// UTILITIES
// =============================================
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showModal(title, bodyHtml) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('modalOverlay').classList.remove('hidden');
}
