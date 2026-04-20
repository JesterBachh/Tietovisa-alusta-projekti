Зависимости: npm init -y
npm install express express-session mysql2 ejs dotenv bcrypt

Чтобы всё сработало добавьте .env файл в котором будет этот текст
PORT=3000
DB\*HOST=localhost
DB_USER=root
DB_PASSWORD=свой напишите
DB_NAME=tietovisa_db
SESSION_SECRET=super_secret_key

и перед тем как пушить апдейт создайте файл который называется .gitignore и напишите туда
node_modules/
.env

обновить зависимости надо
npm install bcrypt express-session
