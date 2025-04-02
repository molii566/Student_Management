# 🎓 Student Management System

A simple web-based student management system built with Node.js, Express, SQLite, and EJS. This application allows you to manage student records, including adding, updating, deleting, and printing student details.

## 🚀 Features

- Add, update, and delete student records.
- Filter and print student details by payment status and department.
- Secure admin login with hashed passwords.
- Session management using cookies.

## 🛠️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

## 📦 Packages Used

The following npm packages are used in this project:

- `express`
- `ejs`
- `sqlite3`
- `bcrypt`
- `cookie-session`
- `method-override`

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/molii566/Student_Management.git
   cd Student_Management
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000/students
   ```

## 🔑 Default Admin Credentials

- **Username**: `admin`
- **Password**: `sabo`

## 📂 Project Structure

```
Student_Management/
├── public/               # Static files (CSS, images, etc.)
├── views/                # EJS templates
├── students.db           # SQLite database file
├── server.js             # Main server file
├── README.md             # Project documentation
├── .gitignore            # Git ignore file
└── package.json          # npm configuration file
```

## 🛡️ Security

- Passwords are securely hashed using `bcrypt`.
- Sessions are managed using `cookie-session`.

## 📝 License

This project is licensed under the MIT License. Feel free to use and modify it as needed.

---

Made with ❤️ by [molii566](https://github.com/molii566)
