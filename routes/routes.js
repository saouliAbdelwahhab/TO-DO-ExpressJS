const router = require("express").Router();
const User = require("../models/users");

router.get("/", (req, res) => {
  let TodoList = req.user.todos;
  let firstname = req.user.firstname.toUpperCase();
  let todos = TodoList.filter(todo => {
    return !todo.done;
  });
  let doneTodos = TodoList.filter(todo => {
    return todo.done;
  });
  let fait = 0;
  let afaire = 0;
  TodoList.forEach(todo => {
    if (todo.done) {
      afaire++;
    } else {
      fait++;
    }
  });
  let compteur = { fait: fait, afaire: afaire, user: firstname };
  res.render("indexUser", {
    todos: todos,
    doneTodos: doneTodos,
    compteur: compteur
  });
  console.log(
    "fait " + compteur.fait,
    "afaire " + compteur.afaire,
    "username " + compteur.user,
    "compteur " + compteur
  );
});

router.post("/newuser", (req, res) => {
  let user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    Email: req.body.email,
    password: req.body.password
  });

  user
    .save()
    .then(() => {
      res.redirect("/login");
      console.log("add user succes");
    })
    .catch(() => {
      console.log("error d'enrigestrement user");
    });
});
router.post("/AddTodo", (req, res) => {
  let description = req.body.description;
  let userID = req.user._id;
  User.findById(userID, (err, user) => {
    if (err) throw err;

    user.todos.push({ description: description });

    user
      .save()
      .then(result => {
        console.log("Todo est bien ajouter a la list");
        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
      });
  });
});

router.post("/todos/:id/Fait", (req, res) => {
  user = req.user;
  let todoID = req.params.id;

  user.todos.forEach(todo => {
    if (todo._id.toString() === todoID) {
      todo.done = !todo.done;
      user.save().then(() => res.redirect("/"));
    }
  });
});

router.post("/todos/:id/delete", (req, res) => {
  user = req.user;
  let todoID = req.params.id;
  user.todos.forEach((todo, index) => {
    if (todo._id.toString() === todoID) {
      user.todos.splice(index, 1);
      user.save().then(() => res.redirect("/"));
    }
  });
});

module.exports = router;
