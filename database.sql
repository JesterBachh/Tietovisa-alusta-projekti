DROP DATABASE IF EXISTS tietovisa_db;
CREATE DATABASE tietovisa_db;
USE tietovisa_db;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    question_text TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    options JSON NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INT,
    creator_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quiz_id INT,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

INSERT INTO categories (name) VALUES ('Math'), ('History'), ('Science'), ('Films');
INSERT INTO quizzes (title, category_id, creator_id) VALUES ('Math Basic Test', 1, NULL);

INSERT INTO questions (category_id, question_text, correct_answer, options) 
VALUES (1, 'What is 2 + 2?', '4', '["2", "4", "6", "8"]');

INSERT INTO questions (category_id, question_text, correct_answer, options) 
VALUES (1, 'What is 5 * 5?', '25', '["10", "20", "25", "30"]');