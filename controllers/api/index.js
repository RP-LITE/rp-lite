const router = require("express").Router();
const challengeRoutes = require('./challengeRoutes')
const userRoutes = require("./userRoutes");
const profileRoutes = require("./profileRoutes");

router.use("/users/", userRoutes);
router.use("/profile/", profileRoutes);
router.use('/challenges/', challengeRoutes);

module.exports = router;
