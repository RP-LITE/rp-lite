const router = require("express").Router();
const { UserObjects, User } = require("../../models");
const { checkLogin } = require("../../utils/auth");
const fs = require('fs/promises');
const path = require('path');

const hbs = require('handlebars');

const hbHelpers = require('../../utils/helper');
// Register the handlebar helpers
Object.entries(hbHelpers).forEach(([k,f])=>hbs.registerHelper(k,f));
let multiClassModal;
let creatureCardTemplate;
(async ()=>{
  // const multiClassForm = await fs.readFile(path.join(__dirname,'../../views/partials/multiClassForm.handlebars'),'utf8');
  // multiClassModal = hbs.compile(multiClassForm);
  const creatureCard = await fs.readFile(path.join(__dirname,'../../views/partials/creatureCard.handlebars'),'utf8');
  hbs.registerPartial('creatureCard',creatureCard);
  const creatureCardWrap = await fs.readFile(path.join(__dirname,'../../views/partials/creatureCardWrap.handlebars'),'utf8');
  creatureCardTemplate = hbs.compile(creatureCardWrap);
})();
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

router.get('/:id',async (req,res)=>{
  try {
    const creature = await UserObjects.findByPk(req.params.id);

    res.json(creature);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
})

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
      type
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
      res.status(403).json('Cannot access other user creature');
      return;
    }
    // console.log('comparison', creature.experience >= creature.experience_threshold);
    if (creature.experience < creature.experience_threshold) {
      return res.status(500).json('insufficient experience');
    }

    const validAddTypes = ['rock', 'paper', 'scissor'].filter(s => s !== creature.type);
    const validRx = new RegExp(validAddTypes.join('|'));
    const primaryLvl = `${creature.type}_lvl`;
    if (req.body.add_type) {
      if (!validRx.test(req.body.add_type)) {
        return res.status(500).json('Invalid type addition');
      } else if ((creature[primaryLvl] + 1) % 4 !== 0) {
        return res.status(500).json('Cannot multiclass this level');
      }
    }

    const addLvl = req.body.add_type ?
      `${req.body.add_type}_lvl` :
      null;
    const setObj = {
      rock_lvl: creature.rock_lvl ?
        creature.rock_lvl + 1 :
        null,
      paper_lvl: creature.paper_lvl ?
        creature.paper_lvl + 1 :
        null,
      scissor_lvl: creature.scissor_lvl ?
        creature.scissor_lvl + 1 :
        null,
      experience: creature.experience - creature.experience_threshold,
      experience_threshold: creature.experience_threshold + creature[primaryLvl] + 1
    };
    if (addLvl) {
      setObj[addLvl] = (setObj[addLvl] || 0) + 1;
    }
    creature.set(setObj);
    await creature.save();
    const newCard = creatureCardTemplate(creature);
    console.log('====================');
    console.log('====================');
    console.log('newCard',newCard);
    console.log('====================');
    console.log('====================');
    res.send(newCard);
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