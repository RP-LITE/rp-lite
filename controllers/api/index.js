const router = require('express').Router();
const userRoutes = require('./userRoutes');
const challengeRoutes = require('./challenegeRoutes')


router.use('/users', userRoutes);
router.use('/challenges', challengeRoutes);

module.exports = router;