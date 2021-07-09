const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

//Render landing page
router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Render login page
router.get("/login", (req, res) => {
  res.render("login");
});

//Render signup page
router.get("/register", (req, res) => {
  res.render("signup");
});

//Render Dashboard
router.get("/dashboard", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      username: req.session.username,
    },

    include: [
      {
        model: Post,
        attributes: ["id", "title", "content", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: Comment,
        attributes: ["id", "comment_text"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  }).then((userPostData) => {
    const userData = userPostData.get({ plain: true });
    const post = userData.posts;
    const username = userData.username;
    const loggedIn = req.session.loggedIn;

    if (loggedIn) {
      res.render("dashboard", { post, username, userData, loggedIn });
    } else {
      res.render("login");
    }
  });
});

//Create new blog post
router.get("/add-blog", (req, res) => {
  if (req.session.loggedIn) {
    res.render("add-blog");
  } else {
    res.render("login");
  }
});

//View single blog entry
router.get("/posts/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then(userPostData => {
      if (!userPostData) {
        res.status(404).json({ message: "No post found with this id." });
        return;
      }
      const userData = userPostData.get({ plain: true });
      const loggedIn = req.session.loggedIn;
      if (req.session.loggedIn) {
        console.log('USERDATA', userData);
        res.render("view-post", { userData, loggedIn });
      } else {
        res.render("login");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Edit blog entry
router.get("/posts/edit/:id", (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "content", "created_at"],
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "created_at",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    })
      .then((userPostData) => {
        if (!userPostData) {
          res.status(404).json({ message: "No post found with this id." });
          return;
        }
        const userData = userPostData.get({ plain: true });

        res.render("edit-post", userData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;