const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//GET all comments
router.get('/', (req, res) => {
     Comment.findAll({
          attributes: [
               'comment_text',
               'post_id',
               'user_id'
          ]
     })
     .then(dbCommentData => {
          if (!dbCommentData) {
               res.status(404).json({ message: 'No comments found!' });
               return;
          }
          res.json(dbCommentData);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     })
});



//DELETE comment
router.delete('/:id', withAuth, (req, res) => {
     Comment.destroy({
          where: {
               id: req.params.id
          }
     })
     .then(dbCommentData => {
          if (!dbCommentData)  {
               res.status(404).json({ message: 'No comment found with this id.' });
               return;
          }
          res.json(dbCommentData);
     })
     .catch(err => {
          console.log(err);
          res.status(500).json(err);
     });
});

module.exports = router;