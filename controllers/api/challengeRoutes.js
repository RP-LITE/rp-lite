const router = require("express").Router();
const { TimeoutError, Op } = require("sequelize");
const { User, Challenges } = require("../../models");

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
      where: whereSwitch[subsetKey]
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
    // create the challenge
    const challenge = await Challenges.create({
      challenger_id: req.session.user_id,
      target_id: data.target_id,
      challenge_object: data.challenge_object
    });

    // update the challengers
    req.updateChallengers(challenge);

    // Respond to the client
    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const challenge = await Challenges.findByPk(
      req.params.id
    );

    console.log('challenge', challenge);

    challenge.target_object = data.target_object;
    challenge.winner = await helpers.resolve(challenge);
    // Update the challenge data
    await challenge.save();

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
    await challenge.destroy();
    res.json(challenge);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

module.exports = router;