const router = require("express").Router();
const { TimeoutError } = require("sequelize");
const { User } = require("../../models");



router.post("/login", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.get('/', async (req, res) => {
  try {
    
    const userData = await User.findAll();
    res.json(userData);
    
  } catch (err) {
    res.status(500).json(err);
  }
}); 


module.exports = router;
