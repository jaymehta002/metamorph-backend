const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Signup route
// router.post('/signup', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const newUser = new User({
//       email: req.body.email,
//       password: hashedPassword,
//     });
//     await newUser.save();
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('Error signing up:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.post('/login', async (req, res) => {
  try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid password' });
      }
      
      // Generate JWT token
      const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send token in response
      res.set('Authorization', `${token}`);
        
        // Send token in response
        res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
