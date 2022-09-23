const router = require("express").Router();
const challengeRoutes = require('./challengeRoutes')
const userRoutes = require("./userRoutes");
const profileRoutes = require("./profileRoutes");

// Protects routes that should be protected
const checkLogin = (req, res, next) => {
    if (req.session.logged_in) {
        next();
        return;
    }
    res.status(500).json('Not Logged in');
}

router.use("/users/", userRoutes);
router.use("/profile/", checkLogin, profileRoutes);
router.use('/challenges/', checkLogin, challengeRoutes);

module.exports = router;
