const router = require("express").Router();
const { TimeoutError, Op } = require("sequelize");
const { User, Challenges, UserObjects } = require("../../models");
const fs = require('fs/promises');
const path = require('path');
const hbs = require('handlebars');

const helpers = require('./challengeHelpers');
const hbHelpers = require('../../utils/helper');
// Register the handlebar helpers
Object.entries(hbHelpers).forEach(([k,f])=>hbs.registerHelper(k,f));
let challengeModal;
let defendModal;
(async ()=>{
  const challengeForm = await fs.readFile(path.join(__dirname,'../../views/partials/challengeForm.handlebars'),'utf8');
  challengeModal = hbs.compile(challengeForm);
  const defendForm = await fs.readFile(path.join(__dirname,'../../views/partials/defendForm.handlebars'),'utf8');
  defendModal = hbs.compile(defendForm);
})();

// Add name search

// Searches for users to challenge
router.get('/search/:creatureID', async (req, res) => {
  try {
    const creature = await UserObjects.findByPk(req.params.creatureID);
    if(creature.user_id !== req.session.user_id) return res.status(500).json('Invalid creature');
    console.log('====== challengeModal ======',challengeModal);
    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: req.session.user_id
        }
      },
      attributes: {
        exclude: ['password', 'email']
      }
    });
    console.log('===== creature.id',creature.id);
    res.send(challengeModal({creatureID:creature.id,users}));
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
});

router.get('/defend/:challengeID',async (req,res)=>{
  try{
    const creatures = await UserObjects.findAll({where:{user_id:req.session.user_id,is_charming:false}});
    res.send(defendModal({ challengeID:req.params.challengeID, creatures }))
  }catch(err){
    console.log(err);
    res.status(500).json(err.message);
  }
});

// Gets `all` challenges of the user, only those the user has `sent`, or only those the user has `received`.
router.get('/:subset', async (req, res) => {
  // console.log(req.params.subset);
  try {
    const subsetKey = req.params.subset;
    if (!/^(?:all|sent|received)$/.test(subsetKey)) res.status(500).send('Invalid challenge query');
    const userID = req.session.user_id;
    const whereSwitch = {
      all: {
        [Op.or]: [
          { challenger_id: userID },
          { target_id: userID }
        ]
      },
      sent: {
        challenger_id: userID
      },
      received: {
        target_id: userID
      }
    };
    const activeChallenges = await Challenges.findAll({
      where: whereSwitch[subsetKey],
      include: [
        {
          model: User,
          as: 'challenger',
          attributes: { exclude: ['password', 'email'] }
        },
        {
          model: User,
          as: 'target',
          attributes: { exclude: ['password', 'email'] }
        },
        {
          model: UserObjects,
          as: 'attacker'
        },
        {
          model: UserObjects,
          as: 'defender'
        },
      ]
    });

    res.json(activeChallenges);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    // put the data in a shorter variable name
    const data = req.body;
    console.log('=====',data);
    const attacker = await UserObjects.findByPk(data.challenge_object);
    if(!attacker) return res.status(500).json('Invalid Creature');
    if (attacker.user_id !== req.session.user_id) return res.status(500).json('Other user creature');
    if (attacker.is_charming) return res.status(500).json('Creature already assigned');
    attacker.is_charming = true;
    await attacker.save();
    // create the challenge
    const challenge = await Challenges.create({
      challenger_id: req.session.user_id,
      target_id: data.target_id,
      challenge_object: data.challenge_object
    })
      .then(r => Challenges.findByPk(
        r.id,
        {
          include: [
            {
              model: User,
              as: 'challenger',
              attributes: { exclude: ['password', 'email'] },
              raw:true
            },
            {
              model: User,
              as: 'target',
              attributes: { exclude: ['password', 'email'] },
              raw:true
            },
            {
              model: UserObjects,
              as: 'attacker',
              raw:true
            }
          ]
        }
      )
      );
    console.log('=====Challenge Issued',challenge);
    // update the challengers
    req.updateChallengers(challenge);
    // Respond to the client
    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

// Complete a challenge
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const defender = await UserObjects.findByPk(data.target_object);
    // console.log('defender',defender.dataValues);
    if (defender.user_id !== req.session.user_id) return res.status(500).json('Other user creature');
    if (defender.is_charming) return res.status(500).json('Creature already assigned');
    const challenge = await Challenges.findByPk(
      req.params.id,
      {
        include: [
          {
            model: User,
            as: 'challenger',
            attributes: { exclude: ['password', 'email'] }
          },
          {
            model: User,
            as: 'target',
            attributes: { exclude: ['password', 'email'] }
          },
          {
            model: UserObjects,
            as: 'attacker'
          },
          {
            model: UserObjects,
            as: 'defender'
          }
        ]
      }
    );
    if (challenge.winner) {
      return res.status(500).json('challenge already resolved');
    }
    if (challenge.target_id !== req.session.user_id) return res.status(500).json('Not defender');
    challenge.target_object = data.target_object;
    challenge.set({ defender });
    await helpers.resolve(challenge);
    // Update the challenge data
    console.log('================');
    console.log('====defender',challenge.defender.dataValues);
    await Promise.all([challenge.attacker?.save(), challenge.defender?.save()]);
    // console.log('challenge',challenge);
    // update the challengers
    req.updateChallengers(challenge, 'delete');
    await challenge.destroy();

    // Respond to the client
    res.json(challenge);

  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenges.findByPk(
      req.params.id,
      {
        include: [
          {
            model: User,
            as: 'challenger',
            attributes: { exclude: ['password', 'email'] }
          },
          {
            model: User,
            as: 'target',
            attributes: { exclude: ['password', 'email'] }
          },
          {
            model: UserObjects,
            as: 'attacker'
          },
          {
            model: UserObjects,
            as: 'defender'
          }
        ]
      }
    );
    if (challenge.challenger_id !== req.session.user_id) return res.status(500).json('Not challenger');
    req.updateChallengers(challenge, 'delete');

    challenge.attacker.update({ is_charming: false });
    await challenge.destroy();
    res.json(challenge);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

module.exports = router;