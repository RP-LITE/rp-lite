const router = require("express").Router();
const { UserObjects } = require("../../models");


router.post('/', async (req,res) => {
  const rockObject = UserObjects.create({
    user_id:user.id,
    rock_lvl: 1,
    img:'/public/portraits/rock.png'
  });
  const paperObject = UserObjects.create({
    user_id:user.id,
    paper_lvl: 1,
    img:'/public/portraits/rock.png'
  });
  const scissorObject = UserObjects.create({
    user_id:user.id,
    scissor_lvl: 1,
    img:'/public/portraits/rock.png'
  });
  await Promise.all([rockObject,paperObject,scissorObject]);
})

module.exports = router;