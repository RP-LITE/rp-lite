const router = require("express").Router();
const { UserObjects, User } = require("../../models");

// Get all user's creatures
router.get('/', async (req, res) => {
  try {
    const userID = req.session.user_id;
    const creatures = await UserObjects.findAll({
      where: {
        user_id: userID
      }
    });
    res.json(creatures);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

router.post('/:type', async (req, res) => {
  try {
    const type = req.params.type;
    if (!/rock|scissor|paper/.test(type)) {
      res.status(500).json('Invalid creature type');
      return;
    }
    const newObject = await UserObjects.create({
      user_id: req.session.user_id,
      [`${type}_lvl`]: 1,
      img: `/public/portratis/${type}.png`
    });
    res.json(newObject);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const userID = req.session.user_id;
    const existingObjects = await UserObjects.findAll({
      where: {
        user_id: userID
      }
    });
    if (existingObjects.length) {
      res.status(500).json('starter creatures already made');
      return;
    }
    res.json(newObjects);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userID = req.session.user_id;
    const creature = await UserObjects.findByPk(req.params.id);
    if (creature.user_id !== userID) {
      res.status(500).json('Cannot access other user creature');
      return;
    }
    creature.set({
      rock_lvl: req.body.rock_lvl || creature.rock_lvl,
      paper_lvl: req.body.paper_lvl || creature.paper_lvl,
      scissor_lvl: req.body.scissor_lvl || creature.scissor_lvl
    });
    creature.save();
    res.json(creature);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userID = req.session.user_id;
    const creature = await UserObjects.findByPk(req.params.id);
    if (!creature) {
      res.status(200).json('Creature already deleted');
      return
    } else if (creature.user_id !== userID) {
      res.status(500).json('Cannot access other user creature');
      return;
    }
    creature.destroy();
    res.json(creature);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
})

module.exports = router;