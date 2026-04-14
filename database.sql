CREATE DATABASE tietovisa_db;
USE tietovisa_db;

Create table categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY;
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY;
    category_id INT,
    question_text TEXT NOT NULL,
    correct_anser VARCHAR(255) NOT NULL,
    options JSON NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY;
    title VARCHAR(255) NOT NULL;
    category_id INT,
    creator_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (creator_id) REFERENCES users(id)
)