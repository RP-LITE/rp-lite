const router = require("express").Router();
const { TimeoutError, Op } = require("sequelize");
const { User, Connection, Challenges } = require("../../models");

// Gets `all` challenges of the user, only those the user has `sent`, or only those the user has `received`.
router.get('/:subset',async (req,res)=>{
  console.log(req.params.subset);
  try{
    const subsetKey = req.params.subset;
    if(!/^(?:all|sent|received)$/.test(subsetKey)) res.status(500).send('Invalid challenge query');
    const userID = 1;
    const whereSwitch = {
      all:{
        [Op.or]:[
          {challenger_id:userID},
          {target_id:userID}
        ]
      },
      sent:{
        challenger_id:userID
      },
      received:{
        target_id:userID
      }
    };
    const activeChallenges = await Challenges.findAll({
      where: whereSwitch[subsetKey]
    });

    res.json(activeChallenges);
  }catch(err){
    console.error(err);
    res.status(500).json(err.message);
  }
});

module.exports = router;