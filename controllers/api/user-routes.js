const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//GET all users
router.get('/', (req, res) => {
     User.findAll({
          attributes: { exclude: ['password'] }
     })
     .then(dbUserData => res.json(dbUserData))
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//GET a single user
router.get('/:id', (req, res) => {
     User.findOne({
          attributes: { exclude: ['password'] },
          where: {
               id: req.params.id
          },

          include: [
               {
                    model: Post,
                    attributes: ['id', 'title', 'content']
               },
               {
                    model: Comment,
                    attributes: ['id', 'comment_text'],
                    include: {
                         model: Post,
                         attributes: ['title']
                    }
               },
          ]
     })
     .then(dbUserData => {
          if (!dbUserData) {
               res.status(404).json({ message: 'No user found with this id.' });
               return;
          }
          res.json(dbUserData);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//Create new user
router.post('/', (req, res) => {
     User.create({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
     })
     .then(dbUserData => {
          req.session.save(() => {
               req.session.user_id = dbUserData.id;
               req.session.username = dbUserData.username;
               req.session.loggedIn = true;

               res.json(dbUserData);
          });
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//Login to site
router.post('/login', (req, res) => {
     User.findOne({
          where: {
               username: req.body.username
          }
     })
     .then(dbUserData => {
          if (!dbUserData) {
               res.status(400).json({ message: 'No user by that name exists.' });
               return;
          }

          const validPassword = dbUserData.checkPassword(req.body.password);

          if(!validPassword) {
               res.status(400).json({ message: 'Incorrect username or password.  Please try again.' });
               return;
          }

          req.session.save(() => {
               req.session.user_id = dbUserData.id;
               req.session.username = dbUserData.username;
               req.session.loggedIn = true;

               res.json({ user: dbUserData, message: 'Logged In!' });
          });
     });
});

//Update user password
router.put('/:id', withAuth, (req, res) => {
     User.update(req.body, {
          individualHooks: true,
          where: {
               id: req.params.id
          }
     })
     .then(dbUserData => {
          if (!dbUserData[0]) {
               res.status(404).json({ message: 'No user found with this id.' });
               return;
          }
          res.json(dbUserData);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//DELETE user
router.delete('/:id', withAuth, (req, res) => {
     User.destroy({
          where: {
               id: req.params.id
          }
     })
     .then(dbUserData => {
          if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id.' });
          return;
          }
          res.json(dbUserData);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//Logout of session
router.post('/logout', (req, res) => {
     if (req.session.loggedIn) {
          req.session.destroy(() => {
               res.status(204).end();
          });
     } else {
          res.status(404).end();
     }
});


module.exports = router;