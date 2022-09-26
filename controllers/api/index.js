const router = require("express").Router();
const challengeRoutes = require('./challengeRoutes')
const userRoutes = require("./userRoutes");
const profileRoutes = require("./profileRoutes");
const auth = require('../../utils/auth');

router.use("/users/", userRoutes);
// router.use("/profile/", auth.checkLogin, profileRoutes);
router.use("/profile/", profileRoutes); //temporary non-checkLogin version for testing. 

router.use('/challenges/', auth.checkLogin, challengeRoutes);

module.exports = router;
