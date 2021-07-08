const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//GET all posts
router.get('/', (req, res) => {
     Post.findAll({
          attributes: [
               'id',
               'title',
               'content',
               'created_at'
          ],
          order: [['created_at', 'DESC']],
          include: [
               {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                         model: User,
                         attributes: ['username']
                    }
               },
               {
                    model: User,
                    attributes: ['username']
               }
          ]
     })
     .then(dbPostData => res.json(dbPostData))
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//GET a single post
router.get('/:id', (req, res) => {
     Post.findOne({
          where: {
               id: req.params.id
          },
          attributes: [
               'id',
               'title',
               'content',
               'created_at'
          ],
          include: [
               {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                         model: User,
                         attributes: ['username']
                    }
               },
               {
                    model: User,
                    attributes: ['username']
               }
          ]
     })
     .then(dbPostData => {
          if (!dbPostData) {
               res.status(404).json({ message: 'No post found with this id.' });
               return;
          }
          res.json(dbPostData);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//POST a new blog entry
router.post('/', withAuth, (req, res) => {
     Post.create({
          title: req.body.title,
          content: req.body.content,
          user_id: req.session.user_id
     })
     .then(dbPostData => res.json(dbPostData))
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//Update blog entry
router.put('/:id', withAuth, (req, res) => {
     Post.update(
          {
               title: req.body.title,
               content: req.body.content
          },
          {
               where: {
                    id: req.params.id
               }
          }
     )
     .then(dbPostData => {
          if (!dbPostData){
               res.status(404).json({ message: 'No post found with this id.' });
               return;
          }
          res.json(dbPostData);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//DELETE blog entry and all comments
router.delete('/:id', (req, res) => {
     Comment.destroy({
          where: {
               post_id: req.params.id
          }
     })

     Post.destroy({
          where: {
               id: req.params.id
          }
     })
     .then(dbPostData => {
          if (!dbPostData) {
               res.status(404).json({ message: 'No post found with this id.' });
               return;
          }
          res.json(dbPostData);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

//POST new comment to blog entry
router.post('/:id', withAuth, (req, res) => {
     if (req.session) {
          Comment.create({
               comment_text: req.body.comment_text,
               post_id: req.params.id,
               user_id: req.session.user_id
          })
          .then(dbCommentData => res.json(dbCommentData))
          .catch(err => {
               console.log(err);
               res.status(400).json(err);
          });
     }
});


module.exports = router;