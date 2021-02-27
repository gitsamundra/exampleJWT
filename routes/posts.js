const auth = require('./verifyToken');

const router = require('express').Router();

router.get('/', auth, (req, res) => {
  res.send(req.user);
  res.json({
    posts: {
      title: "My first post",
      discription: "Protected data verified by jsonwebtoken."
    }
  });
});

module.exports = router;