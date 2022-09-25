const router = require("express").Router();
const { TimeoutError } = require("sequelize");
const { User, UserObjects } = require("../../models");



router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);
    
    const newObjects = await UserObjects.bulkCreate([
      {
        user_id: userData.id,
        rock_lvl: 1,
        img: '/public/portraits/rock.png'
      },
      {
        user_id: userData.id,
        paper_lvl: 1,
        img: '/public/portraits/paper.png'
      },
      {
        user_id: userData.id,
        scissor_lvl: 1,
        img: '/public/portraits/scissor.png'
      }
    ]);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json({...userData.dataValues,userobjects:newObjects});
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { user_name: req.body.user_name },
      include:[
        UserObjects
      ]
    });
    console.log('body', req.body);
    console.log('userData', userData);
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);
    console.log('validPassword', validPassword);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }
    console.log('Reached here');
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// router.get('/', async (req, res) => {
//   try {

//     const userData = await User.findAll();
//     res.json(userData);

//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


module.exports = router;
