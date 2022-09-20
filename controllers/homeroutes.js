const path = require('path');
const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    console.log('io testing');
    const io = req.app.get('io');
    res.render('homepage');
    io.on('testReceive',(data)=>{
        console.log('data',data);
        console.log('test received');
    });
});

router.get('/login', (req, res) => {
    // if (req.session.logged_in) {
    //   res.redirect('/profile');
    //   return;
    // }
    res.render('login');
  });

module.exports = router;