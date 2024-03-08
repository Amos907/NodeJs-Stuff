const mongoose = require("mongoose");
const express = require("express");
const { MongoClient } = require("mongodb");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const fs = require("fs");
const requireAuth = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// const dbURI =
//   "mongodb+srv://slikful:slikfulDB@cluster0.htmkpsz.mongodb.net/L-Node?retryWrites=true&w=majority&appName=Cluster0";

const dbURI =
  "mongodb://slikful:slikfulDB@ac-z5kkpj2-shard-00-00.htmkpsz.mongodb.net:27017,ac-z5kkpj2-shard-00-01.htmkpsz.mongodb.net:27017,ac-z5kkpj2-shard-00-02.htmkpsz.mongodb.net:27017/L-Node?ssl=true&replicaSet=atlas-rea49q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

// const client = new MongoClient(dbURI);

// const db = client.db("L-Node");

// async function run() {
//   try {
//     const blogs = db.collection("Blogs");

//     const query = { title: "What's Poppin'?" };
//     const blog = await blogs.findOne(query);
//     const results = blogs.find();

//     for await (const blog of results) {
//       console.log(blog);
//     }

//     console.log(blog);
//   } finally {
//     await client.close();
//   }
// }

// async function upload() {
//   try {
//     const blogs = db.collection("Blogs");

//     const blog = {
//       title: "This is a fancy blog.",
//       content: "This is a blog written by non-fancy people for fancy people.",
//       author: "Annonymous",
//     };

//     const res = await blogs.insertOne(blog);
//     console.log(res.insertedId);
//   } finally {
//     await client.close();
//   }
// }

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(5000, () => {
      console.log("App connected!!!");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// upload().catch(console.dir);
// run().catch(console.dir);

// routes

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/smoothies", requireAuth, (req, res) => {
  res.render("smoothies");
});

app.get("/set-cookies", (req, res) => {
  // Default way to use cookies...

  res.setHeader("Set-Cookie", 'authToken="qwertdyrtnkanc"');

  // using the cookie-parser middleware,
  // the cookie object is attached to the res and req objects.

  res.cookie("New Token", "kjkrenfkjkjrvkjrnjvnejvnkjnkje");

  // seting an epiration on the cookie.
  // By default, the cookie is valid till end of session

  res.cookie("Custom cookie.", "This cookie has a custom expiry!!", {
    // Expressed in milliseconds
    maxAge: 1000 * 60 * 60 * 24,
  });

  // Additional options

  res.cookie("HTTPS only", "Sent only in https connections", { secure: true });

  res.cookie("HTTP Only", "HTTP only", { httpOnly: true });
  res.send("You got some cookies!");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  res.json(cookies);
});

app.use(authRoutes);

// app.get("/view-file", function (req, res, next) {
//   fs.readFile("input_file.html", (err, data) => {
//     if (err) {
//       next(err);
//     } else {
//       res.send(data.toJSON());
//     }
//   });
// });
