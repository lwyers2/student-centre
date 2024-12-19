-- Insert into school table
INSERT INTO school (id, school_name) VALUES
(1, 'Engineering School'),
(2, 'School of Arts'),
(3, 'Business School');

-- Insert into course table
INSERT INTO course (id, title, school, year, code) VALUES
(1, 'Computer Science', 1, 2024, 'CS001'),
(2, 'Mechanical Engineering', 1, 2024, 'ME001'),
(3, 'Graphic Design', 2, 2024, 'GD001'),
(4, 'Accounting', 3, 2024, 'ACC001');

-- Insert into role table
INSERT INTO role (id, name) VALUES
(1, 'Admin'),
(2, 'Teacher');

-- Insert into user table
INSERT INTO user (id, forename, surname, email, password, date_created, date_updated, role_id) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', 'hashed_password1', '2024-01-01', '2024-01-01', 1), -- John is Admin
(2, 'Jane', 'Smith', 'jane.smith@example.com', 'hashed_password2', '2024-01-01', '2024-01-01', 2), -- Jane is Teacher
(3, 'Alice', 'Johnson', 'alice.johnson@example.com', 'hashed_password3', '2024-01-01', '2024-01-01', 1), -- Alice is Admin
(4, 'Sarah', 'Ryan', 'sarah.ryan@example.com', 'hashed_password4', '2024-01-01', '2024-01-01', 2), -- Sarah is Teacher
(5, 'Mark', 'Smith', 'mark.smith@example.com', 'hashed_password5', '2024-01-01', '2024-01-01', 1), -- Mark is Admin
(6, 'Sam', 'Cave', 'sam.cave@example.com', 'hashed_password6', '2024-01-01', '2024-01-01', 2), -- Sam is Teacher
(7, 'Anthony', 'Johnstone', 'anthony.johnstone@example.com', 'hashed_password6', '2024-01-01', '2024-01-01', 1), -- Anthony is Admin
(8, 'Douglas', 'Pierce', 'douglas.pierce@example.com', 'hashed_password7', '2024-01-01', '2024-01-01', 2); -- Douglas is Teacher

-- Insert into student table
INSERT INTO student (id, forename, surname, student_code, email) VALUES
(1, 'Tom', 'Brown', 'S00000', 'tom.brown@email.com'),
(2, 'Mark', 'Eitzel', 'S00001', 'mark.eitzel@email.com'),
(3, 'David', 'Thomas', 'S00002', 'david.thomas@email.com'),
(4, 'John', 'Martyn', 'S00003', 'john.martyn@email.com'),
(5, 'Leonard', 'Cohen', 'S00004', 'leonard.cohen@email.com'),
(6, 'Richard', 'Dawson', 'S00005', 'richard.dawson@email.com'),
(7, 'Bruno', 'Schultz', 'S00006', 'brun.schultz@email.com'),
(8, 'David', 'Tibet', 'S00007', 'david.tibet@email.com'),
(9, 'Carissa', 'Weird', 'S00008', 'carissa.weird@email.com');

-- Insert into student_course table
INSERT INTO student_course (id, student_id, course_id) VALUES
(1, 1, 1), -- Tom Brown is in Computer Science
(2, 2, 2), -- Mark Eitzel is in Mechanical Engineering
(3, 3, 3), -- David Thomas is in Graphic Design
(4, 4, 4), -- John Martyn is in Accounting
(5, 5, 1), -- Leonard Cohen is in Computer Science0
(6, 6, 2), -- Richard Dawson is in Mechanical Engineering
(7, 7, 3), -- Bruno Schulz is in Graphic Design
(8, 8, 4), -- David Tibet is in Accounting
(9, 9, 1); -- Carissa Weird is in Computer Science


INSERT INTO user_course(id, user_id, course_id) VALUES
(1,1,1), -- John is Computer Science Admin
(2,2,1), -- Jane is Computer Science Teacher
(3,3,2), -- Alice is Mechanical Engineering Admin
(4,4,2), -- Sarah is Mechanical Engineering Teacher
(5,5,3), -- Mark is Graphical Design Admin
(6,6,3), -- Sam is Graphical Design Teacher
(7,7,4), -- Anthony is Accounting Admin
(8,8,4); -- Douglas is Accounting Teacher






-- Insert into module table
INSERT INTO module (id, title, QSIS_year, code, CATs, course_id, staff_id, semester) VALUES
(1 , 'CS1', 2024, 'CS001', 60, 1 , 2, 'AUTUMN'),
(2 , 'CS2', 2024, 'CS002', 60, 1 , 2, 'SPRING'),
(3 , 'CS Diss', 2024, 'CS003', 60, 1 , 2, 'FULL'),
(4 , 'ME1', 2024, 'ME001', 60, 2 , 4, 'AUTUMN'),
(5 , 'ME2', 2024, 'ME002', 60, 2 , 4, 'SPRING'),
(6 , 'ME Diss', 2024, 'ME003', 60, 2 , 4, 'FULL'),
(7 , 'GD1', 2024, 'GD001', 60, 3 , 6, 'AUTUMN'),
(8 , 'GD2', 2024, 'GD002', 60, 3 , 6, 'SPRING'),
(9 , 'GD Diss',  2024, 'GD003',60, 3, 6, 'FULL'),
(10 , 'AC1', 2024, 'AC001', 60, 4 , 8, 'AUTUMN'),
(11 , 'AC2', 2024, 'AC002', 60, 4 , 8, 'SPRING'),
(12 , 'AC Diss', 2024, 'AC003', 60, 4 , 8, 'FULL');
