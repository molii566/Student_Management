const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const cookieSession = require("cookie-session");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  cookieSession({
    name: "session",
    keys: ["secret-key"], // Replace with a secure key
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database(path.join(__dirname, "students.db"), (err) => {
  if (!err) {
    db.run(
      `CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        major TEXT NOT NULL,
        paid TEXT NOT NULL,
        amountPaid REAL NOT NULL,
        telephone TEXT NOT NULL
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )`,
      () => {
        db.get(
          "SELECT * FROM admin WHERE username = ?",
          ["admin"],
          async (err, row) => {
            if (!row) {
              const hashedPassword = await bcrypt.hash("sabo", 10);
              db.run("INSERT INTO admin (username, password) VALUES (?, ?)", [
                "admin",
                hashedPassword,
              ]);
            }
          }
        );
      }
    );
  }
});

function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) return next();
  res.redirect("/students");
}

function restrictAccess(req, res, next) {
  const publicRoutes = ["/login", "/logout", "/students"];
  if (publicRoutes.includes(req.path) || req.session.isLoggedIn) return next();
  res.redirect("/students");
}

app.use(restrictAccess);

app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, students) => {
    if (err) res.status(500).send("Database error");
    else
      res.render("students", { students, isLoggedIn: req.session.isLoggedIn });
  });
});

app.get("/students/print", (req, res) => {
  db.all("SELECT * FROM students", [], (err, students) => {
    if (err) res.status(500).send("Database error");
    else res.render("print", { students });
  });
});

app.get("/students/print/:id", (req, res) => {
  db.get(
    "SELECT * FROM students WHERE id = ?",
    [req.params.id],
    (err, student) => {
      if (err) res.status(500).send("Database error");
      else if (student) res.render("print", { students: [student] });
      else res.status(404).send("Student not found");
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM admin WHERE username = ?",
    [username],
    async (err, admin) => {
      if (err) res.status(500).send("Database error");
      else if (admin && (await bcrypt.compare(password, admin.password))) {
        req.session.isLoggedIn = true;
        res.redirect("/students");
      } else res.status(401).send("Invalid credentials");
    }
  );
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/students");
});

app.post("/students", (req, res) => {
  const { name, age, major, paid, amountPaid, telephone } = req.body;
  db.run(
    "INSERT INTO students (name, age, major, paid, amountPaid, telephone) VALUES (?, ?, ?, ?, ?, ?)",
    [name, age, major, paid, amountPaid, telephone],
    (err) => {
      if (err) res.status(500).send("Database error");
      else res.redirect("/students");
    }
  );
});

app.put("/students/:id", (req, res) => {
  const updates = [];
  const params = [];

  if (req.body.name) {
    updates.push("name = ?");
    params.push(req.body.name);
  }
  if (req.body.age) {
    updates.push("age = ?");
    params.push(req.body.age);
  }
  if (req.body.major) {
    updates.push("major = ?");
    params.push(req.body.major);
  }
  if (req.body.paid) {
    updates.push("paid = ?");
    params.push(req.body.paid);
  }
  if (req.body.amountPaid) {
    updates.push("amountPaid = ?");
    params.push(req.body.amountPaid);
  }
  if (req.body.telephone) {
    updates.push("telephone = ?");
    params.push(req.body.telephone);
  }

  if (updates.length > 0) {
    const query = `UPDATE students SET ${updates.join(", ")} WHERE id = ?`;
    params.push(req.params.id);

    db.run(query, params, (err) => {
      if (err) res.status(500).send("Database error");
      else res.redirect("/students");
    });
  } else {
    res.status(400).send("No fields to update");
  }
});

app.delete("/students/:id", (req, res) => {
  db.run("DELETE FROM students WHERE id = ?", [req.params.id], (err) => {
    if (err) res.status(500).send("Database error");
    else res.redirect("/students");
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
