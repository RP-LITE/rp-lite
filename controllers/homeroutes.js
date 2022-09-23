const path = require('path');
const router = require('express').Router();
const withAuth = require('../utils/auth');
const { Challenges, UserObjects, User } = require("../models");

// const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  res.render('homepage', { logged_in: req.session.logged_in });
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('login');
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: UserObjects }, { model: Challenges }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;