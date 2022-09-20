const path = require('path');
const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    res.render('homepage');
});

router.get('/login', (req, res) => {
    // if (req.session.logged_in) {
    //   res.redirect('/profile');
    //   return;
    // }
    res.render('login');
  });

module.exports = router;