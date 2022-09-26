const path = require('path');
const router = require('express').Router();
const auth = require('../utils/auth');
const { Challenges, UserObjects, User } = require("../models");

// const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  res.render('homepage', { logged_in: req.session.logged_in });
});

// router.get('/login', (req, res) => {
//   if (req.session.logged_in) {
//     res.redirect('/profile');
//     return;
//   }
//   res.render('login');
// });

// router.get("/profile", auth.checkLogin , async (req, res) => {
//   try {
//     console.log('getting profile');
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [
//         UserObjects,
//         {
//           model: Challenges,
//           as:'challenger',
//         },
//         {
//           model: Challenges,
//           as:'target',
//         }
//       ],
//       attributes:{
//         exclude:['password','email']
//       },
//     });
//     console.log(userData.dataValues);
//     res.render('profile', {
//       user:userData,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get("/profile", async (req, res) => {
  try {
    // console.log('getting profile');
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        UserObjects,
        {
          model: Challenges,
          as: 'challenger',
        },
        {
          model: Challenges,
          as: 'target',
        }
      ],
      attributes: {
        exclude: ['password', 'email']
      },
    });
    const userID = req.session.user_id;
    const creatures = await UserObjects.findAll({
      where: {
        user_id: userID
      }
    });
    const creatureIndex = creatures.map(creature => creature.get({ plain: true }));
    const tempObject = {
      id: 55
    }
    // console.log(userData.dataValues);
    res.render('profile', {
      user: userData,
      logged_in: true,
      creature: creatureIndex
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;