const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');


router.post('/register', async(req, res) => {
  const { name, email, password } = req.body;
  // validate user before create new user
  const { error } = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const emailExist = await User.findOne({email});
  if(emailExist) {
    return res.status(400).send('Email already exists.');
  } else {
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    user.save()
      .then(user => {
        res.status(201).json({
          message: 'User created successfully.',
          user
        });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Problem on creating user',
          error,
        });
      });
  }
});

// LOGIN POST
router.post('/login', async(req, res, next) => {
  const { name, email, password } = req.body;
  
  // Login validation
  const {error} = loginValidation(req.body);
  if(error) res.status(400).send(error.details[0].message);

  const user = await User.findOne({email});
  if(!user) return res.status(404).send('Email or password does not exist.');

  // Check the password
  const validPassword = await bcrypt.compare(password, user.password);
  if(!validPassword) return res.status(400).send('Invalid password.');

  // Create and sign a token
  const token = JWT.sign({_id: user._id}, process.env.SECRET_KEY);
  res.header('auth-token', token).send({token});
});

module.exports = router;