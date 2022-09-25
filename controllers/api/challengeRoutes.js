const router = require("express").Router();
const { TimeoutError, Op } = require("sequelize");
const { User, Challenges, UserObjects } = require("../../models");

const helpers = require('./challengeHelpers');

// Gets `all` challenges of the user, only those the user has `sent`, or only those the user has `received`.
router.get('/:subset', async (req, res) => {
  console.log(req.params.subset);
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
      include:[
        {
          model:User,
          as:'challenger',
          attributes:{exclude:['password']}
        },
        {
          model:User,
          as:'target',
          attributes:{exclude:['password']}
        },
        {
          model:UserObjects,
          as:'attacker'
        },
        {
          model:UserObjects,
          as:'defender'
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
    const attacker = await UserObjects.findByPk(data.challenge_object);
    if(attacker.user_id !== req.session.user_id) return res.status(500).json('Other user creature');
    // create the challenge
    const challenge = await Challenges.create({
      challenger_id: req.session.user_id,
      target_id: data.target_id,
      challenge_object: data.challenge_object
    });

    challenge.attacker = attacker;
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
    console.log('defender',defender.dataValues);
    if(defender.user_id !== req.session.user_id) return res.status(500).json('Other user creature');
    const challenge = await Challenges.findByPk(
      req.params.id,
      {
        include:[
          {
            model:User,
            as:'challenger',
            attributes:{exclude:['password','email']}
          },
          {
            model:User,
            as:'target',
            attributes:{exclude:['password','email']}
          },
          {
            model:UserObjects,
            as:'attacker'
          },
          {
            model:UserObjects,
            as:'defender'
          },
        ]
      }
    );
    if(challenge.target_id !== req.session.user_id) return res.status(500).json('Not defender');
    challenge.target_object = data.target_object;
    challenge.defender = defender;
    await helpers.resolve(challenge);
    // Update the challenge data
    await Promise.all([challenge.save(),challenge.attacker?.save(),challenge.defender?.save()]);

    // update the challengers
    req.updateChallengers(challenge);

    // Respond to the client
    res.json(challenge);

  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenges.findByPk(req.params.id);
    if(challenge.challenger_id !== req.session.user_id) return res.status(500).json('Not challenger');
    await challenge.destroy();
    res.json(challenge);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

module.exports = router;