# Tietovisa-alusta (Quiz Platform)

A dynamic web application designed for creating and participating in interactive quizzes. Developed as a final project with a focus on role-based access control, content management, and modern user experience.

## 1. Description

**Tietovisa-alusta** is a platform where users can test their knowledge, learn from their mistakes, and create their own content. The project serves three main user types:

- **Learners (Olli):** Can take quizzes quickly without registration or logged in to track progress.
- **Creators (Tatiana):** Registered users who can build their own quizzes and manage their content.
- **Administrators (Mika):** Responsible for content quality, category management, and moderation.

## 2. Key Features

- **Categorization:** Quizzes are grouped by topics (e.g., Math, History, Science).
- **Guest Access:** Anyone can play quizzes immediately without an account.
- **Personal Dashboard:** Registered users can view their high scores and progress history.
- **Quiz Builder:** Interactive form to create quizzes, add questions, and set correct answers.
- **Admin Tools:** Full CRUD control over questions and categories with safety checks (e.g., cannot delete categories containing quizzes).
- **Modern UI:** Responsive design using a dynamic color palette.

## 3. Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** EJS (Embedded JavaScript), CSS3
- **Database:** MySQL / MariaDB
- **Authentication:** express-session, bcrypt (password hashing)
- **Design:** Google Fonts (Montserrat & Open Sans)

## 4. Team Members

- **[Denys Kosovych]:** Lead developer responsible for the architecture, database, middleware and controllers
- **[Niko Lempinen]:** Front-end developer with experience working with EJS files and CSS, and designing UI/UX
- **[Vjaceslavs Turcins]:** Back-end developer responsible for routes and models.
- **[Nikita Konoplya]:** Second front-end developer with experience working with EJS files and CSS, and designing user interfaces and user experience

## 5. Key Learnings

- Implementation of the MVC (Model-View-Controller) architecture.
- Managing relational database connections and complex SQL queries.
- Handling session-based authentication and role-based access control (RBAC).
- Following strict visual guidelines and style guides during development.

## 6. Installation and Setup Instructions

### Prerequisites

- Node.js installed
- MySQL/MariaDB server

### Setup Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd tietovisa-alusta
   ```

2. **Install Dependencies:**
   `npm install`

3. **Environment Configuration**

   ```bash
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password
   DB_NAME=tietovisa_db
   SESSION_SECRET=a_random_secure_string
   ```

4. **Database**

- Open mysql terminal
- Create a new database

```bash
CREATE DATABASE tietovisa_db;
```

- Import the provided SQL schema

```bash
mysql -u your_username -p tietovisa_db < database.sql
```

5. **Start the Application**
   `npm start`

6. **Admin Access**

- To access the admin panel (/admin/dashboard), log in with a user that has the admin role. You can manually set a user as admin in the database:

```bash
UPDATE users SET role = 'admin' WHERE username = 'YourUsername';
```
