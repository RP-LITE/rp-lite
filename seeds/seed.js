const sequelize = require('../config/connection');
const { User, UserObjects, Challenges } = require('../models');
const userSeedData = require('./userSeedData.json');

(async () => {
  await sequelize.sync({ force: true });
  const users = await User.bulkCreate(userSeedData);
  const userObjects = [];
  const challenges = [];
  users.forEach(user => {
    // Create some arbitrary creatures
    [1,4,8].forEach((n)=>{
      userObjects.push({
        user_id:user.id,
        type:'rock',
        rock_lvl: n,
        paper_lvl: Math.floor(n/4),
        img:'/public/portraits/rock.png'
      });
    });

    // Create some arbitrary challenges
    const target1 = user.id === 1 ?
      user.id + 1 :
      user.id - 1;
    const target2 = user.id === users.length ?
      user.id - 1 :
      user.id + 1;

    // Create a challenge that hasn't been responded to yet and a challenge that has been responded to and the user won.
    challenges.push(
      {
        challenger_id:user.id,
        target_id:target1,
        challenge_object:user.id * 3 - 1
      },
      {
        challenger_id:user.id,
        target_id:target2,
        challenge_object:user.id * 3,
        target_object:target2 * 3 - 2,
        winner:user.id
      }
    );
  });
  // Bulk create the arbitrary linkages
  const createObjects = await UserObjects.bulkCreate(userObjects);
  const baseChallenges = await Challenges.bulkCreate(challenges);


  console.log('all files seeded');
  process.exit(0);
})();
